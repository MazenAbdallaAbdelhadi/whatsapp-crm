"use client";


import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";

import type {
    Organization,
    Member,
    MemberWithUser,
    Invitation,
    InvitationWithOrganization,
    FullInvitation,
    UserOrganization,
    MemberRole,
} from "@/features/organizations/types";

import type {
    CreateOrganizationFormData,
    UpdateOrganizationFormData,
    InviteMemberFormData,
} from "@/features/organizations/schemas";

// ============================================================================
// ORGANIZATION MANAGEMENT
// ============================================================================

/**
 * List all organizations the current user is a member of
 */
export async function listUserOrganizations(): Promise<UserOrganization[] | null> {
    try {
        const { data, error } = await authClient.organization.list();

        if (error) {
            toast.error("Failed to fetch organizations", {
                description: error.message || "An error occurred",
            });
            return null;
        }

        // Transform the response to include the user's role
        return (data as UserOrganization[]) || [];
    } catch (error) {
        console.error("List organizations error:", error);
        toast.error("Failed to fetch organizations", {
            description: "An unexpected error occurred",
        });
        return null;
    }
}

/**
 * Get a single organization by slug
 */
export async function getOrganization(slug: string): Promise<Organization | null> {
    try {
        const { data, error } = await authClient.organization.getFullOrganization({
            query: { organizationSlug: slug },
        });

        if (error) {
            // Don't show toast for 404s - let the caller handle it
            if (error.status !== 404) {
                toast.error("Failed to fetch organization", {
                    description: error.message || "An error occurred",
                });
            }
            return null;
        }

        return data as Organization;
    } catch (error) {
        console.error("Get organization error:", error);
        return null;
    }
}

/**
 * Create a new organization
 */
export async function createOrganization(
    formData: CreateOrganizationFormData
): Promise<Organization | null> {
    try {
        const { data, error } = await authClient.organization.create({
            name: formData.name,
            slug: formData.slug,
            logo: formData.logo || undefined,
        });

        if (error) {
            toast.error("Failed to create organization", {
                description: error.message || "An error occurred",
            });
            return null;
        }

        toast.success("Organization created", {
            description: `${formData.name} has been created successfully`,
        });

        return data as Organization;
    } catch (error) {
        console.error("Create organization error:", error);
        toast.error("Failed to create organization", {
            description: "An unexpected error occurred",
        });
        return null;
    }
}

/**
 * Update an organization's details
 */
export async function updateOrganization(
    organizationId: string,
    formData: UpdateOrganizationFormData
): Promise<Organization | null> {
    try {
        const updateData: Record<string, string | undefined> = {};
        if (formData.name) updateData.name = formData.name;
        if (formData.slug) updateData.slug = formData.slug;
        if (formData.logo !== undefined) updateData.logo = formData.logo || undefined;

        const { data, error } = await authClient.organization.update({
            organizationId,
            data: updateData,
        });

        if (error) {
            toast.error("Failed to update organization", {
                description: error.message || "An error occurred",
            });
            return null;
        }

        toast.success("Organization updated", {
            description: "Changes have been saved successfully",
        });

        return data as Organization;
    } catch (error) {
        console.error("Update organization error:", error);
        toast.error("Failed to update organization", {
            description: "An unexpected error occurred",
        });
        return null;
    }
}

/**
 * Delete an organization (owner only)
 */
export async function deleteOrganization(organizationId: string): Promise<boolean> {
    try {
        const { error } = await authClient.organization.delete({
            organizationId,
        });

        if (error) {
            toast.error("Failed to delete organization", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("Organization deleted", {
            description: "The organization has been permanently deleted",
        });

        return true;
    } catch (error) {
        console.error("Delete organization error:", error);
        toast.error("Failed to delete organization", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

/**
 * Set the active organization for the current session
 */
export async function setActiveOrganization(
    organizationId: string
): Promise<boolean> {
    try {
        const { error } = await authClient.organization.setActive({
            organizationId,
        });

        if (error) {
            toast.error("Failed to switch organization", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        return true;
    } catch (error) {
        console.error("Set active organization error:", error);
        toast.error("Failed to switch organization", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

/**
 * Get the current active organization
 */
export async function getActiveOrganization(): Promise<Organization | null> {
    try {
        const session = await authClient.getSession();
        if (!session?.data?.session?.activeOrganizationId) {
            return null;
        }

        return getOrganization(session.data.session.activeOrganizationId);
    } catch (error) {
        console.error("Get active organization error:", error);
        return null;
    }
}

/**
 * Check if a slug is available
 */
export async function checkSlugAvailability(slug: string): Promise<boolean | null> {
    try {
        const { data, error } = await authClient.organization.checkSlug({ slug });

        if (error) {
            return null;
        }

        return (data as { status: boolean })?.status ?? false;
    } catch (error) {
        console.error("Check slug error:", error);
        return null;
    }
}

// ============================================================================
// MEMBER MANAGEMENT
// ============================================================================

/**
 * List all members of an organization
 */
export async function listOrganizationMembers(organizationId: string): Promise<MemberWithUser[] | null> {
    try {
        const { data, error } = await authClient.organization.listMembers({
            query: { organizationId },
        });

        if (error) {
            toast.error("Failed to fetch members", {
                description: error.message || "An error occurred",
            });
            return null;
        }

        return (data as { members: MemberWithUser[] })?.members || [];
    } catch (error) {
        console.error("List members error:", error);
        toast.error("Failed to fetch members", {
            description: "An unexpected error occurred",
        });
        return null;
    }
}

/**
 * Update a member's role
 */
export async function updateMemberRole(
    memberId: string,
    role: MemberRole
): Promise<boolean> {
    try {
        const { error } = await authClient.organization.updateMemberRole({
            memberId,
            role,
        });

        if (error) {
            toast.error("Failed to update member role", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("Member role updated", {
            description: `Role has been changed to ${role}`,
        });

        return true;
    } catch (error) {
        console.error("Update member role error:", error);
        toast.error("Failed to update member role", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

/**
 * Remove a member from an organization
 */
export async function removeMember(memberId: string): Promise<boolean> {
    try {
        const { error } = await authClient.organization.removeMember({
            memberIdOrEmail: memberId,
        });

        if (error) {
            toast.error("Failed to remove member", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("Member removed", {
            description: "The member has been removed from the organization",
        });

        return true;
    } catch (error) {
        console.error("Remove member error:", error);
        toast.error("Failed to remove member", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

/**
 * Leave an organization (for the current user)
 */
export async function leaveOrganization(organizationId: string): Promise<boolean> {
    try {
        const { error } = await authClient.organization.leave({
            organizationId,
        });

        if (error) {
            toast.error("Failed to leave organization", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("Left organization", {
            description: "You have left the organization",
        });

        return true;
    } catch (error) {
        console.error("Leave organization error:", error);
        toast.error("Failed to leave organization", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

/**
 * Get the current user's member info for an organization
 */
export async function getActiveMember(organizationId: string): Promise<Member | null> {
    try {
        const { data, error } = await authClient.organization.getActiveMember({
            query: { organizationId },
        });

        if (error) {
            return null;
        }

        return data as Member;
    } catch (error) {
        console.error("Get active member error:", error);
        return null;
    }
}

// ============================================================================
// INVITATION MANAGEMENT
// ============================================================================

/**
 * Send an invitation to join an organization
 */
export async function inviteMember(
    organizationId: string,
    formData: InviteMemberFormData
): Promise<Invitation | null> {
    try {
        const { data, error } = await authClient.organization.inviteMember({
            organizationId,
            email: formData.email,
            role: formData.role,
        });

        if (error) {
            toast.error("Failed to send invitation", {
                description: error.message || "An error occurred",
            });
            return null;
        }

        toast.success("Invitation sent", {
            description: `An invitation has been sent to ${formData.email}`,
        });

        return data as Invitation;
    } catch (error) {
        console.error("Invite member error:", error);
        toast.error("Failed to send invitation", {
            description: "An unexpected error occurred",
        });
        return null;
    }
}

/**
 * List all invitations sent by an organization
 */
export async function listOrganizationInvitations(organizationId: string): Promise<Invitation[] | null> {
    try {
        const { data, error } = await authClient.organization.listInvitations({
            query: { organizationId },
        });

        if (error) {
            toast.error("Failed to fetch invitations", {
                description: error.message || "An error occurred",
            });
            return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = data as any;
        return (Array.isArray(result) ? result : result?.invitations) || [];
    } catch (error) {
        console.error("List invitations error:", error);
        toast.error("Failed to fetch invitations", {
            description: "An unexpected error occurred",
        });
        return null;
    }
}

/**
 * List all pending invitations for the current user
 */
export async function listUserInvitations(): Promise<FullInvitation[] | null> {
    try {
        const { data, error } = await authClient.organization.listUserInvitations();

        if (error) {
            toast.error("Failed to fetch invitations", {
                description: error.message || "An error occurred",
            });
            return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (data as any) || [];
    } catch (error) {
        console.error("List user invitations error:", error);
        toast.error("Failed to fetch invitations", {
            description: "An unexpected error occurred",
        });
        return null;
    }
}

/**
 * Get a specific invitation by ID
 */
export async function getInvitation(invitationId: string): Promise<FullInvitation | null> {
    try {
        const { data, error } = await authClient.organization.getInvitation({
            query: { id: invitationId },
        });

        if (error) {
            return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data as any;
    } catch (error) {
        console.error("Get invitation error:", error);
        return null;
    }
}

/**
 * Accept an invitation to join an organization
 */
export async function acceptInvitation(invitationId: string): Promise<boolean> {
    try {
        const { error } = await authClient.organization.acceptInvitation({
            invitationId,
        });

        if (error) {
            toast.error("Failed to accept invitation", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("Invitation accepted", {
            description: "You have joined the organization",
        });

        return true;
    } catch (error) {
        console.error("Accept invitation error:", error);
        toast.error("Failed to accept invitation", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

/**
 * Reject an invitation
 */
export async function rejectInvitation(invitationId: string): Promise<boolean> {
    try {
        const { error } = await authClient.organization.rejectInvitation({
            invitationId,
        });

        if (error) {
            toast.error("Failed to decline invitation", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("Invitation declined", {
            description: "The invitation has been declined",
        });

        return true;
    } catch (error) {
        console.error("Reject invitation error:", error);
        toast.error("Failed to decline invitation", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}

/**
 * Cancel a pending invitation (admin/owner only)
 */
export async function cancelInvitation(invitationId: string): Promise<boolean> {
    try {
        const { error } = await authClient.organization.cancelInvitation({
            invitationId,
        });

        if (error) {
            toast.error("Failed to cancel invitation", {
                description: error.message || "An error occurred",
            });
            return false;
        }

        toast.success("Invitation canceled", {
            description: "The invitation has been canceled",
        });

        return true;
    } catch (error) {
        console.error("Cancel invitation error:", error);
        toast.error("Failed to cancel invitation", {
            description: "An unexpected error occurred",
        });
        return false;
    }
}
