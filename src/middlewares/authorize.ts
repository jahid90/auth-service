import { NextFunction, Request, Response } from 'express';

const middleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        res.send('Auth');
    }
}

export default middleware;
