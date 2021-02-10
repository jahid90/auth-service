import jsonwebtoken from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import logger from '../shared/logger';
import ClientError from './ClientError';
import { Token } from '../models/Token';

const { JWT_SECRET = 'dev' } = process.env;

const generateToken = (payload: Token, secret?: string): string => {
    return jsonwebtoken.sign(
        payload,
        secret ? secret + JWT_SECRET : JWT_SECRET,
        { expiresIn: '1d' }
    );
};

const validateToken = (token: string, secret?: string): string | Token => {
    try {
        return jsonwebtoken.verify(
            token,
            secret ? secret + JWT_SECRET : JWT_SECRET
        ) as Token;
    } catch (err) {
        logger.warn(`token: ${token}, err: ${err.message as string}`);
        throw new ClientError(err.message, StatusCodes.FORBIDDEN);
    }
};

export default {
    generate: generateToken,
    validate: validateToken,
};
