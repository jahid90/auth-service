import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import service, { RegistrationResponse } from '../services/registration';

const router: Router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
    (async () => {
        try {
            await service.validate(req.body);
            const response: RegistrationResponse = await service.register({
                ...req.body,
                createdAt: new Date().toISOString(),
            });

            res.status(StatusCodes.CREATED).send(response);
        } catch (err) {
            next(err);
        }
    })();
});

export default router;
