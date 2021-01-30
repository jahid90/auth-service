import { Request, Response, Router } from 'express';
import _ from 'lodash';

import registrationService, {
    RegistrationError,
    RegistrationResponse,
} from '../services/registration';

const router: Router = Router();

router.post('/register', (req: Request, res: Response): void => {
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

router.post('/login', (req: Request, res: Response): void => {
    res.send('This is the login route');
});

router.post('/logout', (req: Request, res: Response): void => {
    res.send('This is the logout route');
});

router.post('/authorise', (req: Request, res: Response): void => {
    res.send('This is the authorisation route');
});

router.post('/authenticate', (req: Request, res: Response): void => {
    res.send('This is the authentication route');
});

router.post('/renewToken', (req: Request, res: Response): void => {
    res.send('This is the token renewal route');
});

export default router;
