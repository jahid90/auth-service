import jsonwebtoken from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import logger from '../shared/logger';
import ClientError from './ClientError';
import { Token } from '../models/Token';

const { ACCESS_TOKEN_SECRET = 'dev_a', REFRESH_TOKEN_SECRET = 'dev_s' } = process.env;

export const generateAccessToken = (payload: Token): string => {
    return jsonwebtoken.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
};

export const validateAccessToken = (token: string): string | Token => {
    try {
        return jsonwebtoken.verify(token, ACCESS_TOKEN_SECRET) as Token;
    } catch (err) {
        logger.warn(`token: ${token}, err: ${err.message as string}`);
        throw new ClientError(err.message, StatusCodes.FORBIDDEN);
    }
};

export const generateRefreshToken = (payload: Token): string => {
    return jsonwebtoken.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const validateRefreshToken = (token: string): string | Token => {
    try {
        return jsonwebtoken.verify(token, REFRESH_TOKEN_SECRET) as Token;
    } catch (err) {
        logger.warn(`token: ${token}, err: ${err.message as string}`);
        throw new ClientError(err.message, StatusCodes.FORBIDDEN);
    }
};
