"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { deleteOrganization } from "@/features/organizations/api";
import type { Organization } from "@/features/organizations/types";

interface DeleteOrganizationDialogProps {
    organization: Organization;
    onSuccess?: () => void;
    trigger?: React.ReactNode;
}

export function DeleteOrganizationDialog({
    organization,
    onSuccess,
    trigger,
}: DeleteOrganizationDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [confirmText, setConfirmText] = useState("");

    const isConfirmed = confirmText === organization.name;

    const handleDelete = () => {
        if (!isConfirmed) return;

        startTransition(async () => {
            const success = await deleteOrganization(organization.id);
            if (success) {
                setOpen(false);
                onSuccess?.();
            }
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setConfirmText("");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                {trigger || (
                    <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Organization
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                        <p>
                            This action cannot be undone. This will permanently delete{" "}
                            <strong>{organization.name}</strong> and remove all members,
                            invitations, and associated data.
                        </p>
                        <div className="mt-4">
                            <Label htmlFor="confirm-delete" className="text-foreground">
                                Type <strong>{organization.name}</strong> to confirm:
                            </Label>
                            <Input
                                id="confirm-delete"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder={organization.name}
                                className="mt-2"
                                autoComplete="off"
                            />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={!isConfirmed || isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? "Deleting..." : "Delete Organization"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
