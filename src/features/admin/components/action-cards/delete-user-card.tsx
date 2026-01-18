"use client";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { ActionButton } from "@/components/action-button";

import { removeUser } from "@/features/admin/api";


export
    function DeleteUserCard({
        userId,
        userName,
    }: {
        userId: string;
        userName: string;
    }) {
    const router = useRouter();

    return (
        <Card className="bg-destructive/5 border-destructive/10 shadow-none">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <Trash2Icon className="h-5 w-5" />
                    Delete User
                </CardTitle>
                <CardDescription>Permanently remove this user</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    This action cannot be undone. This will permanently delete the user and
                    all associated data.
                </p>
            </CardContent>
            <CardFooter>
                <ActionButton
                    className="w-full"
                    variant="destructive"
                    title="Delete User Permanently?"
                    description={
                        <div className="space-y-2">
                            <p>
                                You are about to permanently delete <strong>{userName}</strong>.
                            </p>
                            <p className="text-sm">
                                This will remove all their data and cannot be undone.
                            </p>
                        </div>
                    }
                    confirmText="Delete User"
                    onAction={async () => {
                        const success = await removeUser(userId);
                        if (success) {
                            router.push("/admin/users");
                        }
                    }}
                >
                    Delete User
                </ActionButton>
            </CardFooter>
        </Card>
    );
}