import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '../shared/logger';
import tokenService from '../services/token';
import ClientError from './ClientError';
import User, { UserDocument } from '../models/User';
import { Token } from '../models/Token';

const logout = async (req: Request): Promise<void> => {
    try {
        // Check if token is valid
        const decoded = tokenService.validate(req.token as string);
        const username = (decoded as Token).username;

        // Lookup the user and invalidate the token
        const user: UserDocument | null = await User.findOne({ username });
        if (user) {
            user.token = '';
            await user.save();
        }
    } catch (err) {
        logger.warn(err);

        throw new ClientError(
            'Token must be a valid jwt token',
            StatusCodes.FORBIDDEN
        );
    }
};

export default {
    logout,
};
