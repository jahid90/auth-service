import { Router } from 'express';

import AuthRouter from './auth';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/', AuthRouter);

// Export the base-router
export default router;
