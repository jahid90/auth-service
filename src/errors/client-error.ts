import { StatusCodes } from 'http-status-codes';

class ClientError {

    message: string;
    status: number;
    code?: number;
    data?: Array<string>;

    constructor(message: string, status: number = StatusCodes.BAD_REQUEST) {
        this.message = message;
        this.status = status;
    }

    push = (item: string) => {
        this.data = this.data || [];
        this.data.push(item);
    }
}

export class BadAuthorizationHeaderError extends ClientError {

    constructor() {
        super('Bad authorization header', StatusCodes.FORBIDDEN);
        this.push('Authorization header must be of the form <"Authorization: Bearer token">');
    }
}

export class MissingAuthorizationHeaderError extends ClientError {

    constructor() {
        super('Missing authorization header', StatusCodes.FORBIDDEN);
        this.push('An authorization header must be provided');
    }
}

export class BadAuthenticationTokenError extends ClientError {

    constructor() {
        super('Token must be a valid jwt token', StatusCodes.FORBIDDEN);
    }
}

export class UserNotFoundError extends ClientError {

    constructor() {
        super('Could not find user', StatusCodes.FORBIDDEN);

        this.code = 4003;
    }
}

export class UserNotLoggedInError extends ClientError {

    constructor() {
        super('Are you logged in?', StatusCodes.UNAUTHORIZED);

        this.code = 4001;
    }
}

export class UserNotAuthorizedError extends ClientError {

    constructor() {
        super('Not Authorized', StatusCodes.FORBIDDEN);
    }
}

export class BadRequestError extends ClientError {

    constructor() {
        super('Bad Input', StatusCodes.BAD_REQUEST);
    }
}

export class IncorrectCredentialsError extends ClientError {

    constructor() {
        super('Incorrect Credentials', StatusCodes.BAD_REQUEST);
    }
}

export default ClientError;
