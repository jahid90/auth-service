import { Router } from 'express';

import authenticate from '../middlewares/authenticate';
import loginRouter from './login';
import logoutRouter from './logout';
import registrationRouter from './register';
import renewalRouter from './renew';

const router: Router = Router();

router.use('/register', registrationRouter);
router.use('/login', loginRouter);
router.use('/logout', authenticate, logoutRouter);
router.use('/renew', renewalRouter);

export default router;
