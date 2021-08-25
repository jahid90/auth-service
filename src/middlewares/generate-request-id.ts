import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

const setup = () => {

    return (req: Request, _: Response, next: NextFunction) => {

        const requestId = uuid();
        req.requestId = requestId;

        next()
    }
};

export default setup;
