"use client";

import { useState } from "react";
import { ShieldIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";

import { ActionButton } from "@/components/action-button";

import { AdminUser } from "@/features/admin/types";
import { setUserRole } from "@/features/admin/api";


export function ChangeRoleCard({
    user,
    onSuccess,
}: {
    user: AdminUser;
    onSuccess: () => void;
}) {
    const [selectedRole, setSelectedRole] = useState(user.role || "user");

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldIcon className="h-5 w-5" />
                    Change Role
                </CardTitle>
                <CardDescription>Manage user's access level</CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Role</FieldLabel>
                        <FieldContent>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="moderator">Moderator</SelectItem>
                                </SelectContent>
                            </Select>
                        </FieldContent>
                    </Field>
                </FieldGroup>
            </CardContent>
            <CardFooter>
                <ActionButton
                    className="w-full"
                    title="Change User Role?"
                    description={`This will change ${user.name}'s role to "${selectedRole}".`}
                    confirmText="Change Role"
                    onAction={async () => {
                        const success = await setUserRole(user.id, selectedRole);
                        if (success) onSuccess();
                    }}
                    disabled={selectedRole === user.role}
                >
                    Update Role
                </ActionButton>
            </CardFooter>
        </Card>
    );
}