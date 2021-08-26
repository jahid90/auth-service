import jsonwebtoken from 'jsonwebtoken';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '../shared/logger';
import ClientError, { BadAuthenticationTokenError, BadAuthorizationHeaderError } from '../errors/client-error';
import { Token } from '../models/Token';
import User from '../models/User';

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
        throw new BadAuthorizationHeaderError();
    }
};

const renew = async (req: Request): Promise<string> => {
    // validate the refresh token
    const refreshToken = req.cookies.token;
    const payload = validateRefreshToken(refreshToken) as Token;

    const user = await User.findOneByUsername(payload.username);

    if (user) {
        // Ensure token version matches with that in db
        if (payload.tokenVersion !== user.tokenVersion) {
            const error = new ClientError('Are you logged in?', StatusCodes.FORBIDDEN);
            // Invalid refresh token; user needs to first login!
            error.code = 4001;
            throw error;
        }

        return generateAccessToken({
            username: user.username,
            email: user.email,
            roles: user.roles,
        });
    }

    // This can happen when the renewal request comes after the user has been deleted
    const error = new ClientError('Could not find user', StatusCodes.FORBIDDEN);
    error.code = 4003;
    throw error;
};

export default {
    renew,
    validateAccessToken
};
