// Organization types based on the database schema

/**
 * Base Organization type matching Prisma model
 */
export interface Organization {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    createdAt: Date;
    metadata: string | null;
}

/**
 * Organization with parsed metadata
 */
export interface OrganizationWithMetadata extends Omit<Organization, "metadata"> {
    metadata: Record<string, unknown> | null;
}

/**
 * Member type with role union
 */
export type MemberRole = "owner" | "admin" | "member";

export interface Member {
    id: string;
    organizationId: string;
    userId: string;
    role: MemberRole;
    createdAt: Date;
}

/**
 * Member with user relation populated
 */
export interface MemberWithUser extends Member {
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
}

/**
 * Invitation status union type
 */
export type InvitationStatus = "pending" | "accepted" | "rejected" | "canceled";

/**
 * Invitation type matching Prisma model
 */
export interface Invitation {
    id: string;
    organizationId: string;
    email: string;
    role: string | null;
    status: InvitationStatus;
    expiresAt: Date;
    createdAt: Date;
    inviterId: string;
}

/**
 * Invitation with organization relation
 */
export interface InvitationWithOrganization extends Invitation {
    organization: Organization;
}

/**
 * Invitation with inviter user relation
 */
export interface InvitationWithInviter extends Invitation {
    inviter: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
}

/**
 * Full invitation with all relations
 */
export interface FullInvitation extends Invitation {
    organization: Organization;
    inviter: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
}

/**
 * Organization with members array
 */
export interface OrganizationWithMembers extends Organization {
    members: MemberWithUser[];
}

/**
 * Organization with full data (members and invitations)
 */
export interface FullOrganization extends Organization {
    members: MemberWithUser[];
    invitations: Invitation[];
}

/**
 * User's organization with their membership info
 */
export interface UserOrganization extends Organization {
    role: MemberRole;
    memberId: string;
}

/**
 * Active organization context for session
 */
export interface ActiveOrganizationContext {
    organization: Organization;
    member: Member;
    role: MemberRole;
}

/**
 * List organizations response from API
 */
export interface ListOrganizationsResponse {
    data: UserOrganization[];
}

/**
 * List members response from API
 */
export interface ListMembersResponse {
    data: MemberWithUser[];
}

/**
 * List invitations response from API
 */
export interface ListInvitationsResponse {
    data: Invitation[];
}

/**
 * Organization table row data
 */
export interface OrganizationTableData {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    role: MemberRole;
    membersCount: number;
    createdAt: Date;
}

/**
 * Member table row data
 */
export interface MemberTableData {
    id: string;
    userId: string;
    name: string;
    email: string;
    image: string | null;
    role: MemberRole;
    createdAt: Date;
}

/**
 * Invitation table row data
 */
export interface InvitationTableData {
    id: string;
    email: string;
    role: string | null;
    status: InvitationStatus;
    expiresAt: Date;
    createdAt: Date;
    inviterName: string;
    organizationName?: string;
}

/**
 * Permission check result
 */
export interface PermissionResult {
    allowed: boolean;
    reason?: string;
}

/**
 * Organization creation result
 */
export interface CreateOrganizationResult {
    organization: Organization;
    member: Member;
}

/**
 * API error response
 */
export interface OrganizationApiError {
    code: string;
    message: string;
    statusCode?: number;
}
