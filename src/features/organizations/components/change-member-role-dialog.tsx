"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";

import { LoadingButton } from "@/components/loading-button";
import { FormSelect } from "@/components/hook-form";

import {
    updateMemberRoleSchema,
    type UpdateMemberRoleFormData,
} from "@/features/organizations/schemas";
import { updateMemberRole } from "@/features/organizations/api";
import { getAssignableRoles, getRoleLabel } from "@/features/organizations/utils";
import type { MemberWithUser, MemberRole } from "@/features/organizations/types";

interface ChangeMemberRoleDialogProps {
    member: MemberWithUser;
    currentUserRole: MemberRole;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function ChangeMemberRoleDialog({
    member,
    currentUserRole,
    open,
    onOpenChange,
    onSuccess,
}: ChangeMemberRoleDialogProps) {
    const [isPending, startTransition] = useTransition();

    const assignableRoles = getAssignableRoles(currentUserRole);

    const form = useForm<UpdateMemberRoleFormData>({
        resolver: zodResolver(updateMemberRoleSchema),
        defaultValues: {
            role: member.role,
        },
    });

    const onSubmit = (data: UpdateMemberRoleFormData) => {
        if (data.role === member.role) {
            onOpenChange(false);
            return;
        }

        startTransition(async () => {
            const success = await updateMemberRole(member.id, data.role);
            if (success) {
                onOpenChange(false);
                onSuccess?.();
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Change Member Role</DialogTitle>
                    <DialogDescription>
                        Update the role for {member.user.name}. This will change their permissions
                        within the organization.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <FormSelect
                            control={form.control}
                            name="role"
                            label="New Role"
                            description="Select the new role for this member"
                        >
                            {assignableRoles.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {getRoleLabel(role)}
                                </SelectItem>
                            ))}
                        </FormSelect>
                    </FieldGroup>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <LoadingButton type="submit" loading={isPending}>
                            Update Role
                        </LoadingButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
