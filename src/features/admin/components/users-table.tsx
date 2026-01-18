"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { AdminUser } from "@/features/admin/types";
import {
    getRoleBadgeVariant,
    formatRoles,
    formatShortDate,
    getInitials,
} from "@/features/admin/utils";

interface UsersTableProps {
    users: AdminUser[];
    isLoading?: boolean;
    sorting?: SortingState;
    onSortingChange?: (sorting: SortingState) => void;
}

export function UsersTable({
    users,
    isLoading,
    sorting = [],
    onSortingChange,
}: UsersTableProps) {
    const router = useRouter();

    const columns = useMemo<ColumnDef<AdminUser>[]>(
        () => [
            {
                accessorKey: "name",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-4 h-8"
                            onClick={() =>
                                column.toggleSorting(column.getIsSorted() === "asc")
                            }
                        >
                            User
                            {column.getIsSorted() === "asc" ? (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            ) : column.getIsSorted() === "desc" ? (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            ) : (
                                <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                            )}
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    const user = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium">
                                        {getInitials(user.name)}
                                    </div>
                                )}
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-sm text-muted-foreground">
                                    {user.email}
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "role",
                header: "Role",
                cell: ({ row }) => {
                    const roles = formatRoles(row.original.role);
                    return (
                        <div className="flex gap-1 flex-wrap">
                            {roles.map((role, index) => (
                                <Badge
                                    key={index}
                                    variant={getRoleBadgeVariant(role)}
                                    className="capitalize"
                                >
                                    {role}
                                </Badge>
                            ))}
                        </div>
                    );
                },
            },
            {
                accessorKey: "banned",
                header: "Status",
                cell: ({ row }) => {
                    const user = row.original;
                    if (user.banned) {
                        return (
                            <Badge variant="destructive" className="gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                Banned
                            </Badge>
                        );
                    }
                    return (
                        <Badge variant="outline" className="gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Active
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "createdAt",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-4 h-8"
                            onClick={() =>
                                column.toggleSorting(column.getIsSorted() === "asc")
                            }
                        >
                            Joined
                            {column.getIsSorted() === "asc" ? (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            ) : column.getIsSorted() === "desc" ? (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            ) : (
                                <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                            )}
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    return (
                        <span className="text-sm text-muted-foreground">
                            {formatShortDate(row.original.createdAt)}
                        </span>
                    );
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        onSortingChange: onSortingChange as any,
        manualSorting: false,
    });

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="cursor-pointer"
                                onClick={() => router.push(`/admin/users/${row.original.id}`)}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
