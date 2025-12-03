import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromHeader } from "./jwt";
import { createErrorResponse } from "./errors";

export async function withAuth(
  handler: (req: NextRequest, context: { params?: Record<string, string> }) => Promise<Response>
) {
  return async (req: NextRequest, context: { params?: Record<string, string> } = {}) => {
    const token = extractTokenFromHeader(req.headers.get("authorization"));

    if (!token) {
      return createErrorResponse(401, "Unauthorized: Missing token");
    }

    const payload = verifyToken(token);
    if (!payload) {
      return createErrorResponse(401, "Unauthorized: Invalid token");
    }

    // Attach user info to request
    (req as any).user = payload;

    return handler(req, context);
  };
}

export function getUser(req: NextRequest) {
  return (req as any).user;
}
