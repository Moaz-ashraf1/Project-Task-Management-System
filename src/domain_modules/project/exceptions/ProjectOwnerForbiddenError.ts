import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../../shared/utils/ApiError";

export class ProjectOwnerForbiddenError extends ApiError {
  constructor() {
    super(
      StatusCodes.FORBIDDEN,
      "You are not the owner of this project"
    );
  }
}