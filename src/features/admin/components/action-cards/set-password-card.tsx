"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

import { FormPassword } from "@/components/hook-form";
import { LoadingButton } from "@/components/loading-button";

import { setUserPassword } from "@/features/admin/api";
import { SetPasswordFormData, setPasswordSchema } from "@/features/admin/schemas";

export function SetPasswordCard({ userId }: { userId: string }) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<SetPasswordFormData>({
        resolver: zodResolver(setPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: SetPasswordFormData) => {
        startTransition(async () => {
            const success = await setUserPassword(userId, data.newPassword);
            if (success) {
                form.reset();
            }
        });
    };

    return (
        <Card>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyIcon className="size-5" />
                        Set Password
                    </CardTitle>
                    <CardDescription>Reset user&apos;s password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 mb-11">
                    <FieldGroup>
                        <FormPassword control={form.control} name="newPassword" label="New Password" placeholder="New Password" />
                        <FormPassword control={form.control} name="confirmPassword" label="Confirm Password" placeholder="Confirm Password" />
                    </FieldGroup>
                </CardContent>
                <CardFooter className="border-t">
                    <LoadingButton type="submit" loading={isPending} className="w-full">
                        Set New Password
                    </LoadingButton>
                </CardFooter>
            </form>
        </Card>
    );
}