import { Request, Response, NextFunction } from 'express';

import logger from '../shared/logger';

const setup = (req: Request, res: Response, next: NextFunction) => {

    logger.defaultMeta = {
        requestId: req.requestId
    };

    next()
};

export default setup;
