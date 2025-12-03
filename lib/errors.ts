export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createErrorResponse(
  statusCode: number,
  message: string,
  errors?: Record<string, string>
) {
  return Response.json(
    {
      success: false,
      error: message,
      errors,
    },
    { status: statusCode }
  );
}

export function createSuccessResponse<T>(
  data: T,
  statusCode: number = 200,
  message: string = "Success"
) {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status: statusCode }
  );
}

export function handleZodError(error: unknown) {
  const errors: Record<string, string> = {};
  if (
    error &&
    typeof error === "object" &&
    "errors" in error &&
    Array.isArray(error.errors)
  ) {
    error.errors.forEach((err: { path: string[]; message: string }) => {
      const path = err.path.join(".");
      errors[path] = err.message;
    });
  }
  return errors;
}
