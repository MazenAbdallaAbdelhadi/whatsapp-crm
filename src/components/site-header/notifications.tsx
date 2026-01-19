"use client";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, Mail, AlertTriangle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const notifications = [
    {
        id: 1,
        title: "New Message",
        description: "Sarah sent you a message about the Q4 report.",
        time: "2 min ago",
        icon: Mail,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        unread: true,
    },
    {
        id: 2,
        title: "System Alert",
        description: "High server load detected (85%).",
        time: "1 hour ago",
        icon: AlertTriangle,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        unread: true,
    },
    {
        id: 3,
        title: "Report Ready",
        description: "Your weekly analytics report is ready to download.",
        time: "3 hours ago",
        icon: FileText,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        unread: false,
    },
    {
        id: 4,
        title: "New Member",
        description: "John Doe joined the 'Marketing' team.",
        time: "Yesterday",
        icon: FileText, // Using FileText as generic, ideally UserPlus but missing import
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        unread: false,
    },
];

export function Notifications() {
    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(2);

    const handleMarkAllRead = () => {
        setUnreadCount(0);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
                            onClick={handleMarkAllRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    <div className="grid gap-1 p-2">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    "flex items-start gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50",
                                    notification.unread && unreadCount > 0 ? "bg-muted/30" : ""
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                                        notification.bg,
                                        notification.color
                                    )}
                                >
                                    <notification.icon className="h-4 w-4" />
                                </div>
                                <div className="grid gap-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium leading-none">
                                            {notification.title}
                                        </p>
                                        <span className="text-xs text-muted-foreground">
                                            {notification.time}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {notification.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-2 border-t text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                        View all notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
