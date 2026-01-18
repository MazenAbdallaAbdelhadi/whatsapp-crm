"use client";

import { useTransition } from "react";
import { Check, X, Clock, Mail, Ban } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { RoleBadge } from "./role-badge";
import type {
    Invitation,
    FullInvitation,
    InvitationStatus,
    MemberRole,
} from "@/features/organizations/types";
import {
    acceptInvitation,
    rejectInvitation,
    cancelInvitation,
} from "@/features/organizations/api";
import {
    formatDate,
    formatRelativeTime,
    getInitials,
    getInvitationBadgeVariant,
    getInvitationStatusLabel,
    isInvitationExpired,
    isInvitationActionable,
} from "@/features/organizations/utils";

// ============================================================================
// SENT INVITATIONS LIST (Admin view for organization invitations)
// ============================================================================

interface SentInvitationsListProps {
    invitations: Invitation[];
    isLoading?: boolean;
    onInvitationUpdated?: () => void;
}

export function SentInvitationsList({
    invitations,
    isLoading = false,
    onInvitationUpdated,
}: SentInvitationsListProps) {
    const [isPending, startTransition] = useTransition();

    const handleCancel = (invitationId: string) => {
        startTransition(async () => {
            const success = await cancelInvitation(invitationId);
            if (success) {
                onInvitationUpdated?.();
            }
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (invitations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <Mail className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No invitations sent</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Invite team members to collaborate in this organization.
                </p>
            </div>
        );
    }

    // Sort: pending first, then by date
    const sortedInvitations = [...invitations].sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="space-y-3">
            {sortedInvitations.map((invitation) => {
                const expired = isInvitationExpired(invitation.expiresAt);
                const actionable = isInvitationActionable(invitation.status, invitation.expiresAt);

                return (
                    <Card key={invitation.id} className={expired ? "opacity-60" : undefined}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{invitation.email}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        {invitation.role && (
                                            <RoleBadge role={invitation.role as MemberRole} className="text-xs" />
                                        )}
                                        <Badge variant={getInvitationBadgeVariant(invitation.status)}>
                                            {getInvitationStatusLabel(invitation.status)}
                                        </Badge>
                                        {invitation.status === "pending" && (
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {expired ? "Expired" : `Expires ${formatRelativeTime(invitation.expiresAt)}`}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {actionable && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCancel(invitation.id)}
                                        disabled={isPending}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <Ban className="h-4 w-4 mr-1" />
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

// ============================================================================
// RECEIVED INVITATIONS LIST (User's pending invitations)
// ============================================================================

interface ReceivedInvitationsListProps {
    invitations: FullInvitation[];
    isLoading?: boolean;
    onInvitationUpdated?: () => void;
}

export function ReceivedInvitationsList({
    invitations,
    isLoading = false,
    onInvitationUpdated,
}: ReceivedInvitationsListProps) {
    const [isPending, startTransition] = useTransition();

    const handleAccept = (invitationId: string) => {
        startTransition(async () => {
            const success = await acceptInvitation(invitationId);
            if (success) {
                onInvitationUpdated?.();
            }
        });
    };

    const handleReject = (invitationId: string) => {
        startTransition(async () => {
            const success = await rejectInvitation(invitationId);
            if (success) {
                onInvitationUpdated?.();
            }
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Filter to only pending invitations
    const pendingInvitations = invitations.filter(
        (inv) => inv.status === "pending" && !isInvitationExpired(inv.expiresAt)
    );

    if (pendingInvitations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <Mail className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No pending invitations</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    When someone invites you to join their organization, it will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {pendingInvitations.map((invitation) => (
                <Card key={invitation.id}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                {invitation.organization.logo && (
                                    <AvatarImage
                                        src={invitation.organization.logo}
                                        alt={invitation.organization.name}
                                    />
                                )}
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {getInitials(invitation.organization.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{invitation.organization.name}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    {invitation.role && (
                                        <span className="text-sm text-muted-foreground">
                                            Role: <RoleBadge role={invitation.role as MemberRole} className="text-xs" />
                                        </span>
                                    )}
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Expires {formatRelativeTime(invitation.expiresAt)}
                                    </span>
                                </div>
                                {invitation.inviter && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Invited by {invitation.inviter.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2 shrink-0">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleReject(invitation.id)}
                                    disabled={isPending}
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Decline
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => handleAccept(invitation.id)}
                                    disabled={isPending}
                                >
                                    <Check className="h-4 w-4 mr-1" />
                                    Accept
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
