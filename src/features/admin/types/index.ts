import { z } from "zod";

// Base User type from better-auth
export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string | null;
    image: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    banned: boolean | null;
    banReason: string | null;
    banExpires: Date | null;
}

// Session type
export interface AdminSession {
    id: string;
    userId: string;
    token: string;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    user?: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
}

// List users response type
export interface ListUsersResponse {
    users: AdminUser[];
    total: number;
    limit?: number;
    offset?: number;
}

// List users query params
export interface ListUsersParams {
    searchValue?: string;
    searchField?: "email" | "name";
    searchOperator?: "contains" | "starts_with" | "ends_with";
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    filterField?: string;
    filterValue?: string | number | boolean;
    filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
}

// Form schemas
export const createUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.string().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;


export const changeRoleSchema = z.object({
    role: z.string().min(1, "Role is required"),
});

export type ChangeRoleFormData = z.infer<typeof changeRoleSchema>;


// Table types
export interface UserTableData {
    id: string;
    name: string;
    email: string;
    role: string | null;
    banned: boolean | null;
    createdAt: Date;
    image: string | null;
}

export interface SessionTableData {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userImage: string | null;
    device: string;
    browser: string;
    ipAddress: string | null;
    lastActive: Date;
    createdAt: Date;
}
