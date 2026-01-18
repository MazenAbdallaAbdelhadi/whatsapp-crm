"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { MembersTable, InviteMemberDialog } from "@/features/organizations/components";
import { getOrganization, getActiveMember, listOrganizationMembers } from "@/features/organizations/api";
import { canManageMembers } from "@/features/organizations/utils";
import { authClient } from "@/lib/auth/auth-client";
import type { Organization, Member, MemberWithUser, MemberRole } from "@/features/organizations/types";

function MembersLoading() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="rounded-md border p-4 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function MembersPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [member, setMember] = useState<Member | null>(null);
    const [members, setMembers] = useState<MemberWithUser[] | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        const org = await getOrganization(slug);
        if (!org) {
            router.push("/organizations");
            return;
        }
        setOrganization(org);

        // Get current session
        const session = await authClient.getSession();
        setCurrentUserId(session?.data?.user?.id || "");

        const [memberData, membersData] = await Promise.all([
            getActiveMember(org.id),
            listOrganizationMembers(org.id),
        ]);

        setMember(memberData);
        setMembers(membersData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [slug]);

    const handleMemberUpdated = () => {
        // Refetch members after update
        if (organization) {
            listOrganizationMembers(organization.id).then((data) => {
                setMembers(data);
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
                <MembersLoading />
            </div>
        );
    }

    const currentUserRole = (member?.role || "member") as MemberRole;
    const canManage = canManageMembers(currentUserRole);

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
                        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
                        <p className="text-muted-foreground">
                            {canManage
                                ? "Manage team members and their roles"
                                : "View team members in this organization"}
                        </p>
                    </div>
                    {canManage && (
                        <InviteMemberDialog
                            organizationId={organization.id}
                            organizationName={organization.name}
                            onSuccess={handleMemberUpdated}
                        />
                    )}
                </div>

                <MembersTable
                    members={members || []}
                    currentUserId={currentUserId}
                    currentUserRole={currentUserRole}
                    onMemberUpdated={handleMemberUpdated}
                />
            </div>
        </div>
    );
}
