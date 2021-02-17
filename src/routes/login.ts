import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import service, { LoginResponse } from '../services/login';

const router: Router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
    (async () => {
        try {
            service.validate(req.body);
            const response: LoginResponse = await service.login(req.body);

            // Set refresh token as a http-only token and send the access token
            res.cookie('token', response.refreshToken, { httpOnly: true, path: '/renew' });
            res.status(StatusCodes.OK).send({ accessToken: response.accessToken });
        } catch (err) {
            next(err);
        }
    })();
});

export default router;
