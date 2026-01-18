"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { RoleBadge } from "@/features/organizations/components";
import {
    getInvitation,
    acceptInvitation,
    rejectInvitation,
} from "@/features/organizations/api";
import {
    getInitials,
    formatRelativeTime,
    isInvitationExpired,
} from "@/features/organizations/utils";
import type { FullInvitation, MemberRole } from "@/features/organizations/types";

interface InvitationActionPageProps {
    params: Promise<{ id: string }>;
}

export default function InvitationActionPage({ params }: InvitationActionPageProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [invitation, setInvitation] = useState<FullInvitation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchInvitation() {
            const { id } = await params;
            const inv = await getInvitation(id);
            if (!inv) {
                setError("Invitation not found or has been removed.");
            } else {
                setInvitation(inv);
            }
            setLoading(false);
        }
        fetchInvitation();
    }, [params]);

    const handleAccept = async () => {
        if (!invitation) return;

        startTransition(async () => {
            const success = await acceptInvitation(invitation.id);
            if (success) {
                router.push("/organizations");
                router.refresh();
            }
        });
    };

    const handleReject = async () => {
        if (!invitation) return;

        startTransition(async () => {
            const success = await rejectInvitation(invitation.id);
            if (success) {
                router.push("/organizations/invitations");
                router.refresh();
            }
        });
    };

    if (loading) {
        return (
            <div className="container py-12 flex justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                        <Skeleton className="h-6 w-48 mx-auto mt-4" />
                        <Skeleton className="h-4 w-64 mx-auto mt-2" />
                    </CardHeader>
                    <CardFooter className="justify-center gap-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (error || !invitation) {
        return (
            <div className="container py-12 flex justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-destructive">Invitation Error</CardTitle>
                        <CardDescription>
                            {error || "This invitation is no longer valid."}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button onClick={() => router.push("/organizations")}>
                            View Your Organizations
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const expired = isInvitationExpired(invitation.expiresAt);
    const alreadyHandled = invitation.status !== "pending";

    if (expired) {
        return (
            <div className="container py-12 flex justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <Avatar className="h-16 w-16 mx-auto">
                            {invitation.organization.logo && (
                                <AvatarImage
                                    src={invitation.organization.logo}
                                    alt={invitation.organization.name}
                                />
                            )}
                            <AvatarFallback className="bg-muted text-lg">
                                {getInitials(invitation.organization.name)}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="mt-4">Invitation Expired</CardTitle>
                        <CardDescription>
                            This invitation to join <strong>{invitation.organization.name}</strong> has
                            expired. Please contact the organization administrator for a new invitation.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button onClick={() => router.push("/organizations")}>
                            View Your Organizations
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (alreadyHandled) {
        return (
            <div className="container py-12 flex justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <Avatar className="h-16 w-16 mx-auto">
                            {invitation.organization.logo && (
                                <AvatarImage
                                    src={invitation.organization.logo}
                                    alt={invitation.organization.name}
                                />
                            )}
                            <AvatarFallback className="bg-muted text-lg">
                                {getInitials(invitation.organization.name)}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="mt-4">
                            Invitation {invitation.status === "accepted" ? "Accepted" : "Declined"}
                        </CardTitle>
                        <CardDescription>
                            You have already {invitation.status} this invitation
                            {invitation.status === "accepted" && (
                                <> to <strong>{invitation.organization.name}</strong></>
                            )}
                            .
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button onClick={() => router.push("/organizations")}>
                            View Your Organizations
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-12 flex justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Avatar className="h-16 w-16 mx-auto">
                        {invitation.organization.logo && (
                            <AvatarImage
                                src={invitation.organization.logo}
                                alt={invitation.organization.name}
                            />
                        )}
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                            {getInitials(invitation.organization.name)}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4">
                        Join {invitation.organization.name}
                    </CardTitle>
                    <CardDescription className="space-y-2">
                        <p>
                            {invitation.inviter?.name || "Someone"} has invited you to join their
                            organization.
                        </p>
                        {invitation.role && (
                            <p className="flex items-center justify-center gap-2">
                                <span>Role:</span>
                                <RoleBadge role={invitation.role as MemberRole} />
                            </p>
                        )}
                        <p className="text-xs">
                            Expires {formatRelativeTime(invitation.expiresAt)}
                        </p>
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={handleReject}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <X className="h-4 w-4 mr-2" />
                        )}
                        Decline
                    </Button>
                    <Button onClick={handleAccept} disabled={isPending}>
                        {isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Check className="h-4 w-4 mr-2" />
                        )}
                        Accept Invitation
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
