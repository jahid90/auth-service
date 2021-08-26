import { Router } from 'express';

import loginRouter from './login';
import logoutRouter from './logout';
import registrationRouter from './register';
import renewalRouter from './renew';
import usersRouter from './users';

const router: Router = Router();

router.use('/register', registrationRouter);
router.use('/login', loginRouter);
router.use('/logout', logoutRouter);
router.use('/renew', renewalRouter);
router.use('/users', usersRouter);

export default router;
