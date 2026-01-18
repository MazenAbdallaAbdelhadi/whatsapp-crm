"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCogIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { FormInput } from "@/components/hook-form";
import { LoadingButton } from "@/components/loading-button";

import { AdminUser } from "@/features/admin/types";
import { updateUser } from "@/features/admin/api";
import { UpdateUserFormData, updateUserSchema } from "@/features/admin/schemas";

export function EditProfileCard({
    user,
    onSuccess,
}: {
    user: AdminUser;
    onSuccess: () => void;
}) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
        },
    });

    const onSubmit = (data: UpdateUserFormData) => {
        startTransition(async () => {
            const result = await updateUser(user.id, data);
            if (result) {
                onSuccess();
            }
        });
    };

    return (
        <Card>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserCogIcon className="h-5 w-5" />
                        Edit Profile
                    </CardTitle>
                    <CardDescription>Update user's basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 mb-4">
                    <FormInput control={form.control} name="name" label="Name" placeholder="Name" />
                    <FormInput control={form.control} name="email" label="Email" placeholder="Email" />
                </CardContent>
                <CardFooter className="border-t">
                    <LoadingButton type="submit" loading={isPending} className="w-full">
                        Save Changes
                    </LoadingButton>
                </CardFooter>
            </form>
        </Card>
    );
}
