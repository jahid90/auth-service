import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import service, { LoginResponse } from '../services/login';

const router: Router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
    (async () => {
        try {
            service.validate(req.body);
            const response: LoginResponse = await service.login(req.body);

            res.status(StatusCodes.OK).send(response);
        } catch (err) {
            next(err);
        }
    })();
});

export default router;
