import { z } from "zod";

// Auth Schemas
export const RegisterSchema = z.object({
  usn: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  pass: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  usn: z.string().min(1, "Username is required"),
  pass: z.string().min(1, "Password is required"),
});

// User Schemas
export const CreateUserSchema = z.object({
  usn: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  pass: z.string().min(6, "Password must be at least 6 characters"),
});

export const UpdateUserSchema = z.object({
  usn: z.string().min(3).optional(),
  email: z.string().email().optional(),
  pass: z.string().min(6).optional(),
});

// Task Schemas
export const CreateTaskSchema = z.object({
  task_name: z.string().min(1, "Task name is required"),
  due_date: z.coerce.date(),
  status: z.string().default("pending").optional(),
  completed: z.boolean().default(false).optional(),
});

export const UpdateTaskSchema = z.object({
  task_name: z.string().min(1).optional(),
  due_date: z.coerce.date().optional(),
  status: z.string().optional(),
  completed: z.boolean().optional(),
});

// Tracker Schemas
export const CreateTrackerSchema = z.object({
  tracker_type: z.string().min(1, "Tracker type is required"),
  duration: z.number().int().positive("Duration must be positive"),
  date: z.coerce.date().optional(),
  taskId: z.string().optional(),
});

export const UpdateTrackerSchema = z.object({
  tracker_type: z.string().min(1).optional(),
  duration: z.number().int().positive().optional(),
  date: z.coerce.date().optional(),
  taskId: z.string().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type CreateTrackerInput = z.infer<typeof CreateTrackerSchema>;
export type UpdateTrackerInput = z.infer<typeof UpdateTrackerSchema>;
