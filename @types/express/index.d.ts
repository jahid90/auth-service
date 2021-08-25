const User = require('../../src/models/User');

declare namespace Express {
    export interface Request {
        user?: User;
        requestId?: string;
    }
}
