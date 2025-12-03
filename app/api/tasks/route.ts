import prisma from "@/lib/prisma";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { CreateTaskSchema } from "@/lib/validation";
import { createErrorResponse, createSuccessResponse, handleZodError } from "@/lib/errors";

// GET all tasks for authenticated user
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

    const tasks = await prisma.task.findMany({
      where: { userId: payload.usn },
      select: {
        task_id: true,
        task_name: true,
        due_date: true,
        status: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return createSuccessResponse(tasks, 200, "Tasks retrieved successfully");
  } catch (error) {
    console.error("Get tasks error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}

// POST create task
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
    const validation = CreateTaskSchema.safeParse(body);
    if (!validation.success) {
      const errors = handleZodError(validation.error);
      return createErrorResponse(400, "Validation failed", errors);
    }

    const { task_name, due_date, status, completed } = validation.data;

    // Create task
    const task = await prisma.task.create({
      data: {
        task_name,
        due_date,
        status: status || "pending",
        completed: completed || false,
        userId: payload.usn,
      },
      select: {
        task_id: true,
        task_name: true,
        due_date: true,
        status: true,
        completed: true,
        createdAt: true,
      },
    });

    return createSuccessResponse(task, 201, "Task created successfully");
  } catch (error) {
    console.error("Create task error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}
