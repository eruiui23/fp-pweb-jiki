import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";
import { RegisterSchema } from "@/lib/validation";
import { createErrorResponse, createSuccessResponse, handleZodError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validation = RegisterSchema.safeParse(body);
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

    // Generate token
    const token = signToken({ usn: user.usn, email: user.email });

    return createSuccessResponse(
      {
        user,
        token,
      },
      201,
      "User registered successfully"
    );
  } catch (error) {
    console.error("Register error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}
