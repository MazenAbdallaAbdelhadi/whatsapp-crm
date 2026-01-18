"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { SentInvitationsList, InviteMemberDialog } from "@/features/organizations/components";
import { getOrganization, getActiveMember, listOrganizationInvitations } from "@/features/organizations/api";
import { canManageMembers } from "@/features/organizations/utils";
import type { Organization, Member, Invitation, MemberRole } from "@/features/organizations/types";

function InvitationsLoading() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-8 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function InvitationsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [member, setMember] = useState<Member | null>(null);
    const [invitations, setInvitations] = useState<Invitation[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        const org = await getOrganization(slug);
        if (!org) {
            router.push("/organizations");
            return;
        }
        setOrganization(org);

        const memberData = await getActiveMember(org.id);
        setMember(memberData);

        const currentUserRole = (memberData?.role || "member") as MemberRole;

        // Redirect if user doesn't have permission
        if (!canManageMembers(currentUserRole)) {
            router.push(`/organizations/${slug}`);
            return;
        }

        const invitationsData = await listOrganizationInvitations(org.id);
        setInvitations(invitationsData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [slug]);

    const handleInvitationUpdated = () => {
        // Refetch invitations after update
        if (organization) {
            listOrganizationInvitations(organization.id).then((data) => {
                setInvitations(data);
            });
        }
    };

    if (isLoading || !organization) {
        return (
            <div className="container py-6 space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/organizations/${slug}`}>
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back
                        </Link>
                    </Button>
                </div>
                <InvitationsLoading />
            </div>
        );
    }

    const currentUserRole = (member?.role || "member") as MemberRole;

    return (
        <div className="container py-6 space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/organizations/${slug}`}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                    </Link>
                </Button>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Invitations</h1>
                        <p className="text-muted-foreground">
                            View and manage pending invitations
                        </p>
                    </div>
                    <InviteMemberDialog
                        organizationId={organization.id}
                        organizationName={organization.name}
                        onSuccess={handleInvitationUpdated}
                    />
                </div>

                <SentInvitationsList
                    invitations={invitations || []}
                    onInvitationUpdated={handleInvitationUpdated}
                />
            </div>
        </div>
    );
}
