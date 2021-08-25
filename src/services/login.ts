import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';

import encryptionService from '../services/encryption';
import logger from '../shared/logger';
import ClientError from '../errors/client-error';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../services/token';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

const validate = (req: LoginRequest): void => {
    // Accumulate errors
    const error = new ClientError('Bad input', StatusCodes.BAD_REQUEST);

    if (_.isEmpty(req.username)) {
        error.push('Username cannot be missing or empty');
    }
    if (_.isEmpty(req.password)) {
        error.push('Password cannot be missing or empty');
    }

    if (error.data) {
        throw error;
    }
};

const login = async (req: LoginRequest): Promise<LoginResponse> => {
    // Check if user exists
    const user = await User.findOneByUsername(req.username);
    if (!user) {
        logger.warn('User not found');
        throw new ClientError('Incorrect credentials', StatusCodes.UNAUTHORIZED);
    }

    const { username, email, password, roles, tokenVersion } = user;

    // Validate password
    const validPassword = await encryptionService.validate(req.password, password);
    if (!validPassword) {
        logger.warn(`[${username}] Password mismatch`);
        throw new ClientError('Incorrect credentials', StatusCodes.UNAUTHORIZED);
    }

    // Generate access token
    const accessToken = generateAccessToken({
        username,
        email,
        roles,
    });

    // Generate refresh token
    const refreshToken = generateRefreshToken({
        username,
        tokenVersion,
    });

    // Save the refresh token in the db
    user.token = refreshToken;
    user.save();

    // Return a response shape
    return {
        accessToken,
        refreshToken,
    };
};

export default {
    login,
    validate,
};
