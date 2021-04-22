import { Request, Response } from 'express';
import { MessagesService } from '../services/MessageService';

class MessagesController {
    async create(req: Request, res: Response) {
        const { admin_id, user_id, text } = req.body;

        const messageService = new MessagesService();

        const message = await messageService.create({
            admin_id,
            user_id,
            text
        });

        return res.json(message)
    }

    async showByUser(req: Request, res: Response) {
        const { id } = req.params;

        const messagesService = new MessagesService();

        const list = await messagesService.listByUser(id);

        return res.json(list);
    }
}

export { MessagesController };