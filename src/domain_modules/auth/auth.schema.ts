import {z} from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    })
})

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    })
});

export type RegisterDTO = z.infer<typeof registerSchema>["body"];
export type LoginDTO  = z.infer<typeof loginSchema>["body"];