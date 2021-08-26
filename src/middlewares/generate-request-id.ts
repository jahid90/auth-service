import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

const middleware = () => {

    return (req: Request, _res: Response, next: NextFunction) => {

        const requestId = uuid();
        req.requestId = requestId;

        next()
    }
};

export default middleware;
