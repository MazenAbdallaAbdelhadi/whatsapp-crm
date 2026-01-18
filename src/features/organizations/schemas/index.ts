import * as z from "zod";

/**
 * Slug validation regex - lowercase letters, numbers, and hyphens
 * Must start with a letter to avoid numeric-only slugs
 */
const slugRegex = /^[a-z][a-z0-9-]*$/;

/**
 * Schema for creating a new organization
 */
export const createOrganizationSchema = z.object({
    name: z
        .string()
        .min(2, "Organization name must be at least 2 characters")
        .max(50, "Organization name must be at most 50 characters")
        .trim(),
    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters")
        .max(50, "Slug must be at most 50 characters")
        .regex(
            slugRegex,
            "Slug must start with a letter and contain only lowercase letters, numbers, and hyphens"
        )
        .trim(),
    logo: z
        .string()
        .url("Please enter a valid URL")
        .optional()
        .or(z.literal("")),
});

export type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>;

/**
 * Schema for updating an organization
 */
export const updateOrganizationSchema = z.object({
    name: z
        .string()
        .min(2, "Organization name must be at least 2 characters")
        .max(50, "Organization name must be at most 50 characters")
        .trim()
        .optional(),
    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters")
        .max(50, "Slug must be at most 50 characters")
        .regex(
            slugRegex,
            "Slug must start with a letter and contain only lowercase letters, numbers, and hyphens"
        )
        .trim()
        .optional(),
    logo: z
        .string()
        .url("Please enter a valid URL")
        .optional()
        .or(z.literal(""))
        .nullable(),
});

export type UpdateOrganizationFormData = z.infer<typeof updateOrganizationSchema>;

/**
 * Schema for inviting a member
 * Role is restricted to admin or member (owner is assigned on creation only)
 */
export const inviteMemberSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address")
        .trim()
        .toLowerCase(),
    role: z.enum(["admin", "member"], {
        required_error: "Please select a role",
        invalid_type_error: "Please select a valid role",
    }),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

/**
 * Schema for updating a member's role
 * Includes owner for role transfer scenarios
 */
export const updateMemberRoleSchema = z.object({
    role: z.enum(["owner", "admin", "member"], {
        required_error: "Please select a role",
        invalid_type_error: "Please select a valid role",
    }),
});

export type UpdateMemberRoleFormData = z.infer<typeof updateMemberRoleSchema>;

/**
 * Schema for confirming dangerous actions (delete, leave, transfer ownership)
 */
export const confirmActionSchema = z.object({
    confirmation: z.literal(true, {
        errorMap: () => ({ message: "Please confirm this action" }),
    }),
});

export type ConfirmActionFormData = z.infer<typeof confirmActionSchema>;

/**
 * Schema for organization slug availability check
 */
export const checkSlugSchema = z.object({
    slug: z
        .string()
        .min(2)
        .max(50)
        .regex(slugRegex)
        .trim(),
});

export type CheckSlugFormData = z.infer<typeof checkSlugSchema>;
