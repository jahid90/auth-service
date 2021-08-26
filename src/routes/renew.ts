import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import service from '../services/token';
import validateRefreshToken from '../middlewares/validate-refresh-token';

const router: Router = Router();

/**
 * API will return a ClientError on failure.
 *
 * The error will contain an attribute named `code`. Below are its interpretations:
 *   code = 4001    The refresh token version was invalid. User needs to log in again.
 *   code = 4002    The user encoded by the refresh token does not exist in the db.
 *   code = 4003    The refresh token was invalid.
 */

// Can't use 'authenticate' middleware on token renewal route as the request
// might be due to an expired token and the middleware will never let it through.
// We check only the refresh token to issue a new access token.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.post('/', validateRefreshToken(), (req: Request, res: Response, _next: NextFunction): void => {
    (async () => {
        const accessToken = await service.renew(req);

        res.status(StatusCodes.CREATED).send({ accessToken });
    })();
});

export default router;
