"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Plus, Building2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { RoleBadge } from "./role-badge";
import type { UserOrganization, Organization } from "@/features/organizations/types";
import { setActiveOrganization } from "@/features/organizations/api";
import { getInitials, getOrganizationUrl } from "@/features/organizations/utils";

interface OrganizationSwitcherProps {
    organizations: UserOrganization[];
    activeOrganization?: Organization | null;
    isLoading?: boolean;
    onOrganizationChange?: (organization: UserOrganization) => void;
}

export function OrganizationSwitcher({
    organizations,
    activeOrganization,
    isLoading = false,
    onOrganizationChange,
}: OrganizationSwitcherProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);

    // Find the active org's full data from the organizations list
    const activeOrgFull = activeOrganization
        ? organizations.find((org) => org.id === activeOrganization.id)
        : null;

    const handleSelect = (org: UserOrganization) => {
        if (org.id === activeOrganization?.id) {
            setOpen(false);
            return;
        }

        startTransition(async () => {
            const success = await setActiveOrganization(org.id);
            if (success) {
                setOpen(false);
                onOrganizationChange?.(org);
                router.refresh();
            }
        });
    };

    const handleCreateNew = () => {
        setOpen(false);
        router.push("/organizations/new");
    };

    const handleViewAll = () => {
        setOpen(false);
        router.push("/organizations");
    };

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
            </div>
        );
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-between px-2 h-auto py-2"
                    disabled={isPending}
                >
                    <div className="flex items-center gap-2 min-w-0">
                        {activeOrgFull ? (
                            <>
                                <Avatar className="h-7 w-7">
                                    {activeOrgFull.logo && (
                                        <AvatarImage src={activeOrgFull.logo} alt={activeOrgFull.name} />
                                    )}
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                        {getInitials(activeOrgFull.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start min-w-0">
                                    <span className="font-medium text-sm truncate max-w-[120px]">
                                        {activeOrgFull.name}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    Select Organization
                                </span>
                            </>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[240px]" align="start">
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {organizations.length === 0 ? (
                    <div className="py-4 px-2 text-center">
                        <p className="text-sm text-muted-foreground">No organizations yet</p>
                    </div>
                ) : (
                    organizations.map((org) => {
                        const isActive = org.id === activeOrganization?.id;
                        return (
                            <DropdownMenuItem
                                key={org.id}
                                onClick={() => handleSelect(org)}
                                className="cursor-pointer"
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Avatar className="h-6 w-6">
                                        {org.logo && <AvatarImage src={org.logo} alt={org.name} />}
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {getInitials(org.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-sm font-medium truncate">{org.name}</span>
                                        <RoleBadge role={org.role} className="w-fit text-[10px] px-1.5 py-0" />
                                    </div>
                                    {isActive && <Check className="h-4 w-4 shrink-0" />}
                                </div>
                            </DropdownMenuItem>
                        );
                    })
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleViewAll} className="cursor-pointer">
                    <Building2 className="mr-2 h-4 w-4" />
                    View All Organizations
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleCreateNew} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Organization
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
