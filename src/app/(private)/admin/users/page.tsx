"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import type { SortingState } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { UsersTable } from "@/features/admin/components/users-table";
import { CreateUserDialog } from "@/features/admin/components/create-user-dialog";
import { listUsers } from "@/features/admin/api";
import type { AdminUser, ListUsersParams } from "@/features/admin/types";

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);

    // Filters
    const [searchValue, setSearchValue] = useState("");
    const [searchField, setSearchField] = useState<"email" | "name">("name");
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    // Sorting
    const [sorting, setSorting] = useState<SortingState>([]);

    // Pagination
    const [page, setPage] = useState(0);
    const pageSize = 50;

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);

        const params: ListUsersParams = {
            limit: pageSize,
            offset: page * pageSize,
        };

        // Apply search
        if (searchValue.trim()) {
            params.searchValue = searchValue;
            params.searchField = searchField;
            params.searchOperator = "contains";
        }

        // Apply role filter
        if (roleFilter) {
            params.filterField = "role";
            params.filterValue = roleFilter;
            params.filterOperator = "eq";
        }

        // Apply status filter (banned)
        if (statusFilter) {
            params.filterField = "banned";
            params.filterValue = statusFilter === "banned";
            params.filterOperator = "eq";
        }

        // Apply sorting
        if (sorting.length > 0) {
            params.sortBy = sorting[0].id;
            params.sortDirection = sorting[0].desc ? "desc" : "asc";
        }

        const result = await listUsers(params);

        if (result) {
            setUsers(result.users);
            setTotalUsers(result.total);
        }

        setIsLoading(false);
    }, [searchValue, searchField, roleFilter, statusFilter, sorting, page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        setPage(0); // Reset to first page
    };

    const handleRoleFilter = (value: string) => {
        setRoleFilter(value);
        setPage(0);
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        setPage(0);
    };

    const clearFilters = () => {
        setSearchValue("");
        setRoleFilter("");
        setStatusFilter("");
        setPage(0);
    };

    const hasActiveFilters = searchValue || roleFilter || statusFilter;
    const totalPages = Math.ceil(totalUsers / pageSize);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Users</h1>
                    <p className="text-sm text-muted-foreground">
                        {totalUsers} {totalUsers === 1 ? "user" : "users"} in total
                    </p>
                </div>
                <CreateUserDialog onSuccess={fetchUsers} />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={`Search by ${searchField}...`}
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select value={searchField} onValueChange={setSearchField as any}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={roleFilter} onValueChange={handleRoleFilter}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All roles</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="All status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="gap-1"
                    >
                        <X className="h-4 w-4" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex gap-2 flex-wrap">
                    {searchValue && (
                        <Badge variant="secondary" className="gap-1">
                            Search: {searchValue}
                            <button
                                onClick={() => handleSearch("")}
                                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {roleFilter && (
                        <Badge variant="secondary" className="gap-1 capitalize">
                            Role: {roleFilter}
                            <button
                                onClick={() => handleRoleFilter("")}
                                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {statusFilter && (
                        <Badge variant="secondary" className="gap-1 capitalize">
                            Status: {statusFilter}
                            <button
                                onClick={() => handleStatusFilter("")}
                                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}

            {/* Table */}
            <UsersTable
                users={users}
                isLoading={isLoading}
                sorting={sorting}
                onSortingChange={setSorting}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {page * pageSize + 1} to{" "}
                        {Math.min((page + 1) * pageSize, totalUsers)} of {totalUsers}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0 || isLoading}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1 px-3 text-sm">
                            Page {page + 1} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page >= totalPages - 1 || isLoading}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
