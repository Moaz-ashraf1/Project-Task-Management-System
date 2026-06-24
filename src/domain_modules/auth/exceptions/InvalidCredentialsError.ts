
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../../shared/utils/ApiError";

export class InvalidCredentialsError extends ApiError {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }
}