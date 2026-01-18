"use client";
import { CheckCircleIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { ActionButton } from "@/components/action-button";

import { unbanUser } from "@/features/admin/api";


export function UnbanUserCard({
    userId,
    onSuccess,
}: {
    userId: string;
    onSuccess: () => void;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    Unban User
                </CardTitle>
                <CardDescription>Restore user's access to the system</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    This will immediately restore this user's access and allow them to log
                    in again.
                </p>
            </CardContent>
            <CardFooter>
                <ActionButton
                    className="w-full"
                    title="Unban User?"
                    description="This will restore the user's access to the system."
                    confirmText="Unban User"
                    onAction={async () => {
                        const success = await unbanUser(userId);
                        if (success) onSuccess();
                    }}
                >
                    Unban User
                </ActionButton>
            </CardFooter>
        </Card>
    );
}