import prisma from "@/lib/prisma";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { createErrorResponse, createSuccessResponse } from "@/lib/errors";

// GET all trackers
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader ?? undefined);

    if (!token) return createErrorResponse(401, "Unauthorized: Missing token");

    const payload = verifyToken(token);
    if (!payload) return createErrorResponse(401, "Unauthorized: Invalid token");

    const trackers = await prisma.tracker.findMany({
      where: { userId: payload.usn },
      select: {
        tracker_id: true,
        tracker_type: true,
        duration: true,
        taskId: true,
        createdAt: true,
        updatedAt: true,
        task: {
            select: { task_name: true }
        }
      },
      orderBy: { createdAt: 'desc' } // Urutkan dari yang terbaru
    });

    return createSuccessResponse(trackers, 200, "Trackers retrieved successfully");
  } catch (error) {
    console.error("Get trackers error:", error);
    return createErrorResponse(500, "Internal server error");
  }
}

// POST create tracker (FIX: Validasi Manual agar support NULL task_id)
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader ?? undefined);

    if (!token) return createErrorResponse(401, "Unauthorized: Missing token");

    const payload = verifyToken(token);
    if (!payload) return createErrorResponse(401, "Unauthorized: Invalid token");

    const body = await req.json();

    if (!body.tracker_type || body.duration === undefined) {
        return createErrorResponse(400, "Validation failed: tracker_type and duration are required");
    }

    const tracker_type = String(body.tracker_type);
    const duration = Number(body.duration);

    let inputTaskId = body.task_id || body.taskId || null;
    
    if (inputTaskId === "") inputTaskId = null;

    if (inputTaskId) {
      const task = await prisma.task.findUnique({
        where: { task_id: inputTaskId },
      });

      if (!task || task.userId !== payload.usn) {
        return createErrorResponse(403, "Forbidden: Task not found or not yours");
      }
    }

    const tracker = await prisma.tracker.create({
      data: {
        tracker_type,
        duration,
        userId: payload.usn,
        taskId: inputTaskId, 
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