import { Router } from 'express';

import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import validateRefreshToken from '../middlewares/validate-refresh-token';
import loginRouter from './login';
import logoutRouter from './logout';
import registrationRouter from './register';
import renewalRouter from './renew';

const router: Router = Router();

router.use('/register', registrationRouter);
router.use('/login', loginRouter);
router.use('/logout', authenticate(), logoutRouter);
// Can't use 'authenticate' middleware on token renewal route as the request
// might be due to an expired token and the middleware will never let it through.
// We check only the refresh token to issue a new access token.
router.use('/renew', validateRefreshToken(), renewalRouter);
router.post('/has-access', authenticate(), authorize());

export default router;
