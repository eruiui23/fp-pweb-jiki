import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";
import { LoginSchema } from "@/lib/validation";
import { createErrorResponse, createSuccessResponse, handleZodError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      const errors = handleZodError(validation.error);
      return createErrorResponse(400, "Validation failed", errors);
    }

    const { usn, pass } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { usn },
      select: {
        usn: true,
        email: true,
        pass: true,
      },
    });

    if (!user) {
      return createErrorResponse(401, "Invalid username or password");
    }

    // Compare password
    const isPasswordValid = await comparePassword(pass, user.pass);

    if (!isPasswordValid) {
      return createErrorResponse(401, "Invalid username or password");
    }

    // Generate token
    const token = signToken({ usn: user.usn, email: user.email });

    return createSuccessResponse(
      {
        user: {
          usn: user.usn,
          email: user.email,
        },
        token,
      },
      200,
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}
