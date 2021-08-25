import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '../shared/logger';
import { validateAccessToken } from '../services/token';
import ClientError from '../errors/client-error';
import User, { UserDocument } from '../models/User';
import { Token } from '../models/Token';

const logout = async (req: Request): Promise<void> => {
    try {
        // Check if token is valid
        const decoded = validateAccessToken(req.token as string);
        const username = (decoded as Token).username;

        // Lookup the user and increment token version, invalidating all existing refresh tokens
        const user: UserDocument | null = await User.findOne({ username });
        if (user) {
            user.tokenVersion = user.tokenVersion + 1;
            await user.save();
        }
    } catch (err) {
        logger.warn(err);

        throw new ClientError('Token must be a valid jwt token', StatusCodes.FORBIDDEN);
    }
};

export default {
    logout,
};
