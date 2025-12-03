import prisma from "@/lib/prisma";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { createErrorResponse, createSuccessResponse } from "@/lib/errors";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader ?? undefined);

    if (!token) {
      return createErrorResponse(401, "Unauthorized: Missing token");
    }

    const payload = verifyToken(token);
    if (!payload) {
      return createErrorResponse(401, "Unauthorized: Invalid token");
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { usn: payload.usn },
      select: {
        usn: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return createErrorResponse(401, "User not found");
    }

    return createSuccessResponse(
      {
        valid: true,
        user,
      },
      200,
      "Token is valid"
    );
  } catch (error) {
    console.error("Verify error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}
