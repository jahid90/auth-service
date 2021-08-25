import { Request } from 'express';
import ServerError from '../errors/server-error';

import logger from '../shared/logger';

const logout = async (req: Request): Promise<void> => {
    try {

        const user = req.user;
        user.tokenVersion = user.tokenVersion + 1;

        logger.debug('Updating the refresh token version');

        await user.save();

        logger.debug(`User ${user.username} is successfully logged out`);

    } catch (err) {
        throw new ServerError(err.message);
    }
};

export default {
    logout,
};
