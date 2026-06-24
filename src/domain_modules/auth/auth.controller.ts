import {Request, Response, NextFunction} from 'express';
import { CookieOptions } from "express";
import{StatusCodes} from 'http-status-codes';
import * as authService from './auth.service';
import {InvalidRefreshTokenError} from './exceptions/InvalidRefreshTokenError';
import asyncHandler  from 'express-async-handler';

const COOKIE_OPTIONS:CookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, 
};

export const register =asyncHandler( async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
    const user = await authService.register(req.body);
    res.status(StatusCodes.CREATED).json({ status: "success", data: { user } });
  
});

export const login = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 
    const { email, password } = req.body;
    const deviceInfo = req.headers["user-agent"] ?? null;
    const ipAddress = req.ip ?? null;

    const { accessToken, refreshToken } = await authService.login(
      email,
      password,
      deviceInfo,
      ipAddress
    );

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.status(StatusCodes.OK).json({ status: "success", data: { accessToken } });
  
});

export const refresh = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new InvalidRefreshTokenError();

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshAccessToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
    res.status(StatusCodes.OK).json({ status: "success", data: { accessToken } });
  
});