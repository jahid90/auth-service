import { StatusCodes } from "http-status-codes";

class ServerError {

    message: string;
    status: number;
    data?: Record<string, unknown> | undefined;

    constructor(message: string, status : number = StatusCodes.INTERNAL_SERVER_ERROR) {
        this.message = message;
        this.status = status;
    }
}

export default ServerError;
