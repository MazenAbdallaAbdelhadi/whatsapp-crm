"use client";

import { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    MoreHorizontal,
    UserMinus,
    Shield,
    ShieldCheck,
    Crown,
    Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { RoleBadge } from "./role-badge";
import { ChangeMemberRoleDialog } from "./change-member-role-dialog";
import { RemoveMemberDialog } from "./remove-member-dialog";
import type { MemberWithUser, MemberRole } from "@/features/organizations/types";
import {
    formatDate,
    getInitials,
    canManageMembers,
} from "@/features/organizations/utils";

interface MembersTableProps {
    members: MemberWithUser[];
    isLoading?: boolean;
    currentUserId: string;
    currentUserRole: MemberRole;
    sorting?: SortingState;
    onSortingChange?: (sorting: SortingState) => void;
    onMemberUpdated?: () => void;
}

export function MembersTable({
    members,
    isLoading = false,
    currentUserId,
    currentUserRole,
    sorting: externalSorting,
    onSortingChange,
    onMemberUpdated,
}: MembersTableProps) {
    const [internalSorting, setInternalSorting] = useState<SortingState>([]);
    const [roleDialogMember, setRoleDialogMember] = useState<MemberWithUser | null>(null);
    const [removeDialogMember, setRemoveDialogMember] = useState<MemberWithUser | null>(null);

    const sorting = externalSorting ?? internalSorting;
    const setSorting = onSortingChange ?? setInternalSorting;

    const canManage = canManageMembers(currentUserRole);

    const columns = useMemo<ColumnDef<MemberWithUser>[]>(
        () => [
            {
                accessorKey: "user.name",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent"
                    >
                        Member
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const member = row.original;
                    const isCurrentUser = member.userId === currentUserId;

                    return (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                {member.user.image && (
                                    <AvatarImage src={member.user.image} alt={member.user.name} />
                                )}
                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                    {getInitials(member.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">
                                    {member.user.name}
                                    {isCurrentUser && (
                                        <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                                    )}
                                </span>
                                <span className="text-xs text-muted-foreground">{member.user.email}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "role",
                header: "Role",
                cell: ({ row }) => <RoleBadge role={row.original.role} />,
            },
            {
                accessorKey: "createdAt",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent"
                    >
                        Joined
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {formatDate(row.original.createdAt)}
                    </span>
                ),
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => {
                    const member = row.original;
                    const isCurrentUser = member.userId === currentUserId;
                    const isOwner = member.role === "owner";

                    // Can't manage yourself or owners (unless you're the owner changing your own role)
                    if (!canManage || isCurrentUser || (isOwner && currentUserRole !== "owner")) {
                        return null;
                    }

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setRoleDialogMember(member)}>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Change Role
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setRemoveDialogMember(member)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Remove Member
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [canManage, currentUserId, currentUserRole]
    );

    const table = useReactTable({
        data: members,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: (updater) => {
            const newSorting = typeof updater === "function" ? updater(sorting) : updater;
            setSorting(newSorting);
        },
        state: {
            sorting,
        },
    });

    if (isLoading) {
        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-9 w-9 rounded-full" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-40" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-16" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-8 w-8" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No members</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Invite team members to start collaborating in this organization.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => {
                            const isCurrentUser = row.original.userId === currentUserId;
                            return (
                                <TableRow
                                    key={row.id}
                                    className={isCurrentUser ? "bg-muted/30" : undefined}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Change Role Dialog */}
            {roleDialogMember && (
                <ChangeMemberRoleDialog
                    member={roleDialogMember}
                    currentUserRole={currentUserRole}
                    open={!!roleDialogMember}
                    onOpenChange={(open: boolean) => !open && setRoleDialogMember(null)}
                    onSuccess={() => {
                        setRoleDialogMember(null);
                        onMemberUpdated?.();
                    }}
                />
            )}

            {/* Remove Member Dialog */}
            {removeDialogMember && (
                <RemoveMemberDialog
                    member={removeDialogMember}
                    open={!!removeDialogMember}
                    onOpenChange={(open: boolean) => !open && setRemoveDialogMember(null)}
                    onSuccess={() => {
                        setRemoveDialogMember(null);
                        onMemberUpdated?.();
                    }}
                />
            )}
        </>
    );
}
