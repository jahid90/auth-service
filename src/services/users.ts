import { isNotEmpty, isNotMissing, isString } from '../validators/commons';
import { BadRequestError } from '../errors/client-error';
import logger from '../shared/logger';
import validate from './validations';
import User, { UserDocument } from '../models/User';

const addRole = async (user: UserDocument, role: string): Promise<void> => {

    const failures = await validate({ prop: role, name: 'role' }, [ isNotMissing, isString, isNotEmpty ]);
    if (failures && !failures.isEmpty()) {
        const clientError = new BadRequestError();
        failures.failures.forEach(f => clientError.push(f));

        throw clientError;
    }

    logger.debug(`Received request to add role: ${role} to user: ${user.username}`);

    if (user.roles.indexOf(role) !== -1) {
        logger.debug('user already has the role');
        return;
    }

    user.roles.push(role);
    await user.save();
};

const removeRole = async (user: UserDocument, role: string): Promise<void> => {

    const failures = await validate({ prop: role, name: 'role' }, [ isNotMissing, isString, isNotEmpty ]);
    if (failures && !failures.isEmpty()) {
        const clientError = new BadRequestError();
        failures.failures.forEach(f => clientError.push(f));

        throw clientError;
    }

    logger.debug(`Received request to remove role: ${role} from user: ${user.username}`);

    if (user.roles.indexOf(role) === -1) {
        logger.debug('user does not have the role');
        return;
    }

    const idx = user.roles.indexOf(role);
    user.roles.splice(idx, 1);
    await user.save();
};

const getAllUsers = async (): Promise<Array<UserDocument>> => {
    return await User.find({});
}

export default {
    addRole,
    removeRole,
    getAllUsers
}
