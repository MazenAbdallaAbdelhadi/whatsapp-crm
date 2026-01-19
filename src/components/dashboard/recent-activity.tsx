"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
    CheckCircle2,
    UserPlus,
    FileSpreadsheet,
    Clock,
    AlertCircle,
    ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const activities = [
    {
        id: 1,
        title: "Summer Sale Campaign",
        description: "Campaign successfully launched to 2,400 contacts.",
        time: "Just now",
        icon: MegaphoneIcon,
        variant: "default",
    },
    {
        id: 2,
        title: "New Contact API",
        description: "Webhook received: New user registration via website.",
        time: "15m ago",
        icon: UserPlus,
        variant: "blue",
    },
    {
        id: 3,
        title: "Bounce Rate Warning",
        description: "High bounce rate (5.2%) detected on welcome series.",
        time: "1h ago",
        icon: AlertCircle,
        variant: "amber",
    },
    {
        id: 4,
        title: "Data Import",
        description: "Completed import of 'leads_q1.csv'.",
        time: "4h ago",
        icon: FileSpreadsheet,
        variant: "emerald",
        hideLine: true
    },
    {
        id: 5,
        title: "Weekly Newsletter",
        description: "Scheduled for delivery at 9:00 AM EST.",
        time: "Yesterday",
        icon: Clock,
        variant: "purple",
    },
    {
        id: 6,
        title: "System Backup",
        description: "Daily automated backup completed.",
        time: "Yesterday",
        icon: CheckCircle2,
        variant: "default",
        hideLine: true
    },
];

function MegaphoneIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 11 18-5v12L3 14v-3z" />
            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
    )
}

const variants = {
    default: "bg-gray-100/80 text-gray-600 border-gray-200 dark:bg-primary/10 dark:text-primary dark:border-primary/20",
    blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    amber: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    purple: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
};

export function RecentActivity() {
    return (
        <Card className="h-full flex flex-col border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">
                    View All
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[400px] px-6">
                    <div className="space-y-8 pb-8 pt-4">
                        {activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-20px" }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="relative pl-12"
                            >
                                {/* Vertical Line Connection */}
                                {index !== activities.length - 1 && (
                                    <div
                                        className="absolute left-[15.5px] top-8 bottom-[-32px] w-px bg-border/40"
                                        aria-hidden="true"
                                    />
                                )}

                                {/* Icon Node */}
                                <div className={cn(
                                    "absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm z-10",
                                    variants[activity.variant as keyof typeof variants] || variants.default
                                )}>
                                    <activity.icon className="h-4 w-4" />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-1 -mt-0.5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium leading-none text-foreground/90">
                                            {activity.title}
                                        </p>
                                        <time className="text-xs text-muted-foreground/60 tabular-nums">
                                            {activity.time}
                                        </time>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {activity.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
