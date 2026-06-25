import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { verifyAccessToken } from "../utils/jwt.utils";
import * as authRepo from "../../domain_modules/auth/auth.repository";
import { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedException } from "../../domain_modules/auth/exceptions/UnauthenticatedException";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) throw new UnauthenticatedException();

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token) as JwtPayload;

    const user = await authRepo.authRepository.findUserById(decoded.sub!);
    if (!user) throw new UnauthenticatedException();

    req.userId = user.id;
    req.userRole = user.role;

    console.log( req.userId );

    next();
  }
);