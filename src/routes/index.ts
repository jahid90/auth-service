import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../shared/logger';

import AuthRouter from './auth';

// Init router and path
const router = Router();

// Add sub-routes
router.get('/ping', (req, res) => {

    logger.debug(`Environment: ${JSON.stringify(process.env.NODE_ENV)}`);

    process.env.NODE_ENV === 'development' && res.setHeader('X-Server-Environment', 'Development');
    res.status(StatusCodes.OK).send('Ok');

})
router.use('/', AuthRouter);

// Export the base-router
export default router;
