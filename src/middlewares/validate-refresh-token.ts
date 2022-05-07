import { NextFunction, Request, Response } from 'express';
import logger from '../shared/logger';
import { UserNotAuthorizedError, UserNotFoundError, UserNotLoggedInError } from '../errors/client-error';
import { Token } from '../models/Token';
import { validateRefreshToken } from '../services/token';
import User from '../models/User';

const middleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        (async () => {
            try {
                logger.warn(`Cookies: ${JSON.stringify(req.cookies)}`);

                const refreshToken = req.cookies.token;
                const payload = validateRefreshToken(refreshToken as string) as Token;

                logger.debug(`Token payload: ${JSON.stringify(payload)}`);

                const user = await User.findOneByUsername(payload.username);

                if (!user) {
                    // This can happen when the renewal request comes after the user has been deleted
                    const error = new UserNotFoundError();
                    error.code = 4003;
                    throw error;
                }

                if (user) {
                    // Ensure token version matches with that in db
                    if (payload.tokenVersion !== user.tokenVersion) {
                        const error = new UserNotLoggedInError();
                        error.code = 4001;
                        throw error;
                    }
                }

                req.user = user;

                next();
            } catch (err: any) {
                const clientError = new UserNotAuthorizedError();
                clientError.push(err.message as string);

                next(clientError);
            }
        })();
    };
};

export default middleware;
