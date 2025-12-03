import prisma from "@/lib/prisma";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { CreateUserSchema } from "@/lib/validation";
import { createErrorResponse, createSuccessResponse, handleZodError } from "@/lib/errors";
import { hashPassword } from "@/lib/password";

// GET all users
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

    const users = await prisma.user.findMany({
      select: {
        usn: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return createSuccessResponse(users, 200, "Users retrieved successfully");
  } catch (error) {
    console.error("Get users error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}

// POST create user
export async function POST(req: Request) {
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

    const body = await req.json();

    // Validate input
    const validation = CreateUserSchema.safeParse(body);
    if (!validation.success) {
      const errors = handleZodError(validation.error);
      return createErrorResponse(400, "Validation failed", errors);
    }

    const { usn, email, pass } = validation.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { usn },
    });

    if (existingUser) {
      return createErrorResponse(409, "Username already exists");
    }

    // Check if email exists
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      return createErrorResponse(409, "Email already registered");
    }

    // Hash password
    const hashedPassword = await hashPassword(pass);

    // Create user
    const user = await prisma.user.create({
      data: {
        usn,
        email,
        pass: hashedPassword,
      },
      select: {
        usn: true,
        email: true,
        createdAt: true,
      },
    });

    return createSuccessResponse(user, 201, "User created successfully");
  } catch (error) {
    console.error("Create user error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}
