import { NextFunction, Request, Response } from 'express';

const middleware = () => {

    return (req: Request, res: Response, next: NextFunction) => {

        res.setHeader('X-Request-Id', req.requestId as string);

        next();
    }
}

export default middleware;
