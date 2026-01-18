"use client";

import React, { useTransition, useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { LoadingButton } from "@/components/loading-button";
import { FormInput } from "@/components/hook-form";

import {
    updateOrganizationSchema,
    type UpdateOrganizationFormData,
} from "@/features/organizations/schemas";
import {
    updateOrganization,
    checkSlugAvailability,
} from "@/features/organizations/api";
import { generateSlug, canDeleteOrganization } from "@/features/organizations/utils";
import type { Organization, MemberRole } from "@/features/organizations/types";
import { DeleteOrganizationDialog } from "./delete-organization-dialog";

interface OrganizationSettingsFormProps {
    organization: Organization;
    currentUserRole: MemberRole;
    onUpdate?: () => void;
}

export function OrganizationSettingsForm({
    organization,
    currentUserRole,
    onUpdate,
}: OrganizationSettingsFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
    const [checkingSlug, setCheckingSlug] = useState(false);
    const checkSlugTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const canDelete = canDeleteOrganization(currentUserRole);

    const form = useForm<UpdateOrganizationFormData>({
        resolver: zodResolver(updateOrganizationSchema),
        defaultValues: {
            name: organization.name,
            slug: organization.slug,
            logo: organization.logo || "",
        },
    });

    const slugValue = form.watch("slug");
    const originalSlug = organization.slug;

    // Debounced slug availability check using native timeout
    const checkSlug = useCallback(async (slug: string) => {
        // Don't check if it's the same as current slug
        if (slug === originalSlug) {
            setSlugAvailable(null);
            return;
        }

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
    }, [originalSlug, form]);

    // Check slug availability when it changes (debounced)
    useEffect(() => {
        if (slugValue && slugValue !== originalSlug) {
            // Clear previous timeout
            if (checkSlugTimeoutRef.current) {
                clearTimeout(checkSlugTimeoutRef.current);
            }
            // Set new timeout for debounce
            checkSlugTimeoutRef.current = setTimeout(() => {
                checkSlug(slugValue);
            }, 500);
        } else {
            setSlugAvailable(null);
        }

        return () => {
            if (checkSlugTimeoutRef.current) {
                clearTimeout(checkSlugTimeoutRef.current);
            }
        };
    }, [slugValue, originalSlug, checkSlug]);

    const onSubmit = (data: UpdateOrganizationFormData) => {
        startTransition(async () => {
            const result = await updateOrganization(organization.id, data);
            if (result) {
                // If slug changed, redirect to new URL
                if (data.slug && data.slug !== originalSlug) {
                    router.push(`/organizations/${data.slug}/settings`);
                }
                router.refresh();
                onUpdate?.();
            }
        });
    };

    // Get slug field description based on availability status
    const getSlugDescription = () => {
        if (slugValue === originalSlug) return "Used in the organization URL";
        if (checkingSlug) return "Checking availability...";
        if (slugAvailable === true) return "✓ This slug is available";
        if (slugAvailable === false) return "✗ This slug is already taken";
        return "Used in the organization URL";
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Organization Details</CardTitle>
                    <CardDescription>
                        Update your organization's basic information
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                            />
                            <FormInput
                                control={form.control}
                                name="logo"
                                label="Logo URL"
                                placeholder="https://example.com/logo.png"
                                description="Optional: A URL to your organization logo"
                            />
                        </FieldGroup>

                        <div className="mt-6 flex justify-end">
                            <LoadingButton
                                type="submit"
                                loading={isPending}
                                disabled={slugAvailable === false || checkingSlug}
                            >
                                Save Changes
                            </LoadingButton>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {canDelete && (
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>
                            Irreversible actions that affect your organization
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Delete Organization</p>
                                <p className="text-sm text-muted-foreground">
                                    Permanently delete this organization and all its data
                                </p>
                            </div>
                            <DeleteOrganizationDialog
                                organization={organization}
                                onSuccess={() => router.push("/organizations")}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
