"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BanIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectItem } from "@/components/ui/select";
import { FieldGroup } from "@/components/ui/field";

import { FormSelect, FormTextarea } from "@/components/hook-form";
import { LoadingButton } from "@/components/loading-button";

import { banUser } from "@/features/admin/api";
import { BanUserFormData, banUserSchema } from "@/features/admin/schemas";
import { BAN_DURATIONS } from "@/features/admin/utils";

export function BanUserCard({
    userId,
    onSuccess,
}: {
    userId: string;
    onSuccess: () => void;
}) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<BanUserFormData>({
        resolver: zodResolver(banUserSchema),
        defaultValues: {
            banReason: "",
            banExpiresIn: undefined,
        },
    });

    const onSubmit = (data: BanUserFormData) => {
        startTransition(async () => {
            const success = await banUser(userId, data);
            if (success) {
                onSuccess();
                form.reset();
            }
        });
    };

    return (
        <Card>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <BanIcon className="size-5" />
                        Ban User
                    </CardTitle>
                    <CardDescription>
                        Restrict user access to the system
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 mb-4">
                    <FieldGroup>
                        <FormTextarea control={form.control} name="banReason" label="Ban Reason" placeholder="Reason for banning this user..." />
                        <FormSelect
                            control={form.control}
                            name="banExpiresIn"
                            label="Duration"
                            placeholder="Permanent"
                            onValueChange={(value) => {
                                if (value === "Permanent") {
                                    form.setValue("banExpiresIn", undefined);
                                } else {
                                    form.setValue("banExpiresIn", parseInt(value));
                                }
                            }}>
                            {BAN_DURATIONS.map((duration) => (
                                <SelectItem
                                    key={duration.label}
                                    value={duration.value?.toString() || "Permanent"}
                                >
                                    {duration.label}
                                </SelectItem>
                            ))}
                        </FormSelect>
                    </FieldGroup>
                </CardContent>
                <CardFooter className="border-t flex flex-col justify-end">
                    <LoadingButton
                        type="submit"
                        loading={isPending}
                        variant="destructive"
                        className="w-full"
                    >
                        Ban User
                    </LoadingButton>
                </CardFooter>
            </form>
        </Card>
    );
}