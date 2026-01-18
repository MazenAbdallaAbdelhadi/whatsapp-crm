"use client";

import { useTransition } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { removeMember } from "@/features/organizations/api";
import type { MemberWithUser } from "@/features/organizations/types";

interface RemoveMemberDialogProps {
    member: MemberWithUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function RemoveMemberDialog({
    member,
    open,
    onOpenChange,
    onSuccess,
}: RemoveMemberDialogProps) {
    const [isPending, startTransition] = useTransition();

    const handleRemove = () => {
        startTransition(async () => {
            const success = await removeMember(member.id);
            if (success) {
                onOpenChange(false);
                onSuccess?.();
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove Member</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to remove <strong>{member.user.name}</strong> from
                        this organization? They will lose access to all organization resources.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleRemove}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? "Removing..." : "Remove Member"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
