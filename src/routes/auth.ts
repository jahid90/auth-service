import { Request, Response, Router } from 'express';

import authenticate from '../middlewares/authenticate';
import loginRouter from './login';
import logoutRouter from './logout';
import registrationRouter from './register';

const router: Router = Router();

router.use('/register', registrationRouter);
router.use('/login', loginRouter);
router.use('/logout', authenticate, logoutRouter);

router.post('/token/validate', (req: Request, res: Response): void => {
    res.send('This is the authorisation route');
});

router.post('/token/renew', (req: Request, res: Response): void => {
    res.send('This is the token renewal route');
});

export default router;
