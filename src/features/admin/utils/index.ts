import { formatDistanceToNow, format } from "date-fns";
import {UAParser} from "ua-parser-js";

/**
 * Get badge variant for user role
 */
export function getRoleBadgeVariant(
    role: string | null
): "default" | "secondary" | "destructive" | "outline" {
    if (!role) return "outline";

    const normalizedRole = role.toLowerCase();

    if (normalizedRole.includes("admin")) return "destructive";
    if (normalizedRole.includes("moderator") || normalizedRole.includes("mod"))
        return "secondary";

    return "default";
}

/**
 * Get badge variant for user status
 */
export function getStatusBadgeVariant(
    banned: boolean | null
): "default" | "destructive" {
    return banned ? "destructive" : "default";
}

/**
 * Format user roles (handles comma-separated roles)
 */
export function formatRoles(role: string | null): string[] {
    if (!role) return ["user"];
    return role.split(",").map((r) => r.trim());
}

/**
 * Format date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
    try {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch {
        return "Unknown";
    }
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
    try {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return format(dateObj, "MMM d, yyyy 'at' h:mm a");
    } catch {
        return "Unknown";
    }
}

/**
 * Format date to short format
 */
export function formatShortDate(date: Date | string): string {
    try {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return format(dateObj, "MMM d, yyyy");
    } catch {
        return "Unknown";
    }
}

/**
 * Parse user agent string to get device and browser info
 */
export function parseUserAgent(userAgent: string | null): {
    device: string;
    browser: string;
    os: string;
} {
    if (!userAgent) {
        return {
            device: "Unknown Device",
            browser: "Unknown Browser",
            os: "Unknown OS",
        };
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const device =
        result.device.type === "mobile"
            ? `${result.device.vendor || ""} ${result.device.model || "Mobile"}`.trim()
            : result.device.type === "tablet"
                ? `${result.device.vendor || ""} ${result.device.model || "Tablet"}`.trim()
                : "Desktop";

    const browser = result.browser.name
        ? `${result.browser.name} ${result.browser.version || ""}`.trim()
        : "Unknown Browser";

    const os = result.os.name
        ? `${result.os.name} ${result.os.version || ""}`.trim()
        : "Unknown OS";

    return {
        device: device || "Unknown Device",
        browser,
        os,
    };
}

/**
 * Get initials from name for avatar fallback
 */
export function getInitials(name: string): string {
    if (!name) return "?";

    const parts = name.trim().split(" ");
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Check if user has admin role
 */
export function isAdmin(role: string | null): boolean {
    if (!role) return false;
    return role.toLowerCase().includes("admin");
}

/**
 * Format ban duration options
 */
export const BAN_DURATIONS = [
    { label: "1 Day", value: 60 * 60 * 24 },
    { label: "7 Days", value: 60 * 60 * 24 * 7 },
    { label: "30 Days", value: 60 * 60 * 24 * 30 },
    { label: "90 Days", value: 60 * 60 * 24 * 90 },
    { label: "1 Year", value: 60 * 60 * 24 * 365 },
    { label: "Permanent", value: undefined },
] as const;

/**
 * Get ban duration label from seconds
 */
export function getBanDurationLabel(seconds?: number): string {
    if (!seconds) return "Permanent";

    const duration = BAN_DURATIONS.find((d) => d.value === seconds);
    if (duration) return duration.label;

    // Calculate custom duration
    const days = Math.floor(seconds / (60 * 60 * 24));
    return `${days} days`;
}
