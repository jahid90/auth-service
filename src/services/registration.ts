import tokenService from '../services/token';
import encryptionService from '../services/encryption';
import ClientError from './ClientError';
import User, { IUser, UserDocument } from '../models/User';

export interface RegistrationRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    roles?: Array<string>;
}

export interface RegistrationResponse {
    accessToken: string;
    refreshToken: string;
}

const emailRegexp = new RegExp(/\S+@\S+\.\S+/);

const validateRequest = async (req: RegistrationRequest): Promise<void> => {
    const error = new ClientError('Bad input');

    // Inputs cannot be empty
    if (!req.username || typeof(req.username) !== 'string') {
        error.data = error.data || {};
        error.data.username = 'Username must be a string and cannot be missing or empty';
    }
    if (!req.email || typeof(req.email) !== 'string') {
        error.data = error.data || {};
        error.data.email = 'Email must be a string and cannot be missing or empty';
    }
    if (
        !req.password ||
        !req.confirmPassword ||
        typeof(req.password) !== 'string' ||
        req.password !== req.confirmPassword
    ) {
        error.data = error.data || {};
        error.data.password =
            'Passwords must be string and cannot be missing or empty and must match';
    }

    // Early exit for empty input
    if (error.data) {
        throw error;
    }

    // Email must match valid email pattern
    if (!emailRegexp.exec(req.email)) {
        error.data = error.data || {};
        error.data.email = 'Email must be a valid email address';

        throw error;
    }

    // Username must not be already taken; should we allow same email though?
    const user: UserDocument | null = await User.findOne({
        username: req.username,
    });
    if (user) {
        error.data = error.data || {};
        error.data.username = 'Username is already taken';

        throw error;
    }
};

const registerUser = async (user: IUser): Promise<RegistrationResponse> => {
    // Encrypt the password
    const password = await encryptionService.hash(user.password);
    // Generate a token
    const refreshToken = tokenService.generate({
        username: user.username,
        email: user.email,
    }, password);
    const accessToken = tokenService.generate({
        username: user.username,
        email: user.email,
        roles: user.roles,
    });

    // Create a user
    await User.create({
        ...user,
        password,
        token: refreshToken,
    });

    // Return a response shape instead of the db model
    return {
        accessToken,
        refreshToken,
    };
};

export default {
    validate: validateRequest,
    register: registerUser,
};
