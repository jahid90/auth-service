import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import service from '../services/registration';

const router: Router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
    (async () => {
        try {
            await service.validate(req.body);
            await service.register({
                ...req.body,
                createdAt: new Date().toISOString(),
            });

            res.status(StatusCodes.CREATED).send();
        } catch (err) {
            next(err);
        }
    })();
});

export default router;
