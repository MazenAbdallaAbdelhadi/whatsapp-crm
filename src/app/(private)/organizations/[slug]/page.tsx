"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Settings, Users, Mail, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { RoleBadge } from "@/features/organizations/components";
import { getOrganization, getActiveMember, listOrganizationMembers } from "@/features/organizations/api";
import {
    getInitials,
    formatDate,
    getOrganizationMembersUrl,
    getOrganizationSettingsUrl,
    getOrganizationInvitationsUrl,
    canManageMembers,
} from "@/features/organizations/utils";
import type { Organization, Member, MemberWithUser, MemberRole } from "@/features/organizations/types";

function OrganizationLoading() {
    return (
        <div className="space-y-6">
            <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
            </div>
        </div>
    );
}

export default function OrganizationPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [member, setMember] = useState<Member | null>(null);
    const [members, setMembers] = useState<MemberWithUser[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const org = await getOrganization(slug);
            if (!org) {
                router.push("/organizations");
                return;
            }
            setOrganization(org);

            const [memberData, membersData] = await Promise.all([
                getActiveMember(org.id),
                listOrganizationMembers(org.id),
            ]);

            setMember(memberData);
            setMembers(membersData);
            setIsLoading(false);
        }
        fetchData();
    }, [slug, router]);

    if (isLoading || !organization) {
        return (
            <div className="container py-6 space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/organizations">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            All Organizations
                        </Link>
                    </Button>
                </div>
                <OrganizationLoading />
            </div>
        );
    }

    const currentUserRole = (member?.role || "member") as MemberRole;
    const canManage = canManageMembers(currentUserRole);
    const memberCount = members?.length || 0;

    return (
        <div className="container py-6 space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/organizations">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        All Organizations
                    </Link>
                </Button>
            </div>

            <div className="space-y-6">
                {/* Organization Header */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Avatar className="h-16 w-16">
                        {organization.logo && (
                            <AvatarImage src={organization.logo} alt={organization.name} />
                        )}
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                            {getInitials(organization.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{organization.name}</h1>
                            <RoleBadge role={currentUserRole} />
                        </div>
                        <p className="text-muted-foreground mt-1">/{organization.slug}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Created {formatDate(organization.createdAt)} • {memberCount} {memberCount === 1 ? "member" : "members"}
                        </p>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Members Card */}
                    <Link href={getOrganizationMembersUrl(slug)}>
                        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg">Members</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{memberCount}</p>
                                <CardDescription>
                                    {canManage ? "Manage team members and roles" : "View team members"}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Settings Card */}
                    {canManage && (
                        <Link href={getOrganizationSettingsUrl(slug)}>
                            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2">
                                        <Settings className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Settings</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        Update organization details and preferences
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {/* Invitations Card */}
                    {canManage && (
                        <Link href={getOrganizationInvitationsUrl(slug)}>
                            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Invitations</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        View and manage sent invitations
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
