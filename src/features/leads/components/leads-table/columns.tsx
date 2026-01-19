"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Lead } from "../../data/mock-leads";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    MoreHorizontal,
    ArrowUpDown,
    MessageCircle,
    Phone,
    Store,
    Megaphone,
    Globe,
    Users,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
    'New': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 dark:bg-blue-500/20',
    'Replied': 'bg-purple-500/10 text-purple-700 dark:text-purple-400 dark:bg-purple-500/20',
    'Awaiting Reply': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 dark:bg-amber-500/20',
    'Interested': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 dark:bg-emerald-500/20',
    'Not Interested': 'bg-muted text-muted-foreground',
    'Converted': 'bg-green-600/10 text-green-700 dark:text-green-400 dark:bg-green-600/20',
    'Blocked': 'bg-red-500/10 text-red-700 dark:text-red-400 dark:bg-red-500/20',
};

const sourceIcons: Record<string, React.ReactNode> = {
    'WhatsApp Chat': <MessageCircle className="h-3.5 w-3.5 text-green-500" />,
    'Catalog Inquiry': <Store className="h-3.5 w-3.5 text-blue-500" />,
    'Broadcast Reply': <Megaphone className="h-3.5 w-3.5 text-orange-500" />,
    'Facebook Ad': <Globe className="h-3.5 w-3.5 text-indigo-500" />,
    'Website Widget': <MessageSquare className="h-3.5 w-3.5 text-violet-500" />,
    'Referral': <Users className="h-3.5 w-3.5 text-pink-500" />,
};

export const columns: ColumnDef<Lead>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
                Contact
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={row.original.avatar} alt={row.original.name} />
                        <AvatarFallback>{row.original.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {row.original.source.includes('WhatsApp') && (
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-border">
                            <MessageCircle className="h-3 w-3 text-green-500 fill-green-500/20" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-semibold text-sm truncate">{row.original.name}</span>
                    <span className="text-xs text-muted-foreground truncate font-mono">{row.original.phone}</span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <div className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow-sm whitespace-nowrap", statusColors[status])}>
                    {status}
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "lastMessage",
        header: "Last Message",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col max-w-[200px]">
                    <span className="text-sm truncate text-muted-foreground">{row.original.lastMessage}</span>
                    {row.original.unreadCount > 0 && (
                        <span className="text-[10px] font-bold text-green-600 mt-0.5">
                            {row.original.unreadCount} unread
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "value",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
                Value
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("value"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
            }).format(amount);
            return <div className="font-medium tabular-nums">{formatted}</div>;
        },
    },
    {
        accessorKey: "source",
        header: "Source",
        cell: ({ row }) => {
            const source = row.getValue("source") as string;
            return (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {sourceIcons[source]}
                    <span className="truncate">{source}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "lastContacted",
        header: "Last Activity",
        cell: ({ row }) => {
            return (
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(row.getValue("lastContacted"), "MMM d, HH:mm")}
                </div>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
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
                        <DropdownMenuItem className="text-green-600 focus:text-green-700">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Open Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.phone)}>
                            <Phone className="mr-2 h-4 w-4" />
                            Copy Phone
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Labels</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
