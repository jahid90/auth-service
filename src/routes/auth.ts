import { Request, Response, Router } from 'express';

import loginRouter from './login';
import registrationRouter from './register';

const router: Router = Router();

router.use('/register', registrationRouter);
router.use('/login', loginRouter);

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
