import { Request, Response, NextFunction } from 'express';

import logger from '../shared/logger';

const middleware = () => {

    return (req: Request, res: Response, next: NextFunction) => {

        logger.defaultMeta = {
            requestId: req.requestId
        };

        next()
    }
};

export default middleware;
