// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires
const User = require('../../src/models/User');

declare namespace Express {
    export interface Request {
        user?: User;
        requestId?: string;
    }
}
