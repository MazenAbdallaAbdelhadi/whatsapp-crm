"use client";

import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { RoleBadge } from "./role-badge";
import type { UserOrganization } from "@/features/organizations/types";
import { formatDate, getInitials, getOrganizationUrl } from "@/features/organizations/utils";

interface OrganizationCardProps {
    organization: UserOrganization;
    onClick?: () => void;
}

/**
 * Card component for displaying organization in grid/list layouts
 */
export function OrganizationCard({ organization, onClick }: OrganizationCardProps) {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.push(getOrganizationUrl(organization.slug));
        }
    };

    return (
        <Card
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20"
            onClick={handleClick}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                        {organization.logo && (
                            <AvatarImage src={organization.logo} alt={organization.name} />
                        )}
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(organization.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">{organization.name}</h3>
                            <RoleBadge role={organization.role} />
                        </div>

                        <p className="text-sm text-muted-foreground truncate">
                            /{organization.slug}
                        </p>

                        <p className="text-xs text-muted-foreground mt-2">
                            Created {formatDate(organization.createdAt)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface OrganizationCardGridProps {
    organizations: UserOrganization[];
}

/**
 * Grid layout for multiple organization cards
 */
export function OrganizationCardGrid({ organizations }: OrganizationCardGridProps) {
    if (organizations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No organizations yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Create your first organization to start collaborating with your team.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
                <OrganizationCard key={org.id} organization={org} />
            ))}
        </div>
    );
}
