import { Request, Response, NextFunction } from 'express';

import { BadAuthorizationHeaderError, MissingAuthorizationHeaderError } from '../errors/client-error';
import logger from '../shared/logger';
import tokenService from '../services/token';
import { Token } from 'src/models/Token';

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

const validateToken = (token: string): void => {
    tokenService.validateAccessToken(token);
}

const middleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {

        try {

            validateRequest(req);
            const token = extractToken(req);
            validateToken(token);

            logger.debug(`extracted authentication token: ${token} from header`);

            req.token = token;

            next();

        } catch (err) {
            logger.error(err.message);
            res.status(err.status).json({ error: err });
        }
    }
};

export default middleware;
