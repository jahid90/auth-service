import _ from 'lodash';

import encryptionService from '../services/encryption';
import tokenService from '../services/token';
import logger from '../shared/Logger';
import User, { UserDocument } from '../models/User';

export interface LoginRequest {
    username?: string;
    email?: string;
    password: string;
}

export interface LoginResponse {
    username: string;
    email: string;
    token: string;
}

export interface LoginError {
    username?: string;
    email?: string;
    password?: string;
}

const validate = (req: LoginRequest): LoginError => {
    const errors: LoginError = {};

    // Inputs cannot be empty
    if (req.username && req.username.trim() === '') {
        errors.username = 'Input params cannot be empty';
    }
    if (req.email && req.email.trim() === '') {
        errors.email = 'Input params cannot be empty';
    }
    if (req.password === '') {
        errors.password = 'Input params cannot be empty';
    }

    // Early exit for empty input
    if (!_.isEmpty(errors)) {
        return errors;
    }

    if (!req.username && !req.email) {
        errors.username = 'One of username or email must be provided';
        errors.email = 'One of username or email must be provided';
    }

    return errors;
};

const login = async (req: LoginRequest): Promise<LoginResponse> => {
    // Check if user exists
    let user: UserDocument;
    if (req.username) {
        user = await User.findOne({ username: req.username });
    } else {
        user = await User.findOne({ email: req.email });
    }
    if (!user) {
        logger.warn('User not found');
        throw new Error('No such user found');
    }

    const { username, email, password, token } = user;

    // Validate password
    const validPassword: boolean = await encryptionService.validate(
        req.password,
        password
    );
    if (!validPassword) {
        logger.warn(`[${username}] Password mismatch`);
        throw new Error('Authentication error');
    }

    // Generate a new token
    user.token = tokenService.generate({
        username,
        email,
    });
    await user.save();

    // Return a response shape
    return {
        username,
        email,
        token,
    };
};

export default {
    login,
    validate,
};
