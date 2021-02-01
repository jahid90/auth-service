import { Request, Response, Router } from 'express';
import _ from 'lodash';

import registrationService, {
    RegistrationError,
    RegistrationResponse,
} from '../services/registration';

const router: Router = Router();

router.post('/', (req: Request, res: Response): void => {
    (async () => {
        try {
            const errors: RegistrationError = await registrationService.validate(
                req.body
            );
            if (!_.isEmpty(errors)) {
                res.status(400).json(errors);
                return;
            }

            const response: RegistrationResponse = await registrationService.register(
                {
                    ...req.body,
                    createdAt: new Date().toISOString(),
                }
            );

            res.send(response);
        } catch (err) {
            res.status(400).json(err);
        }
    })();
});

export default router;
