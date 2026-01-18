"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, Building2, Users } from "lucide-react";

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
import { Skeleton } from "@/components/ui/skeleton";

import { RoleBadge } from "./role-badge";
import type { UserOrganization } from "@/features/organizations/types";
import { formatDate, getInitials, getOrganizationUrl } from "@/features/organizations/utils";

interface OrganizationsTableProps {
    organizations: UserOrganization[];
    isLoading?: boolean;
    sorting?: SortingState;
    onSortingChange?: (sorting: SortingState) => void;
}

export function OrganizationsTable({
    organizations,
    isLoading = false,
    sorting: externalSorting,
    onSortingChange,
}: OrganizationsTableProps) {
    const router = useRouter();
    const [internalSorting, setInternalSorting] = useState<SortingState>([]);

    const sorting = externalSorting ?? internalSorting;
    const setSorting = onSortingChange ?? setInternalSorting;

    const columns = useMemo<ColumnDef<UserOrganization>[]>(
        () => [
            {
                accessorKey: "name",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent"
                    >
                        Organization
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const org = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                {org.logo && <AvatarImage src={org.logo} alt={org.name} />}
                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                    {getInitials(org.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">{org.name}</span>
                                <span className="text-xs text-muted-foreground">/{org.slug}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "role",
                header: "Your Role",
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
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {formatDate(row.original.createdAt)}
                    </span>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: organizations,
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

    const handleRowClick = (org: UserOrganization) => {
        router.push(getOrganizationUrl(org.slug));
    };

    if (isLoading) {
        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Organization</TableHead>
                            <TableHead>Your Role</TableHead>
                            <TableHead>Created</TableHead>
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
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-16" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (organizations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No organizations yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Create your first organization to start collaborating with your team.
                </p>
            </div>
        );
    }

    return (
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
                    {table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleRowClick(row.original)}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
