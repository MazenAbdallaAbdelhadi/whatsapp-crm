import type { MemberRole, InvitationStatus } from "@/features/organizations/types";

// ============== Slug Generation ==============

/**
 * Generate a URL-safe slug from an organization name
 * - Converts to lowercase
 * - Replaces spaces and special characters with hyphens
 * - Removes consecutive hyphens
 * - Trims leading/trailing hyphens
 * - Ensures it starts with a letter
 */
export function generateSlug(name: string): string {
    let slug = name
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, ""); // Trim hyphens from ends

    // Ensure slug starts with a letter
    if (slug && !/^[a-z]/.test(slug)) {
        slug = "org-" + slug;
    }

    return slug || "organization";
}

/**
 * Validate if a string is a valid slug format
 */
export function isValidSlug(slug: string): boolean {
    return /^[a-z][a-z0-9-]*$/.test(slug) && slug.length >= 2 && slug.length <= 50;
}

// ============== Avatar & Display Helpers ==============

/**
 * Get initials from a name for avatar fallback
 * Takes first letter of first two words
 */
export function getInitials(name: string): string {
    if (!name) return "??";

    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}

/**
 * Get a placeholder avatar URL based on name
 */
export function getAvatarPlaceholder(name: string): string {
    const initials = getInitials(name);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff`;
}

// ============== Date Formatting ==============

/**
 * Format a date for display (e.g., "Jan 15, 2026")
 */
export function formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(dateObj);
}

/**
 * Format a date with time (e.g., "Jan 15, 2026, 3:45 PM")
 */
export function formatDateTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(dateObj);
}

/**
 * Format a relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffMs = dateObj.getTime() - now.getTime();
    const diffSeconds = Math.round(diffMs / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (Math.abs(diffDays) >= 1) {
        return rtf.format(diffDays, "day");
    } else if (Math.abs(diffHours) >= 1) {
        return rtf.format(diffHours, "hour");
    } else if (Math.abs(diffMinutes) >= 1) {
        return rtf.format(diffMinutes, "minute");
    } else {
        return rtf.format(diffSeconds, "second");
    }
}

// ============== Role Utilities ==============

/**
 * Role hierarchy for permission checking
 * Higher number = more permissions
 */
const ROLE_HIERARCHY: Record<MemberRole, number> = {
    owner: 3,
    admin: 2,
    member: 1,
};

/**
 * Check if a user has at least the required role level
 */
export function hasPermission(
    userRole: MemberRole,
    requiredRole: MemberRole
): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if user can manage members (invite, remove, change roles)
 */
export function canManageMembers(role: MemberRole): boolean {
    return hasPermission(role, "admin");
}

/**
 * Check if user can update organization settings
 */
export function canManageOrganization(role: MemberRole): boolean {
    return hasPermission(role, "admin");
}

/**
 * Check if user can delete the organization
 */
export function canDeleteOrganization(role: MemberRole): boolean {
    return role === "owner";
}

/**
 * Check if user can transfer ownership
 */
export function canTransferOwnership(role: MemberRole): boolean {
    return role === "owner";
}

/**
 * Get human-readable role label
 */
export function getRoleLabel(role: MemberRole): string {
    const labels: Record<MemberRole, string> = {
        owner: "Owner",
        admin: "Admin",
        member: "Member",
    };
    return labels[role] || role;
}

/**
 * Get badge variant for role display
 */
export function getRoleBadgeVariant(
    role: MemberRole
): "default" | "secondary" | "outline" {
    switch (role) {
        case "owner":
            return "default";
        case "admin":
            return "secondary";
        case "member":
            return "outline";
    }
}

/**
 * Get available roles that a user can assign
 * Owners can assign all roles, admins can only assign admin/member
 */
export function getAssignableRoles(assignerRole: MemberRole): MemberRole[] {
    if (assignerRole === "owner") {
        return ["owner", "admin", "member"];
    } else if (assignerRole === "admin") {
        return ["admin", "member"];
    }
    return [];
}

// ============== Invitation Utilities ==============

/**
 * Check if an invitation has expired
 */
export function isInvitationExpired(expiresAt: Date | string): boolean {
    const expiryDate = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
    return expiryDate < new Date();
}

/**
 * Check if an invitation is still actionable (pending and not expired)
 */
export function isInvitationActionable(
    status: InvitationStatus,
    expiresAt: Date | string
): boolean {
    return status === "pending" && !isInvitationExpired(expiresAt);
}

/**
 * Get human-readable invitation status label
 */
export function getInvitationStatusLabel(status: InvitationStatus): string {
    const labels: Record<InvitationStatus, string> = {
        pending: "Pending",
        accepted: "Accepted",
        rejected: "Declined",
        canceled: "Canceled",
    };
    return labels[status] || status;
}

/**
 * Get badge variant for invitation status
 */
export function getInvitationBadgeVariant(
    status: InvitationStatus
): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "accepted":
            return "default";
        case "pending":
            return "secondary";
        case "rejected":
            return "destructive";
        case "canceled":
            return "outline";
    }
}

// ============== Metadata Utilities ==============

/**
 * Parse organization metadata from JSON string
 */
export function parseMetadata(metadata: string | null): Record<string, unknown> | null {
    if (!metadata) return null;
    try {
        return JSON.parse(metadata);
    } catch {
        return null;
    }
}

/**
 * Stringify metadata object to JSON
 */
export function stringifyMetadata(metadata: Record<string, unknown> | null): string | null {
    if (!metadata) return null;
    try {
        return JSON.stringify(metadata);
    } catch {
        return null;
    }
}

// ============== URL Utilities ==============

/**
 * Get the organization's detail page URL
 */
export function getOrganizationUrl(slug: string): string {
    return `/organizations/${slug}`;
}

/**
 * Get the organization's members page URL
 */
export function getOrganizationMembersUrl(slug: string): string {
    return `/organizations/${slug}/members`;
}

/**
 * Get the organization's settings page URL
 */
export function getOrganizationSettingsUrl(slug: string): string {
    return `/organizations/${slug}/settings`;
}

/**
 * Get the organization's invitations page URL
 */
export function getOrganizationInvitationsUrl(slug: string): string {
    return `/organizations/${slug}/invitations`;
}

/**
 * Get the invitation action page URL
 */
export function getInvitationActionUrl(invitationId: string): string {
    return `/organizations/invitations/${invitationId}`;
}
