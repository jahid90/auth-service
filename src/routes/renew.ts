import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import service from '../services/token';

const router: Router = Router();

/**
 * API will return a ClientError on failure.
 *
 * The error will contain an attribute named `code`. Below are its interpretations:
 *   code = 4001    The refresh token version was invalid. User needs to log in again.
 *   code = 4002    The user encoded by the refresh token does not exist in the db.
 *   code = 4003    The refresh token was invalid.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.post('/', (req: Request, res: Response, _next: NextFunction): void => {
    (async () => {
        const accessToken = await service.renew(req);

        res.status(StatusCodes.CREATED).send({ accessToken });
    })();
});

export default router;
