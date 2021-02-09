import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import service from '../services/logout';

const router: Router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
    (async () => {
        try {
            await service.logout(req);

            res.status(StatusCodes.OK).send();
        } catch (err) {
            next(err);
        }
    })();
});

export default router;
