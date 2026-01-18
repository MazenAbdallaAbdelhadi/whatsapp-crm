import { Badge } from "@/components/ui/badge";
import { getRoleBadgeVariant, getRoleLabel } from "@/features/organizations/utils";
import type { MemberRole } from "@/features/organizations/types";

interface RoleBadgeProps {
    role: MemberRole;
    className?: string;
}

/**
 * Display badge for organization member roles with appropriate styling
 */
export function RoleBadge({ role, className }: RoleBadgeProps) {
    return (
        <Badge variant={getRoleBadgeVariant(role)} className={className}>
            {getRoleLabel(role)}
        </Badge>
    );
}
