import { io } from '../http';
import { ConnectionsService } from '../services/ConnectionsService';
import { UsersService } from '../services/UsersService';
import { MessagesService } from '../services/MessageService';

interface IParams {
    text: string;
    email: string;
}

io.on('connect', (socket) => {
    const connectionService = new ConnectionsService();
    const usersService = new UsersService();
    const messagesService = new MessagesService();
    let user_id = null;

    socket.on('client_first_access', async (params: IParams) => {
        const socket_id = socket.id;
        const { text, email } = params;

        const userExists = await usersService.findByEmail(email);

        if (!userExists) {
            const user = await usersService.create(email);

            await connectionService.create({
                socket_id,
                user_id: user.id
            })

            user_id = user.id;
        }
        else {

            const connection = await connectionService.findByUserId(userExists.id);

            if (!connection) {
                await connectionService.create({
                    socket_id,
                    user_id: userExists.id
                })
            }
            else {
                connection.socket_id = socket_id
                await connectionService.create(connection); 
            }

            user_id = userExists.id;
        }

        await messagesService.create({
            text,
            user_id
        });

        const allMessages = await messagesService.listByUser(user_id);

        socket.emit('client_list_all_messages', allMessages);

        const allUsers = await connectionService.findAllWithoutAdmin()
        io.emit('admin_list_all_users', allUsers);
    });

    socket.on('client_send_to_admin', async params => {
        const { text, socket_admin_id } = params;

        const socket_id = socket.id;

        const { user_id } = await connectionService.findBySocketID(socket_id);

        const message = await messagesService.create({
            text,
            user_id
        });

        io.to(socket_admin_id).emit('admin_receive_message', {
            message,
            socket_id
        });
    })
});