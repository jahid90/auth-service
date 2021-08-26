import { isNotEmpty, isNotMissing, isString } from '../validators/commons';
import { generateAccessToken, generateRefreshToken } from './token';
import { BadRequestError, IncorrectCredentialsError } from '../errors/client-error';
import { ValidationFailures } from '../validators/validation-failures';
import encryptionService from '../services/encryption';
import logger from '../shared/logger';
import validate from './validations';
import User from '../models/User';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

const validateLogin = async (req: LoginRequest): Promise<void> => {

    const failures1 = await validate({ prop: req.username, name: 'username' }, [isNotMissing, isString, isNotEmpty]);
    const failures2 = await validate({ prop: req.password, name: 'password' }, [isNotMissing, isString, isNotEmpty]);

    const failures = new ValidationFailures();
    failures1 && failures.merge(failures1);
    failures2 && failures.merge(failures2);

    if (!failures.isEmpty()) {
        const error = new BadRequestError();
        failures.failures.forEach(f => error.push(f));

        throw error;
    }
};

const login = async (req: LoginRequest): Promise<LoginResponse> => {
    // Check if user exists
    const user = await User.findOneByUsername(req.username);
    if (!user) {
        logger.warn('User not found');
        throw new IncorrectCredentialsError();
    }

    const { username, email, password, roles, tokenVersion } = user;

    // Validate password
    const validPassword = await encryptionService.validate(req.password, password);
    if (!validPassword) {
        logger.warn(`[${username}] Password mismatch`);
        throw new IncorrectCredentialsError();
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
    validate: validateLogin
};
