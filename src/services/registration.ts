import tokenService from '../services/token';
import encryptionService from '../services/encryption';
import User, { IUser, UserDocument } from '../models/User';
import ClientError from './ClientError';

export interface RegistrationRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegistrationResponse {
    username: string;
    email: string;
    token: string;
}

const validateRequest = async (req: RegistrationRequest): Promise<void> => {

    const error = new ClientError('Bad input');

    // Inputs cannot be empty
    if (!req.username) {
        error.data = error.data || {};
        error.data.username = 'Username cannot be missing or empty';
    }
    if (!req.email) {
        error.data = error.data || {};
        error.data.email = 'Email cannot be missing or empty';
    }
    if (!req.password || !req.confirmPassword || req.password !== req.confirmPassword) {
        error.data = error.data || {};
        error.data.password = 'Passwords cannot be missing or empty and must match';
    }

    // Early exit for empty input
    if (error.data) {
        throw error;
    }

    // TODO - email format validation

    // Username must not be already taken; should we allow same email though?
    const user : UserDocument | null = await User.findOne({ username: req.username });
    if (user) {
        error.data = error.data || {};
        error.data.username = 'Username is already taken';

        throw error;
    }
};

const registerUser = async (user: IUser): Promise<RegistrationResponse> => {

    // Generate a token
    const token: string = tokenService.generate({
        username: user.username,
        email: user.email,
    });

    // Create a user
    const dbUser: UserDocument = await User.create({
        ...user,
        password: await encryptionService.hash(user.password),
        token,
    });

    // Return a response shape instead of the db model
    return {
        username: dbUser.username,
        email: dbUser.email,
        token,
    };
};

export default {
    validate: validateRequest,
    register: registerUser,
};
