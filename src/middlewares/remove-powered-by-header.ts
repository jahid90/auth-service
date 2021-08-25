import { NextFunction, Request, Response } from 'express';

const middleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {

        const header = 'X-Powered-By';
        res.getHeader(header) && res.removeHeader(header);

        next();
    }
};

export default middleware;
