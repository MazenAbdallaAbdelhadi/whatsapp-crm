"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { OrganizationSettingsForm } from "@/features/organizations/components";
import { getOrganization, getActiveMember } from "@/features/organizations/api";
import { canManageOrganization } from "@/features/organizations/utils";
import type { Organization, Member, MemberRole } from "@/features/organizations/types";

function SettingsLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-56" />
            </div>
            <div className="rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-32 ml-auto" />
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [member, setMember] = useState<Member | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
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
            if (!canManageOrganization(currentUserRole)) {
                router.push(`/organizations/${slug}`);
                return;
            }

            setIsLoading(false);
        }
        fetchData();
    }, [slug, router]);

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
                <SettingsLoading />
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
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your organization settings and preferences
                    </p>
                </div>

                <OrganizationSettingsForm
                    organization={organization}
                    currentUserRole={currentUserRole}
                />
            </div>
        </div>
    );
}
