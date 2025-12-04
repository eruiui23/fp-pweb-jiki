import jwt from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET || "your-secret-key-change-this") as string;
const JWT_EXPIRY = (process.env.JWT_EXPIRY || "7d") as string;

export interface TokenPayload {
  usn: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<TokenPayload, "iat" | "exp">): string {
  return jwt.sign(payload as Record<string, unknown>, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
