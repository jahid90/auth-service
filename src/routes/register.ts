import { Request, Response, Router } from 'express';
import _ from 'lodash';

import service, {
    RegistrationError,
    RegistrationResponse,
} from '../services/registration';
import logger from '../shared/Logger';

const router: Router = Router();

router.post('/', (req: Request, res: Response): void => {
    (async () => {
        try {
            const errors: RegistrationError = await service.validate(req.body);
            if (!_.isEmpty(errors)) {
                logger.err(errors);
                res.status(400).json(errors);
                return;
            }

            const response: RegistrationResponse = await service.register({
                ...req.body,
                createdAt: new Date().toISOString(),
            });

            res.status(201).send(response);
        } catch (err) {
            logger.err(err)
            res.status(400).json(err);
        }
    })();
});

export default router;
