import { Request, Response, Router } from 'express';
import _ from 'lodash';

import service, { LoginError, LoginResponse } from '../services/login';
import logger from '@shared/Logger';

const router: Router = Router();

router.post('/', (req: Request, res: Response): void => {
    (async () => {
        try {
            const errors: LoginError = service.validate(req.body);
            if (!_.isEmpty(errors)) {
                logger.err(errors);
                res.status(400).json(errors);
                return;
            }

            const response: LoginResponse = await service.login(req.body);

            res.status(200).send(response);
        } catch (err) {
            logger.err(err);
            res.status(400).json(err);
        }
    })();
});

export default router;
