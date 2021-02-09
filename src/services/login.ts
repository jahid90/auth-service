import encryptionService from '../services/encryption';
import logger from '../shared/Logger';
import tokenService from '../services/token';
import ClientError from './ClientError';
import User, { UserDocument } from '../models/User';
import { StatusCodes } from 'http-status-codes';

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

const validate = (req: LoginRequest): void => {
    // Accumulate errors
    const error = new ClientError('Bad input', StatusCodes.BAD_REQUEST);

    if (!req.username && !req.email) {
        error.data = error.data || {};
        error.data.username =
            'One of username or email must be provided and cannot not be empty';
        error.data.email =
            'One of username or email must be provided and cannot not be empty';
    }
    if (!req.password) {
        error.data = error.data || {};
        error.data.password = 'Password cannot be missing or blank';
    }

    if (error.data) {
        throw error;
    }
};

const login = async (req: LoginRequest): Promise<LoginResponse> => {
    // Check if user exists
    let user: UserDocument | null;
    if (req.username) {
        user = await User.findOne({ username: req.username });
    } else {
        user = await User.findOne({ email: req.email });
    }
    if (!user) {
        logger.warn('User not found');
        throw new ClientError('Incorrect credentials', StatusCodes.UNAUTHORIZED);
    }

    const { username, email, password, token } = user;

    // Validate password
    const validPassword: boolean = await encryptionService.validate(
        req.password,
        password
    );
    if (!validPassword) {
        logger.warn(`[${username}] Password mismatch`);
        throw new ClientError('Incorrect credentials', StatusCodes.UNAUTHORIZED);
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
