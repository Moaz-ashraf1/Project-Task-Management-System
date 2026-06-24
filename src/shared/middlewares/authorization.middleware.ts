import { Request, Response, NextFunction } from "express";
import { ForbiddenException } from "../../domain_modules/auth/exceptions/ForbiddenException";
import { UserRole } from "../../domain_modules/user/user.entity";

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.userRole as UserRole)) {
      throw new ForbiddenException();
    }
    next();
  };
};