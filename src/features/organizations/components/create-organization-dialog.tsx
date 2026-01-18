"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

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

import { LoadingButton } from "@/components/loading-button";
import { FormInput } from "@/components/hook-form";

import {
    createOrganizationSchema,
    type CreateOrganizationFormData,
} from "@/features/organizations/schemas";
import { createOrganization, checkSlugAvailability } from "@/features/organizations/api";
import { generateSlug, getOrganizationUrl } from "@/features/organizations/utils";

interface CreateOrganizationDialogProps {
    onSuccess?: () => void;
    trigger?: React.ReactNode;
}

export function CreateOrganizationDialog({
    onSuccess,
    trigger,
}: CreateOrganizationDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [slugTouched, setSlugTouched] = useState(false);
    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
    const [checkingSlug, setCheckingSlug] = useState(false);

    const form = useForm<CreateOrganizationFormData>({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues: {
            name: "",
            slug: "",
            logo: "",
        },
    });

    const nameValue = form.watch("name");
    const slugValue = form.watch("slug");

    // Auto-generate slug from name when name changes and slug hasn't been manually edited
    useEffect(() => {
        if (nameValue && !slugTouched) {
            const generatedSlug = generateSlug(nameValue);
            form.setValue("slug", generatedSlug, { shouldValidate: true });
        }
    }, [nameValue, slugTouched, form]);

    // Mark slug as touched when user manually edits it
    const handleSlugChange = useCallback(() => {
        setSlugTouched(true);
    }, []);

    // Debounced slug availability check
    const checkSlug = useDebouncedCallback(async (slug: string) => {
        if (!slug || slug.length < 2) {
            setSlugAvailable(null);
            return;
        }

        setCheckingSlug(true);
        const available = await checkSlugAvailability(slug);
        setSlugAvailable(available);
        setCheckingSlug(false);

        if (available === false) {
            form.setError("slug", { message: "This slug is already taken" });
        } else if (available === true) {
            form.clearErrors("slug");
        }
    }, 500);

    // Check slug availability when it changes
    useEffect(() => {
        if (slugValue) {
            checkSlug(slugValue);
        } else {
            setSlugAvailable(null);
        }
    }, [slugValue, checkSlug]);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            form.reset();
            setSlugTouched(false);
            setSlugAvailable(null);
        }
    }, [open, form]);

    const onSubmit = (data: CreateOrganizationFormData) => {
        startTransition(async () => {
            const result = await createOrganization(data);
            if (result) {
                setOpen(false);
                form.reset();
                onSuccess?.();
                router.push(getOrganizationUrl(result.slug));
                router.refresh();
            }
        });
    };

    // Get slug field description based on availability status
    const getSlugDescription = () => {
        if (checkingSlug) return "Checking availability...";
        if (slugAvailable === true) return "✓ This slug is available";
        if (slugAvailable === false) return "✗ This slug is already taken";
        return "Used in the organization URL";
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Organization
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Organization</DialogTitle>
                    <DialogDescription>
                        Create a new organization to collaborate with your team.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <FormInput
                            control={form.control}
                            name="name"
                            label="Organization Name"
                            placeholder="My Organization"
                            description="The display name for your organization"
                        />
                        <FormInput
                            control={form.control}
                            name="slug"
                            label="URL Slug"
                            placeholder="my-organization"
                            description={getSlugDescription()}
                            onChangeCapture={handleSlugChange}
                        />
                        <FormInput
                            control={form.control}
                            name="logo"
                            label="Logo URL"
                            placeholder="https://example.com/logo.png"
                            description="Optional: A URL to your organization logo"
                        />
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
                        <LoadingButton
                            type="submit"
                            loading={isPending}
                            disabled={slugAvailable === false || checkingSlug}
                        >
                            Create Organization
                        </LoadingButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
