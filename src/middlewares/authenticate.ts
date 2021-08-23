import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '../shared/logger';
import ClientError from '../services/ClientError';

const validate = (req: Request): void => {
    // Check if authorization header was provided
    if (!req.headers || !req.headers.authorization) {
        const error = new ClientError(
            'Missing authorization header',
            StatusCodes.FORBIDDEN
        );
        error.data = {};
        error.data.header = 'An authorization header must be provided';

        throw error;
    }
};

const extractToken = (req: Request): string => {
    const authHeader = req.headers.authorization as string;
    if (!authHeader.startsWith('Bearer ')) {
        const error = new ClientError(
            'Bad authorization header',
            StatusCodes.FORBIDDEN
        );
        error.data = {};
        error.data.header =
            "Authorization header must be of the form <'Authorization': 'Bearer token'>";

        throw error;
    }

    // Return the parsed token
    return authHeader.split('Bearer ')[1];
};

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        validate(req);
        req.token = extractToken(req);
        next();
    } catch (err) {
        logger.error(err.message);
        res.status(err.status).json({ error: err });
    }
};

export default authenticate;
