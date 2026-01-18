"use client";

import { useEffect, useState } from "react";
import { Metadata } from "next";

import { Skeleton } from "@/components/ui/skeleton";

import {
    OrganizationsTable,
    CreateOrganizationDialog,
} from "@/features/organizations/components";
import { listUserOrganizations } from "@/features/organizations/api";
import type { UserOrganization } from "@/features/organizations/types";

function OrganizationsLoading() {
    return (
        <div className="rounded-md border">
            <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-1 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function OrganizationsPage() {
    const [organizations, setOrganizations] = useState<UserOrganization[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchOrganizations() {
            const data = await listUserOrganizations();
            setOrganizations(data);
            setIsLoading(false);
        }
        fetchOrganizations();
    }, []);

    return (
        <div className="container py-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your organizations and team memberships
                    </p>
                </div>
                <CreateOrganizationDialog />
            </div>

            {isLoading ? (
                <OrganizationsLoading />
            ) : (
                <OrganizationsTable organizations={organizations || []} />
            )}
        </div>
    );
}
