import prisma from "@/lib/prisma";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { UpdateTaskSchema } from "@/lib/validation";
import { createErrorResponse, createSuccessResponse, handleZodError } from "@/lib/errors";

// GET task by ID
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

    const task = await prisma.task.findUnique({
      where: { task_id: id },
      select: {
        task_id: true,
        task_name: true,
        due_date: true,
        status: true,
        completed: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!task) {
      return createErrorResponse(404, "Task not found");
    }

    // Check authorization
    if (task.userId !== payload.usn) {
      return createErrorResponse(403, "Forbidden: Not your task");
    }

    return createSuccessResponse(task, 200, "Task retrieved successfully");
  } catch (error) {
    console.error("Get task error:", error);
    return createErrorResponse(500, "Internal server error");
  } finally {
    await prisma.$disconnect();
  }
}

// PUT update task
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
    const validation = UpdateTaskSchema.safeParse(body);
    if (!validation.success) {
      const errors = handleZodError(validation.error);
      return createErrorResponse(400, "Validation failed", errors);
    }

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { task_id: id },
    });

    if (!task) {
      return createErrorResponse(404, "Task not found");
    }

    // Check authorization
    if (task.userId !== payload.usn) {
      return createErrorResponse(403, "Forbidden: Not your task");
    }

    const updateData: Record<string, unknown> = {};

    if (validation.data.task_name) updateData.task_name = validation.data.task_name;
    if (validation.data.due_date) updateData.due_date = validation.data.due_date;
    if (validation.data.status) updateData.status = validation.data.status;
    if (validation.data.completed !== undefined)
      updateData.completed = validation.data.completed;

    const updatedTask = await prisma.task.update({
      where: { task_id: id },
      data: updateData,
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

    return createSuccessResponse(updatedTask, 200, "Task updated successfully");
  } catch (error) {
    console.error("Update task error:", error);
    return createErrorResponse(500, "Internal server error");
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE task
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

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { task_id: id },
    });

    if (!task) {
      return createErrorResponse(404, "Task not found");
    }

    // Check authorization
    if (task.userId !== payload.usn) {
      return createErrorResponse(403, "Forbidden: Not your task");
    }

    // Delete related trackers first
    await prisma.tracker.deleteMany({
      where: { taskId: id },
    });

    // Delete task
    const deletedTask = await prisma.task.delete({
      where: { task_id: id },
      select: {
        task_id: true,
        task_name: true,
      },
    });

    return createSuccessResponse(deletedTask, 200, "Task deleted successfully");
  } catch (error) {
    console.error("Delete task error:", error);
    return createErrorResponse(500, "Internal server error");
  } finally {
    await prisma.$disconnect();
  }
}
