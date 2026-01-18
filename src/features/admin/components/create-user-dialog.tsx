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
    DialogTrigger,
} from "@/components/ui/dialog";
import { SelectItem } from "@/components/ui/select";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { LoadingButton } from "@/components/loading-button";
import { FormInput, FormPassword, FormSelect } from "@/components/hook-form";

import { createUserSchema, type CreateUserFormData } from "@/features/admin/schemas";
import { createUser } from "@/features/admin/api";

interface CreateUserDialogProps {
    onSuccess?: () => void;
    trigger?: React.ReactNode;
}

export function CreateUserDialog({
    onSuccess,
    trigger,
}: CreateUserDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            role: "user",
        },
    });

    const onSubmit = (data: CreateUserFormData) => {
        startTransition(async () => {
            const result = await createUser(data);
            if (result) {
                setOpen(false);
                form.reset();
                onSuccess?.();
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Create User</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                        Add a new user to the system. They will receive login credentials.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <FormInput control={form.control} name="name" label="Name" placeholder="Name" />
                        <FormInput control={form.control} name="email" type="email" label="Email" placeholder="john@example.com" />
                        <FormPassword control={form.control} name="password" label="Password" placeholder="••••••••" />
                        <FormSelect control={form.control} name="role" label="Role" description="Select the user's role">
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
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
                            Create User
                        </LoadingButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
