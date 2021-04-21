import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SettingsRepository } from '../repositories/SettingsRepository';

class SettingsController {

    async create(req: Request, res: Response) {
        const { chat, username } = req.body;

        const settingsRepositorys = getCustomRepository(SettingsRepository);

        const settings = settingsRepositorys.create({
            chat,
            username
        });

        await settingsRepositorys.save(settings);

        return res.json(settings);
    }

}

export { SettingsController };