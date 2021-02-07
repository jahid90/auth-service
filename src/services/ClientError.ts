import { StatusCodes } from "http-status-codes";

class ClientError {

    message: string;
    status: number;
    data?: Record<string, unknown>;

    constructor(message: string, status: number = StatusCodes.BAD_REQUEST ) {
        // super(message);
        this.message = message;
        this.status = status;
    }
}

export default ClientError;
