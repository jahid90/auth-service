import { StatusCodes } from "http-status-codes";

class ClientError {

    message: string;
    status: number;
    code?: number;
    data?: Record<string, unknown>;

    constructor(message: string, status: number = StatusCodes.BAD_REQUEST ) {
        // super(message);
        this.message = message;
        this.status = status;
    }

    push = (key: string, value: any) => {
        this.data = this.data || {};
        this.data[key] = this.data[key] || [];
        (this.data[key] as Array<any>).push(value);
    }

    set = (key:string, value: any) => {
        this.data = this.data || {};
        this.data[key] = value;
    }
}

export default ClientError;
