import { Request } from 'express';
import { UserDocument } from 'src/models/User';
import ServerError from '../errors/server-error';

import logger from '../shared/logger';

const logout = async (req: Request): Promise<void> => {
    try {
        const user: UserDocument = req.user;
        user.tokenVersion = user.tokenVersion + 1;

        logger.debug('Updating the refresh token version');

        await user.save();

        logger.debug(`User ${user.username} is successfully logged out`);
    } catch (err: any) {
        logger.error(err.message);
        throw new ServerError();
    }
};

export default {
    logout,
};
