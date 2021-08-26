import { NextFunction, Request, Response } from 'express';

import { UserNotAuthorizedError } from '../errors/client-error';
import { UserDocument } from '../models/User';

const middleware = (requiredRoles: string[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (req: Request, res: Response, next: NextFunction) => {

        const user: UserDocument = req.user;
        const roles = user.roles;

        requiredRoles.forEach(r => {
            if (roles.indexOf(r) === -1) {
                const error = new UserNotAuthorizedError();
                error.push(`user is missing a required role: [${r}]`);

                next(error);
            }
        });

        next();
    }
}

export default middleware;
