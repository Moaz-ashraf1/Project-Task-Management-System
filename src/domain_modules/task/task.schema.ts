import { z } from "zod";
import { TaskStatus, TaskPriority } from "./task.entity";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z.string().datetime().optional(),
    assignee_id: z.string().uuid().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z.string().datetime().optional(),
    assignee_id: z.string().uuid().nullable().optional(),
  }),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>["body"];
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>["body"];