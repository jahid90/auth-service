import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import service from '../services/logout';

const router: Router = Router();

router.delete('/', (req: Request, res: Response, next: NextFunction): void => {
    (async () => {
        try {
            await service.logout(req);

            res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    })();
});

export default router;
