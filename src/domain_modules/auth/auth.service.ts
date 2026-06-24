import { hashPassword, comparePassword, hashToken } from "../../shared/utils/hash.utils";
import { signAccessToken, signRefreshToken } from "../../shared/utils/jwt.utils";
import * as authRepo from "./auth.repository";
import { EmailAlreadyExistsError } from "./exceptions/EmailAlreadyExistsError";
import { InvalidCredentialsError } from "./exceptions/InvalidCredentialsError";
import { InvalidRefreshTokenError } from "./exceptions/InvalidRefreshTokenError";

// ── Helper ──
const generateTokens = async (
  userId: string,
  role: string,
  deviceInfo?: string | null,
  ipAddress?: string | null
) => {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken({ sub: userId });

  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await authRepo.authRepository.createRefreshToken({
    tokenHash,
    userId,
    expiresAt,
    deviceInfo,
    ipAddress,
  });

  return { accessToken, refreshToken };
};

// ── Register ──
export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await authRepo.authRepository.findUserByEmail(data.email);
  if (existingUser) throw new EmailAlreadyExistsError();

  const hashedPassword = await hashPassword(data.password);
  const user = await authRepo.authRepository.createUser({
    ...data,
    password: hashedPassword,
  });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

// ── Login ──
export const login = async (
  email: string,
  password: string,
  deviceInfo?: string|null,
  ipAddress?: string|null
) => {
  const user = await authRepo.authRepository.findUserByEmailWithPassword(email);
  if (!user) throw new InvalidCredentialsError();

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new InvalidCredentialsError();

  return generateTokens(user.id, user.role, deviceInfo, ipAddress);
};

// ── Refresh ──
export const refreshAccessToken = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);
  const storedToken = await authRepo.authRepository.findRefreshToken(tokenHash);

  if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
    throw new InvalidRefreshTokenError();
  }

  await authRepo.authRepository.revokeRefreshToken(tokenHash);

  const user = await authRepo.authRepository.findUserById(storedToken.userId);
  if (!user) throw new InvalidRefreshTokenError();

  return generateTokens(
    user.id,
    user.role,
    storedToken.deviceInfo,
    storedToken.ipAddress
  );
};

