import prisma from "@/lib/prisma";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { UpdateTrackerSchema } from "@/lib/validation";
import { createErrorResponse, createSuccessResponse, handleZodError } from "@/lib/errors";

// GET tracker by ID
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

    const tracker = await prisma.tracker.findUnique({
      where: { tracker_id: id },
      select: {
        tracker_id: true,
        tracker_type: true,
        duration: true,
        taskId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!tracker) {
      return createErrorResponse(404, "Tracker not found");
    }

    // Check authorization
    if (tracker.userId !== payload.usn) {
      return createErrorResponse(403, "Forbidden: Not your tracker");
    }

    return createSuccessResponse(tracker, 200, "Tracker retrieved successfully");
  } catch (error) {
    console.error("Get tracker error:", error);
    return createErrorResponse(500, "Internal server error");
  } finally {
    await prisma.$disconnect();
  }
}

// PUT update tracker
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
    const validation = UpdateTrackerSchema.safeParse(body);
    if (!validation.success) {
      const errors = handleZodError(validation.error);
      return createErrorResponse(400, "Validation failed", errors);
    }

    // Check if tracker exists
    const tracker = await prisma.tracker.findUnique({
      where: { tracker_id: id },
    });

    if (!tracker) {
      return createErrorResponse(404, "Tracker not found");
    }

    // Check authorization
    if (tracker.userId !== payload.usn) {
      return createErrorResponse(403, "Forbidden: Not your tracker");
    }

    const updateData: Record<string, unknown> = {};

    if (validation.data.tracker_type)
      updateData.tracker_type = validation.data.tracker_type;
    if (validation.data.duration) updateData.duration = validation.data.duration;

    if (validation.data.taskId !== undefined) {
      if (validation.data.taskId) {
        // Verify task belongs to user
        const task = await prisma.task.findUnique({
          where: { task_id: validation.data.taskId },
        });

        if (!task || task.userId !== payload.usn) {
          return createErrorResponse(403, "Forbidden: Task not found or not yours");
        }
      }
      updateData.taskId = validation.data.taskId || null;
    }

    const updatedTracker = await prisma.tracker.update({
      where: { tracker_id: id },
      data: updateData,
      select: {
        tracker_id: true,
        tracker_type: true,
        duration: true,
        taskId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return createSuccessResponse(
      updatedTracker,
      200,
      "Tracker updated successfully"
    );
  } catch (error) {
    console.error("Update tracker error:", error);
    return createErrorResponse(500, "Internal server error");
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE tracker
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

    // Check if tracker exists
    const tracker = await prisma.tracker.findUnique({
      where: { tracker_id: id },
    });

    if (!tracker) {
      return createErrorResponse(404, "Tracker not found");
    }

    // Check authorization
    if (tracker.userId !== payload.usn) {
      return createErrorResponse(403, "Forbidden: Not your tracker");
    }

    // Delete tracker
    const deletedTracker = await prisma.tracker.delete({
      where: { tracker_id: id },
      select: {
        tracker_id: true,
        tracker_type: true,
      },
    });

    return createSuccessResponse(deletedTracker, 200, "Tracker deleted successfully");
  } catch (error) {
    console.error("Delete tracker error:", error);
    return createErrorResponse(500, "Internal server error");
  } finally {
    await prisma.$disconnect();
  }
}
