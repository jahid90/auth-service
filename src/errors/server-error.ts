import { StatusCodes } from "http-status-codes";

class ServerError {

    message: string;
    status: number;
    data?: Record<string, unknown> | undefined;

    constructor(message = 'Internal Server Error', status = StatusCodes.INTERNAL_SERVER_ERROR) {
        this.message = message;
        this.status = status;
    }
}

export default ServerError;
