
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../../shared/utils/ApiError";

export class EmailAlreadyExistsError extends ApiError {
  constructor() {
    super(StatusCodes.CONFLICT, "Email already exists");
  }
}