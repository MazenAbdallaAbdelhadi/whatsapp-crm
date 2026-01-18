"use client";

import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { ReceivedInvitationsList } from "@/features/organizations/components";
import { listUserInvitations } from "@/features/organizations/api";
import type { FullInvitation } from "@/features/organizations/types";

function InvitationsLoading() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function UserInvitationsPage() {
    const [invitations, setInvitations] = useState<FullInvitation[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchInvitations() {
            const data = await listUserInvitations();
            setInvitations(data);
            setIsLoading(false);
        }
        fetchInvitations();
    }, []);

    const handleInvitationUpdated = () => {
        // Refetch invitations after update
        setIsLoading(true);
        listUserInvitations().then((data) => {
            setInvitations(data);
            setIsLoading(false);
        });
    };

    return (
        <div className="container py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
                <p className="text-muted-foreground mt-1">
                    Pending invitations to join organizations
                </p>
            </div>

            {isLoading ? (
                <InvitationsLoading />
            ) : (
                <ReceivedInvitationsList
                    invitations={invitations || []}
                    onInvitationUpdated={handleInvitationUpdated}
                />
            )}
        </div>
    );
}
