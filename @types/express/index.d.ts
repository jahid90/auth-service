declare namespace Express {
    export interface Request {
        token?: string;
        requestId?: string;
    }
}
