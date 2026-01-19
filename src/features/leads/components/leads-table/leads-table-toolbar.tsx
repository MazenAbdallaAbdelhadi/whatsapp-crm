"use client";

import { Table } from "@tanstack/react-table";
import { X, SlidersHorizontal, Download, Upload, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LEAD_STATUSES } from "../../data/mock-leads";

interface LeadsTableToolbarProps<TData> {
    table: Table<TData>;
}

export function LeadsTableToolbar<TData>({
    table,
}: LeadsTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter leads..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-9 w-[250px] lg:w-[350px] bg-background/50"
                />

                {/* Status Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 border-dashed">
                            <Plus className="mr-2 h-4 w-4" />
                            Status
                            {table.getColumn("status")?.getFilterValue() && (
                                <>
                                    <Separator orientation="vertical" className="mx-2 h-4" />
                                    <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                        {(table.getColumn("status")?.getFilterValue() as string[])?.length}
                                    </Badge>
                                    <div className="hidden space-x-1 lg:flex">
                                        {(table.getColumn("status")?.getFilterValue() as string[])?.length > 2 ? (
                                            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                                {(table.getColumn("status")?.getFilterValue() as string[])?.length} selected
                                            </Badge>
                                        ) : (
                                            (table.getColumn("status")?.getFilterValue() as string[])?.map((option) => (
                                                <Badge
                                                    variant="secondary"
                                                    key={option}
                                                    className="rounded-sm px-1 font-normal"
                                                >
                                                    {option}
                                                </Badge>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                        <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {LEAD_STATUSES.map((status) => {
                            const isSelected = (table.getColumn("status")?.getFilterValue() as string[])?.includes(status);
                            return (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                        const filterValue = (table.getColumn("status")?.getFilterValue() as string[]) || [];
                                        if (checked) {
                                            table.getColumn("status")?.setFilterValue([...filterValue, status]);
                                        } else {
                                            table.getColumn("status")?.setFilterValue(
                                                filterValue.filter((val) => val !== status)
                                            );
                                        }
                                    }}
                                >
                                    {status}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2">
                {/* Import Button (Requested Feature) */}
                <Button variant="outline" size="sm" className="h-9 hidden sm:flex">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                </Button>

                <Button variant="outline" size="sm" className="h-9 hidden sm:flex">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-auto h-9">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter(
                                (column) =>
                                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
