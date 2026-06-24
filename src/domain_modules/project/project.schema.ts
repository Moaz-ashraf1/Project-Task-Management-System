import { z } from "zod";
import { ProjectStatus } from "./project.entity";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectStatus).optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectStatus).optional(),
  }),
});

export type CreateProjectDTO = z.infer<typeof createProjectSchema>["body"];
export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>["body"];