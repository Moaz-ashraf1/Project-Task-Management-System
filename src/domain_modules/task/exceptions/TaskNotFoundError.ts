import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../../shared/utils/ApiError";

export class TaskNotFoundError extends ApiError {
  constructor() {
    super(StatusCodes.NOT_FOUND, "task not found");
  }
}