import { Request, Response, NextFunction } from 'express';

const setup = (req: Request, res: Response, next: NextFunction) => {
    
    const requestId = res.getHeader('X-Request-Id') as string;
    req.requestId = requestId;

    next()
};

export default setup;
