import { cache } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";

import type {
    AdminUser,
    AdminSession,
    ListUsersResponse,
    ListUsersParams,
    CreateUserFormData,
} from "@/features/admin/types";
import { BanUserFormData, UpdateUserFormData } from "@/features/admin/schemas";

/**
 * Admin API Client
 * Centralized API functions for admin operations with consistent error handling
 */

// ============== User Management ==============
export const listUsers = cache(async (
    params?: ListUsersParams
): Promise<ListUsersResponse | null> => {
    try {
        const { data, error } = await authClient.admin.listUsers({
            query: params as Record<string, string | number | boolean | undefined>,
        });

        if (error) {
            toast.error("Failed to fetch users", {
                description: error.message || "An error occurred",
            });
            return null;
        }

        return data as ListUsersResponse;
    } catch (error) {
        console.error("List users error:", error);
        toast.error("Failed to fetch users", {
            description: "An unexpected error occurred",
        });
        return null;
    }
})

export async function createUser(
    userData: CreateUserFormData
): Promise<AdminUser | null> {
    try {
        const { data, error } = await authClient.admin.createUser({
            email: userData.email,
            password: userData.password,
            name: userData.name,
            role: (userData.role || "user") as any,
        });

        if (error) {
            toast.error("Failed to create user", {
                description: error.message || "An error occurred",
            });
            return null;
        }

        toast.success("User created successfully", {
            description: `${userData.name} has been added to the system`,
        });

        return data.user as AdminUser;
    } catch (error) {
        console.error("Create user error:", error);
        toast.error("Failed to create user", {
            description: "An unexpected error occurred",
        });
        return null;
    }
}

export async function updateUser(
    userId: string,
    userData: UpdateUserFormData
): Promise<AdminUser | null> {
    try {
        const { data, error } = await authClient.admin.updateUser({
            userId,
            data: userData,
        });

        if (error) {
            toast.error("Failed to update user", {
                description: error.message || "An error occurred",
            });
            return null;
        }

        toast.success("User updated successfully");

        return data as AdminUser;
    } catch (error) {
        console.error("Update user error:", error);
        toast.error("Failed to update user", {
            description: "An unexpected error occurred",
        });
        return null;
    }
}

export async function setUserRole(
    userId: string,
    role: string
): Promise<boolean> {
    try {
        const { error } = await authClient.admin.setRole({
            userId,
            role: role as any,
        });

        if (error) {
            toast.error("Failed to change user role", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("User role updated successfully");
        return true;
    } catch (error) {
        console.error("Set user role error:", error);
        toast.error("Failed to change user role", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

export async function setUserPassword(
    userId: string,
    newPassword: string
): Promise<boolean> {
    try {
        const { error } = await authClient.admin.setUserPassword({
            userId,
            newPassword,
        });

        if (error) {
            toast.error("Failed to set password", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("Password updated successfully");
        return true;
    } catch (error) {
        console.error("Set password error:", error);
        toast.error("Failed to set password", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

export async function banUser(
    userId: string,
    data: BanUserFormData
): Promise<boolean> {
    try {
        const { error } = await authClient.admin.banUser({
            userId,
            banReason: data.banReason,
            banExpiresIn: data.banExpiresIn,
        });

        if (error) {
            toast.error("Failed to ban user", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("User banned successfully");
        return true;
    } catch (error) {
        console.error("Ban user error:", error);
        toast.error("Failed to ban user", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

export async function unbanUser(userId: string): Promise<boolean> {
    try {
        const { error } = await authClient.admin.unbanUser({ userId });

        if (error) {
            toast.error("Failed to unban user", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("User unbanned successfully");
        return true;
    } catch (error) {
        console.error("Unban user error:", error);
        toast.error("Failed to unban user", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

export async function impersonateUser(userId: string): Promise<boolean> {
    try {
        const { error } = await authClient.admin.impersonateUser({ userId });

        if (error) {
            toast.error("Failed to impersonate user", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("Impersonation started", {
            description: "You are now viewing as this user",
        });

        // Reload the page to reflect the impersonated session
        window.location.reload();
        return true;
    } catch (error) {
        console.error("Impersonate user error:", error);
        toast.error("Failed to impersonate user", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

export async function stopImpersonating(): Promise<boolean> {
    try {
        await authClient.admin.stopImpersonating();

        toast.success("Impersonation stopped", {
            description: "Returned to admin account",
        });

        // Reload to reflect the admin session
        window.location.reload();
        return true;
    } catch (error) {
        console.error("Stop impersonating error:", error);
        toast.error("Failed to stop impersonation", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

export async function removeUser(userId: string): Promise<boolean> {
    try {
        const { error } = await authClient.admin.removeUser({ userId });

        if (error) {
            toast.error("Failed to delete user", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("User deleted successfully");
        return true;
    } catch (error) {
        console.error("Remove user error:", error);
        toast.error("Failed to delete user", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

// ============== Session Management ==============

export const listUserSessions = cache(async (
    userId: string
): Promise<AdminSession[] | null> => {
    try {
        const { data, error } = await authClient.admin.listUserSessions({
            userId,
        });

        if (error) {
            toast.error("Failed to fetch user sessions", {
                description: error.message || "An error occurred",
            });
            return null;
        }

        return (data.sessions as AdminSession[]) || [];
    } catch (error) {
        console.error("List user sessions error:", error);
        toast.error("Failed to fetch user sessions", {
            description: "An unexpected error occurred",
        });
        return null;
    }
})

export async function revokeSession(sessionToken: string): Promise<boolean> {
    try {
        const { error } = await authClient.admin.revokeUserSession({
            sessionToken,
        });

        if (error) {
            toast.error("Failed to revoke session", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("Session revoked successfully");
        return true;
    } catch (error) {
        console.error("Revoke session error:", error);
        toast.error("Failed to revoke session", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

export async function revokeAllUserSessions(userId: string): Promise<boolean> {
    try {
        const { error } = await authClient.admin.revokeUserSessions({ userId });

        if (error) {
            toast.error("Failed to revoke sessions", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("All sessions revoked successfully");
        return true;
    } catch (error) {
        console.error("Revoke all sessions error:", error);
        toast.error("Failed to revoke sessions", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}
