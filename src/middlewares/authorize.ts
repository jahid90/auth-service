import { NextFunction, Request, Response } from 'express';

const middleware = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_req: Request, res: Response, _next: NextFunction) => {
        res.send('Auth');
    }
}

export default middleware;
