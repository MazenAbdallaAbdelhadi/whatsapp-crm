"use client";
import { UserCogIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { ActionButton } from "@/components/action-button";

import { impersonateUser } from "@/features/admin/api";

export function ImpersonateCard({
    userId,
    userName,
}: {
    userId: string;
    userName: string;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserCogIcon className="h-5 w-5" />
                    Impersonate User
                </CardTitle>
                <CardDescription>
                    View the application as this user
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    This will create a session as this user. You can stop impersonation at
                    any time to return to your admin account.
                </p>
            </CardContent>
            <CardFooter>
                <ActionButton
                    className="w-full"
                    title="Impersonate User?"
                    description={`You will be logged in as ${userName}. This action is logged for security purposes.`}
                    confirmText="Start Impersonation"
                    onAction={async () => {
                        await impersonateUser(userId);
                    }}
                >
                    Impersonate User
                </ActionButton>
            </CardFooter>
        </Card>
    );
}