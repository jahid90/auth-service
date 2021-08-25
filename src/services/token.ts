import jsonwebtoken from 'jsonwebtoken';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '../shared/logger';
import ClientError, { BadAuthenticationTokenError, BadAuthorizationHeaderError } from '../errors/client-error';
import { Token } from '../models/Token';
import User from '../models/User';

const { ACCESS_TOKEN_SECRET = 'dev_a', REFRESH_TOKEN_SECRET = 'dev_s' } = process.env;

export const generateAccessToken = (payload: Token): string => {
    return jsonwebtoken.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
};

export const validateAccessToken = (token: string): string | Token => {
    try {
        return jsonwebtoken.verify(token, ACCESS_TOKEN_SECRET) as Token;
    } catch (err) {
        logger.warn(`token: ${token}, err: ${err.message as string}`);
        throw new BadAuthenticationTokenError();
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

    // This can happen when the renewal request comes ater the user has been deleted
    const error = new ClientError('Could not find user', StatusCodes.FORBIDDEN);
    error.code = 4003;
    throw error;
};

export default {
    renew,
    validateAccessToken
};
