import prisma from "@/lib/prisma";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { CreateTrackerSchema } from "@/lib/validation";
import { createErrorResponse, createSuccessResponse, handleZodError } from "@/lib/errors";

// GET all trackers for authenticated user
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

    const trackers = await prisma.tracker.findMany({
      where: { userId: payload.usn },
      select: {
        tracker_id: true,
        tracker_type: true,
        duration: true,
        taskId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return createSuccessResponse(trackers, 200, "Trackers retrieved successfully");
  } catch (error) {
    console.error("Get trackers error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}

// POST create tracker
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
    const validation = CreateTrackerSchema.safeParse(body);
    if (!validation.success) {
      const errors = handleZodError(validation.error);
      return createErrorResponse(400, "Validation failed", errors);
    }

    const { tracker_type, duration, taskId } = validation.data;

    // If taskId is provided, verify it belongs to the user
    if (taskId) {
      const task = await prisma.task.findUnique({
        where: { task_id: taskId },
      });

      if (!task || task.userId !== payload.usn) {
        return createErrorResponse(403, "Forbidden: Task not found or not yours");
      }
    }

    // Create tracker
    const tracker = await prisma.tracker.create({
      data: {
        tracker_type,
        duration,
        userId: payload.usn,
        taskId: taskId || null,
      },
      select: {
        tracker_id: true,
        tracker_type: true,
        duration: true,
        taskId: true,
        createdAt: true,
      },
    });

    return createSuccessResponse(tracker, 201, "Tracker created successfully");
  } catch (error) {
    console.error("Create tracker error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}
