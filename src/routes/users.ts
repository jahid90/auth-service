import { StatusCodes } from 'http-status-codes';
import express, { NextFunction, Request, Response } from 'express';

import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import logger from '../shared/logger';
import userService from '../services/users';
import ServerError from '../errors/server-error';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/me', authenticate(), (req: Request, res: Response, _next: NextFunction) => {
    const user = req.user;

    res.json(user);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/me/roles', authenticate(), (req: Request, res: Response, _next: NextFunction) => {
    const user = req.user;

    res.json({ roles: user.roles });
});

router.post('/me/roles/add', authenticate(), (req: Request, res: Response, next: NextFunction) => {

    (async () => {

        try {
            const user = req.user;
            const role = req.body.role;

            await userService.addRole(user, role);

            res.status(StatusCodes.CREATED).send();
        } catch (err) {
            next(err);
        }

    })();
});

router.post('/me/roles/remove', authenticate(), (req: Request, res: Response, next: NextFunction) => {

    (async () => {

        try {
            const user = req.user;
            const role = req.body.role;

            await userService.removeRole(user, role);

            res.status(StatusCodes.CREATED).send();
        } catch (err) {
            next(err);
        }

    })();
});

router.get('/all', authenticate(), authorize(['users:list']), (_req: Request, res: Response, next: NextFunction) => {
    (async () => {
        try {
            const users = await userService.getAllUsers();

            res.json(users);
        } catch (err) {
            logger.error(err);
            next(new ServerError());
        }
    })();
});

export default router;
