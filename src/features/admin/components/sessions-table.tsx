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
import { ArrowUpDown, ArrowUp, ArrowDown, Monitor } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionButton } from "@/components/action-button";

import type { SessionTableData } from "@/features/admin/types";
import {
    formatRelativeTime,
    getInitials,
} from "@/features/admin/utils";
import { revokeSession } from "@/features/admin/api";

interface SessionsTableProps {
    sessions: SessionTableData[];
    isLoading?: boolean;
    sorting?: SortingState;
    onSortingChange?: (sorting: SortingState) => void;
    onSessionRevoked?: () => void;
}

export function SessionsTable({
    sessions,
    isLoading,
    sorting = [],
    onSortingChange,
    onSessionRevoked,
}: SessionsTableProps) {
    const router = useRouter();

    const columns = useMemo<ColumnDef<SessionTableData>[]>(
        () => [
            {
                accessorKey: "userName",
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
                    const session = row.original;
                    return (
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => router.push(`/admin/users/${session.userId}`)}
                        >
                            <Avatar className="h-8 w-8">
                                {session.userImage ? (
                                    <img
                                        src={session.userImage}
                                        alt={session.userName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium">
                                        {getInitials(session.userName)}
                                    </div>
                                )}
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">{session.userName}</span>
                                <span className="text-sm text-muted-foreground">
                                    {session.userEmail}
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "device",
                header: "Device & Browser",
                cell: ({ row }) => {
                    const session = row.original;
                    return (
                        <div className="flex items-start gap-2">
                            <Monitor className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">{session.device}</p>
                                <p className="text-xs text-muted-foreground">
                                    {session.browser}
                                </p>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "ipAddress",
                header: "IP Address",
                cell: ({ row }) => {
                    return (
                        <span className="text-sm text-muted-foreground">
                            {row.original.ipAddress || "Unknown"}
                        </span>
                    );
                },
            },
            {
                accessorKey: "lastActive",
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
                            Last Active
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
                            {formatRelativeTime(row.original.lastActive)}
                        </span>
                    );
                },
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => {
                    const session = row.original;
                    return (
                        <div className="flex justify-end">
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                title="Revoke Session?"
                                description="This will immediately log out the user from this device."
                                confirmText="Revoke"
                                onAction={async () => {
                                    const success = await revokeSession(session.id);
                                    if (success && onSessionRevoked) {
                                        onSessionRevoked();
                                    }
                                }}
                            >
                                Revoke
                            </ActionButton>
                        </div>
                    );
                },
            },
        ],
        [router, onSessionRevoked]
    );

    const table = useReactTable({
        data: sessions,
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
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
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
                            <TableRow key={row.id}>
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
                                No active sessions found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
