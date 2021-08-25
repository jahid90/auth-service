import { Request, Response, NextFunction } from 'express';

import { BadAuthorizationHeaderError, MissingAuthorizationHeaderError, UserNotFoundError, UserNotLoggedInError } from '../errors/client-error';
import logger from '../shared/logger';
import tokenService from '../services/token';
import User from '../models/User';
import { Token } from '../models/Token';

const validateRequest = (req: Request): void => {
    if (!req.headers || !req.headers.authorization) {
        logger.warn('Request is missing authorization header');
        throw new MissingAuthorizationHeaderError();
    }
};

const extractToken = (req: Request): string => {
    const authHeader = req.headers.authorization as string;

    if (!authHeader.startsWith('Bearer ')) {
        logger.warn(`Request authorization header is invalid: ${authHeader}`);
        throw new BadAuthorizationHeaderError();
    }

    // Return the parsed token
    return authHeader.split('Bearer ')[1];
};

const validateToken = (token: string): (string | Token) => {
    return tokenService.validateAccessToken(token);
}

const middleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        (async() => {
            try {

                validateRequest(req);

                const token = extractToken(req);
                const payload = validateToken(token) as Token;

                const user = await User.findOneByUsername(payload.username);
                if (!user) {
                    // This can happen when the renewal request comes after the user has been deleted
                    logger.warn(`User with username: ${payload.username} was not found`);
                    throw new UserNotFoundError();
                }

                req.user = user;

                logger.debug(`Request is authenticated for user: ${payload.username}`);

                next();

            } catch (err) {
                logger.error(err.message);
                res.status(err.status).json({ error: err });
            }
        })();

    }
};

export default middleware;
