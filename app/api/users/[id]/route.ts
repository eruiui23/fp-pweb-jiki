import prisma from "@/lib/prisma";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { UpdateUserSchema } from "@/lib/validation";
import { createErrorResponse, createSuccessResponse, handleZodError } from "@/lib/errors";
import { hashPassword } from "@/lib/password";

// GET user by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { usn: id },
      select: {
        usn: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return createErrorResponse(404, "User not found");
    }

    return createSuccessResponse(user, 200, "User retrieved successfully");
  } catch (error) {
    console.error("Get user error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}

// PUT update user
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();

    // Validate input
    const validation = UpdateUserSchema.safeParse(body);
    if (!validation.success) {
      const errors = handleZodError(validation.error);
      return createErrorResponse(400, "Validation failed", errors);
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { usn: id },
    });

    if (!user) {
      return createErrorResponse(404, "User not found");
    }

    const updateData: Record<string, string> = {};

    if (validation.data.usn) {
      const existingUser = await prisma.user.findUnique({
        where: { usn: validation.data.usn },
      });
      if (existingUser && existingUser.usn !== id) {
        return createErrorResponse(409, "Username already exists");
      }
      updateData.usn = validation.data.usn;
    }

    if (validation.data.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validation.data.email },
      });
      if (emailExists && emailExists.usn !== id) {
        return createErrorResponse(409, "Email already registered");
      }
      updateData.email = validation.data.email;
    }

    if (validation.data.pass) {
      updateData.pass = await hashPassword(validation.data.pass);
    }

    const updatedUser = await prisma.user.update({
      where: { usn: id },
      data: updateData,
      select: {
        usn: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return createSuccessResponse(updatedUser, 200, "User updated successfully");
  } catch (error) {
    console.error("Update user error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}

// DELETE user
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { usn: id },
    });

    if (!user) {
      return createErrorResponse(404, "User not found");
    }

    // Delete related tasks and trackers first
    await prisma.tracker.deleteMany({
      where: { userId: id },
    });

    await prisma.task.deleteMany({
      where: { userId: id },
    });

    // Delete user
    const deletedUser = await prisma.user.delete({
      where: { usn: id },
      select: {
        usn: true,
        email: true,
      },
    });

    return createSuccessResponse(deletedUser, 200, "User deleted successfully");
  } catch (error) {
    console.error("Delete user error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}
