import * as z from "zod";

export const createUserSchema = z.object({
    email: z.email("Invalid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["user", "admin", "moderator"]).optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.email("Invalid email address").optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;


export const setPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type SetPasswordFormData = z.infer<typeof setPasswordSchema>;



export const banUserSchema = z.object({
    banReason: z.string().min(5, "Reason must be at least 5 characters"),
    banExpiresIn: z.number().optional(),
});

export type BanUserFormData = z.infer<typeof banUserSchema>;