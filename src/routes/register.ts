import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IUser } from '../models/User';

import service, { RegistrationRequest } from '../services/registration';

const router: Router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
    (async () => {
        try {
            await service.validate(req.body as RegistrationRequest);

            const user: IUser = {
                ...req.body,
                createdAt: new Date().toISOString(),
            };
            await service.register(user);

            res.status(StatusCodes.CREATED).send();
        } catch (err) {
            next(err);
        }
    })();
});

export default router;
