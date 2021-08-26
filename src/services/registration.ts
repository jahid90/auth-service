import { StatusCodes } from 'http-status-codes';

import { isEmail, isNotEmpty, isNotMissing, isString } from '../validators/commons';
import { isNotAlreadyTaken } from '../validators/user';
import { ValidationFailures } from '../validators/validation-failures';
import encryptionService from '../services/encryption';
import logger from '../shared/logger';
import validate from './validations';
import ClientError from '../errors/client-error';
import User, { IUser } from '../models/User';

export interface RegistrationRequest {
    username: string;
    email: string;
    password: string;
    roles?: Array<string>;
}

const validateRequest = async (req: RegistrationRequest): Promise<void> => {

    // Run the validations
    const failures1 = await validate({ prop: req.username, name: 'username' },
        [isNotMissing, isString, isNotEmpty, isNotAlreadyTaken]);
    const failures2 = await validate({ prop: req.email, name: 'email' }, [isNotMissing, isString, isNotEmpty, isEmail]);
    const failures3 = await validate({ prop: req.password, name: 'password' }, [isNotMissing, isString, isNotEmpty]);

    // Collect the failures
    const failures = new ValidationFailures();
    failures1 && failures.merge(failures1);
    failures2 && failures.merge(failures2);
    failures3 && failures.merge(failures3);

    // generate and throw an error is validations failed
    if (!failures.isEmpty()) {

        const error = new ClientError('Bad Input', StatusCodes.BAD_REQUEST);
        failures.failures.forEach(f => error.push(f));

        logger.warn(`Some validations failed: ${JSON.stringify(failures)}`);

        throw error;

    } else {
        logger.debug('There were no validation failures');
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
