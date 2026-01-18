"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";

import { LoadingButton } from "@/components/loading-button";
import { FormInput, FormSelect } from "@/components/hook-form";

import {
    inviteMemberSchema,
    type InviteMemberFormData,
} from "@/features/organizations/schemas";
import { inviteMember } from "@/features/organizations/api";
import { getRoleLabel } from "@/features/organizations/utils";

interface InviteMemberDialogProps {
    organizationId: string;
    organizationName?: string;
    onSuccess?: () => void;
    trigger?: React.ReactNode;
}

export function InviteMemberDialog({
    organizationId,
    organizationName,
    onSuccess,
    trigger,
}: InviteMemberDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<InviteMemberFormData>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: "",
            role: "member",
        },
    });

    const onSubmit = (data: InviteMemberFormData) => {
        startTransition(async () => {
            const result = await inviteMember(organizationId, data);
            if (result) {
                setOpen(false);
                form.reset();
                onSuccess?.();
            }
        });
    };

    // Reset form when dialog closes
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            form.reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite Member
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                        Send an invitation to join{" "}
                        {organizationName ? <strong>{organizationName}</strong> : "this organization"}.
                        They will receive an email with a link to accept.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <FormInput
                            control={form.control}
                            name="email"
                            label="Email Address"
                            type="email"
                            placeholder="colleague@example.com"
                            description="The email address of the person you want to invite"
                        />
                        <FormSelect
                            control={form.control}
                            name="role"
                            label="Role"
                            description="Select the role they will have in the organization"
                        >
                            <SelectItem value="member">{getRoleLabel("member")}</SelectItem>
                            <SelectItem value="admin">{getRoleLabel("admin")}</SelectItem>
                        </FormSelect>
                    </FieldGroup>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <LoadingButton type="submit" loading={isPending}>
                            Send Invitation
                        </LoadingButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
