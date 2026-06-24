import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../../shared/utils/ApiError";

export class ProjectNotFoundError extends ApiError {
  constructor() {
    super(StatusCodes.NOT_FOUND, "Project not found");
  }
}