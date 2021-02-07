import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import AuthRouter from './auth';

// Init router and path
const router = Router();

// Add sub-routes
router.get('/ping', (req, res) => {
    res.status(StatusCodes.OK).send('Ok');
})
router.use('/', AuthRouter);

// Export the base-router
export default router;
