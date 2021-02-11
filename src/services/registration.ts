import _ from 'lodash';

import encryptionService from '../services/encryption';
import ClientError from './ClientError';
import User, { IUser } from '../models/User';

export interface RegistrationRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    roles?: Array<string>;
}

const emailRegexp = new RegExp(/\S+@\S+\.\S+/);

const validateRequest = async (req: RegistrationRequest): Promise<void> => {
    const error = new ClientError('Bad input');

    // Username validations
    if (!_.isString(req.username)) {
        error.push('username', 'Username must be a string');
    } else if (_.isEmpty(req.username)) {
        error.push('username', 'Username cannot be missing or empty');
    } else if (await User.findOneByUsername(req.username)) {
        error.push('username', 'Username is already taken');
    }

    // Email validations
    if (!_.isString(req.email)) {
        error.push('email', 'Email must be a string');
    } else if (_.isEmpty(req.email)) {
        error.push('email', 'Email cannot be missing or empty');
    } else if (!emailRegexp.exec(req.email)) {
        error.push('email', 'Email must be a valid email address');
    }

    // Password validations
    if (!_.isString(req.password)) {
        error.push('password', 'Password must be a string');
    } else if (_.isEmpty(req.password)) {
        error.push('password', 'Password cannot be missing or empty');
    }

    if (!_.isString(req.confirmPassword)) {
        error.push('confirmPassword', 'Confirm password must be a string');
    } else if (_.isEmpty(req.confirmPassword)) {
        error.push('confirmPassword', 'Confirm password cannot be missing or empty');
    }

    if (req.password !== req.confirmPassword) {
        error.push('password', 'Passwords must match');
        error.push('confirmPassword', 'Passwords must match');
    }

    // If any validations failed, throw an error
    if (error.data) {
        throw error;
    }
};

const registerUser = async (user: IUser): Promise<void> => {
    // Encrypt the password
    const password = await encryptionService.hash(user.password);

    // Create the user in db
    await User.create({
        ...user,
        password,
    });
};

export default {
    validate: validateRequest,
    register: registerUser,
};
