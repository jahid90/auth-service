import jsonwebtoken from 'jsonwebtoken';
import { Request } from 'express';

import logger from '../shared/logger';
import { BadAuthenticationTokenError, BadAuthorizationHeaderError } from '../errors/client-error';
import { Token } from '../models/Token';

const {
    ACCESS_TOKEN_SECRET = 'dev_a',
    ACCESS_TOKEN_VALIDITY = '10m',      // 10 mins by default
    REFRESH_TOKEN_SECRET = 'dev_s',
    REFRESH_TOKEN_VALIDITY = '7d',      // 7 days by default
} = process.env;

export const generateAccessToken = (payload: Token): string => {
    return jsonwebtoken.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_VALIDITY });
};

export const validateAccessToken = (token: string): string | Token => {
    try {
        logger.debug(`Received acces token: ${token} for validation`);
        return jsonwebtoken.verify(token, ACCESS_TOKEN_SECRET) as Token;
    } catch (err) {
        logger.warn(`token: ${token}, err: ${err.message as string}`);
        throw new BadAuthenticationTokenError();
    }
};

export const generateRefreshToken = (payload: Token): string => {
    return jsonwebtoken.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_VALIDITY });
};

export const validateRefreshToken = (token: string): string | Token => {
    try {
        logger.debug(`Received refresh token: ${token} for validation`);
        return jsonwebtoken.verify(token, REFRESH_TOKEN_SECRET) as Token;
    } catch (err) {
        logger.warn(`token: ${token}, err: ${err.message as string}`);
        // domain shouldn't know about how it is being used!
        // Alos, not sent as a header, but as a cookie!
        throw new BadAuthorizationHeaderError();
    }
};

const renew = async (req: Request): Promise<string> => {

    const user = req.user;

    const generatedToken = generateAccessToken({
        username: user.username,
        email: user.email,
        roles: user.roles,
    });

    return new Promise((resolve) => {
        resolve(generatedToken);
    })
};

export default {
    renew,
    validateAccessToken,
    validateRefreshToken,
};
