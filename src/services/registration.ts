import _ from 'lodash';
import bcrypt from 'bcrypt';

import tokenService from '../services/token';
import User, { IUser, UserDocument } from '../models/User';

export interface RegistrationRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegistrationResponse {
    username: string;
    email: string;
    token?: string;
}

export interface RegistrationError {
    username?: string;
    email?: string;
    password?: string;
}

const hash = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

const validateRequest = async (
    req: RegistrationRequest
): Promise<RegistrationError> => {
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

    if (!_.isEmpty(errors)) {
        return errors;
    }

    // Passwords must match
    if (req.password !== req.confirmPassword) {
        errors.password = 'Passwords must match';
    }

    // TODO - email format validation

    const user = await User.findOne({ username: req.username });
    if (user) {
        errors.username = 'Username is already taken';
    }

    return errors;
};

const registerUser = async (user: IUser): Promise<RegistrationResponse> => {
    // Create a user
    const savedUser: UserDocument = await User.create({
        ...user,
        password: await hash(user.password),
    });

    // Generate a token
    const token: string = tokenService.generate({
        username: savedUser.username,
        email: savedUser.email,
    });
    // Save the token
    savedUser.token = token;
    savedUser.save();

    // Return a response shape instead of the db model
    return {
        username: savedUser.username,
        email: savedUser.email,
        token,
    };
};

export default {
    validate: validateRequest,
    register: registerUser,
};
