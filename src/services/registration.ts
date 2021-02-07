import _ from 'lodash';

import tokenService from '../services/token';
import encryptionService from '../services/encryption';
import User, { IUser, UserDocument } from '../models/User';
import logger from '../shared/Logger';

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

export interface RegistrationError {
    username?: string;
    email?: string;
    password?: string;
}

const validateRequest = async (req: RegistrationRequest): Promise<RegistrationError> => {

    const errors: RegistrationError = {};

    // Inputs cannot be empty
    if (req.username.trim() === '') {
        errors.username = 'Input params cannot be empty';
    }
    if (req.email.trim() === '') {
        errors.email = 'Input params cannot be empty';
    }
    if (req.password === '' || req.confirmPassword === '') {
        errors.password = 'Input params cannot be empty';
    }

    // Early exit for empty input
    if (!_.isEmpty(errors)) {
        return errors;
    }

    // Passwords must match
    if (req.password !== req.confirmPassword) {
        errors.password = 'Passwords must match';
    }

    // TODO - email format validation

    const user : UserDocument | null = await User.findOne({ username: req.username });
    if (user) {
        errors.username = 'Username is already taken';
    }

    return errors;
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
