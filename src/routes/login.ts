import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import service from '../services/login';

const router: Router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
    (async () => {
        try {
            await service.validate(req.body);
            const response = await service.login(req.body);

            // Set refresh token as a http-only token and send the access token
            res.cookie('token', response.refreshToken, { httpOnly: true, path: '/renew' });
            res.status(StatusCodes.OK).json({ accessToken: response.accessToken });
        } catch (err) {
            next(err);
        }
    })();
});

export default router;
