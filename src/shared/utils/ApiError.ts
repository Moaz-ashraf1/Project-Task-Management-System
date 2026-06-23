import { StatusCodes } from "http-status-codes";

export class ApiError extends Error{
    constructor(public statusCode: StatusCodes, message: string){
        super(message);
        this.name = "ApiError"
    }
}