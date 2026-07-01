import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h";
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

export const createAccessToken = (
  payload: Omit<TokenPayload, "iat" | "exp">,
) => {
  return jwt.sign(
    payload as string | object | Buffer,
    JWT_SECRET as jwt.Secret,
    { expiresIn: JWT_EXPIRY } as jwt.SignOptions,
  );
};

export const createRefreshToken = (
  payload: Omit<TokenPayload, "iat" | "exp">,
) => {
  return jwt.sign(
    payload as string | object | Buffer,
    JWT_REFRESH_SECRET as jwt.Secret,
    { expiresIn: JWT_REFRESH_EXPIRY } as jwt.SignOptions,
  );
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
};


export const createTokenPair = (payload: Omit<TokenPayload, "iat" | "exp">) => {
  return {
    accessToken: createAccessToken(payload),
    refreshToken: createRefreshToken(payload),
  };
};
