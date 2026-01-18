"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Ban,
    RefreshCw,
    Monitor,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/action-button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import type {
    AdminUser,
    AdminSession,
} from "@/features/admin/types";
import {
    listUsers,
    listUserSessions,
    revokeSession,
    revokeAllUserSessions,
} from "@/features/admin/api";
import {
    getInitials,
    formatRelativeTime,
    parseUserAgent,
} from "@/features/admin/utils";

import { ChangeRoleCard, EditProfileCard, ImpersonateCard, SetPasswordCard, BanUserCard, UnbanUserCard, DeleteUserCard, UserInfoCard } from "@/features/admin/components";
import { useBreadcrumbLabel } from "@/components/app-breadcrumb";

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    const [user, setUser] = useState<AdminUser | null>(null);
    const [sessions, setSessions] = useState<AdminSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);

    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        const result = await listUsers({ filterField: "id", filterValue: userId, filterOperator: "eq" });

        if (result && result.users.length > 0) {
            setUser(result.users[0]);
        } else {
            router.push("/admin/users");
        }
        setIsLoading(false);
    }, [userId, router]);

    // Fetch user data
    useEffect(() => {
        fetchUser();
    }, [userId]);

    // Fetch sessions
    const fetchSessions = useCallback(async () => {
        setIsLoadingSessions(true);
        const result = await listUserSessions(userId);
        if (result) {
            setSessions(result);
        }
        setIsLoadingSessions(false);
    }, [userId]);

    useEffect(() => {
        if (user) {
            fetchSessions();
        }
    }, [user]);

    const refetchUser = useCallback(async () => {
        const result = await listUsers({ filterField: "id", filterValue: userId, filterOperator: "eq" });
        if (result && result.users.length > 0) {
            setUser(result.users[0]);
        }
    }, [userId]);

    // Set breadcrumb label to user name instead of ID
    useBreadcrumbLabel(userId, user?.name || userId);

    if (isLoading || !user) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/admin/users")}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-12 w-12">
                        <AvatarImage
                            src={user.image || ""}
                            alt={user.name}
                            className="h-full w-full object-cover"
                        />
                        <AvatarFallback>
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            {user.name}
                            {user.banned && (
                                <Badge variant="destructive" className="gap-1">
                                    <Ban className="h-3 w-3" />
                                    Banned
                                </Badge>
                            )}
                        </h1>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* User Info Card */}
            <UserInfoCard user={user} />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Edit Profile Card */}
                <EditProfileCard user={user} onSuccess={refetchUser} />

                {/* Change Role Card */}
                <ChangeRoleCard user={user} onSuccess={refetchUser} />

                {/* Set Password Card */}
                <SetPasswordCard userId={user.id} />

                {/* Ban/Unban Card */}
                {user.banned ? (
                    <UnbanUserCard userId={user.id} onSuccess={refetchUser} />
                ) : (
                    <BanUserCard userId={user.id} onSuccess={refetchUser} />
                )}

                {/* Impersonate Card */}
                <ImpersonateCard userId={user.id} userName={user.name} />

                {/* Delete User Card */}
                <DeleteUserCard userId={user.id} userName={user.name} />
            </div>

            {/* Sessions Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Active Sessions</CardTitle>
                            <CardDescription>
                                Manage this user's active sessions
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchSessions}
                                disabled={isLoadingSessions}
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoadingSessions ? "animate-spin" : ""}`} />
                            </Button>
                            {sessions.length > 0 && (
                                <ActionButton
                                    variant="destructive"
                                    size="sm"
                                    title="Revoke All Sessions?"
                                    description={`This will log out the user from all ${sessions.length} active ${sessions.length === 1 ? "session" : "sessions"}.`}
                                    confirmText="Revoke All"
                                    onAction={async () => {
                                        const success = await revokeAllUserSessions(user.id);
                                        if (success) fetchSessions();
                                    }}
                                >
                                    Revoke All
                                </ActionButton>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoadingSessions ? (
                        <div className="space-y-3">
                            {[...Array(2)].map((_, i) => (
                                <Skeleton key={i} className="h-16" />
                            ))}
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No active sessions
                        </div>
                    ) : (
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Device</TableHead>
                                        <TableHead>Last Active</TableHead>
                                        <TableHead>IP Address</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sessions.map((session) => {
                                        const deviceInfo = parseUserAgent(session.userAgent);
                                        return (
                                            <TableRow key={session.id}>
                                                <TableCell>
                                                    <div className="flex items-start gap-2">
                                                        <Monitor className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {deviceInfo.device}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {deviceInfo.browser}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatRelativeTime(session.updatedAt)}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {session.ipAddress || "Unknown"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <ActionButton
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Revoke Session?"
                                                        description="This will log out the user from this device."
                                                        confirmText="Revoke"
                                                        onAction={async () => {
                                                            const success = await revokeSession(session.token);
                                                            if (success) fetchSessions();
                                                        }}
                                                    >
                                                        Revoke
                                                    </ActionButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

