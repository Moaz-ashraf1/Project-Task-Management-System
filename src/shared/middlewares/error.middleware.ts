import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError";

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {


  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      
    });
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Internal server error",
    error: err.message
  });
};

export default globalErrorHandler;