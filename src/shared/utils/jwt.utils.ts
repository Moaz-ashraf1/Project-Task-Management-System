import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export const signAccessToken = (payload: {
  sub: string;
  role: string;
}): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (payload: { sub: string }): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
     expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};