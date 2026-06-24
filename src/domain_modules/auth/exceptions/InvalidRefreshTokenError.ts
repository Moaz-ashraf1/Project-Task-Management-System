
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../../shared/utils/ApiError";

export class InvalidRefreshTokenError extends ApiError {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, "Invalid or expired refresh token");
  }
}