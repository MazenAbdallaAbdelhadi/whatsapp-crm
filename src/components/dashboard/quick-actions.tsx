"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload, FileText, BarChart3, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
    {
        title: "New Campaign",
        description: "Create and schedule a new message blast.",
        icon: Plus,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
        border: "hover:border-emerald-500/50"
    },
    {
        title: "Import Contacts",
        description: "Bulk upload contacts from CSV or Excel.",
        icon: Upload,
        color: "text-blue-500",
        bg: "bg-blue-500/10 hover:bg-blue-500/20",
        border: "hover:border-blue-500/50"
    },
    {
        title: "Create Template",
        description: "Design reusable message templates.",
        icon: FileText,
        color: "text-amber-500",
        bg: "bg-amber-500/10 hover:bg-amber-500/20",
        border: "hover:border-amber-500/50"
    },
    {
        title: "View Analytics",
        description: "Deep dive into campaign performance.",
        icon: BarChart3,
        color: "text-purple-500",
        bg: "bg-purple-500/10 hover:bg-purple-500/20",
        border: "hover:border-purple-500/50"
    },
];

export function QuickActions() {
    return (
        <Card className="h-full flex flex-col border-border/50 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className={cn(
                            "group relative flex flex-col items-start justify-between min-h-[140px] p-5 rounded-xl border border-transparent transition-all duration-300",
                            "bg-muted/30 hover:bg-muted/50 hover:shadow-sm",
                            action.border
                        )}
                        type="button"
                    >
                        <div className="space-y-3 w-full text-left">
                            {/* Icon */}
                            <div className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                                action.bg
                            )}>
                                <action.icon className={cn("h-5 w-5", action.color)} />
                            </div>

                            {/* Text */}
                            <div className="space-y-1">
                                <h4 className="font-semibold text-sm tracking-tight text-foreground/90 group-hover:text-foreground">
                                    {action.title}
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed pr-2">
                                    {action.description}
                                </p>
                            </div>
                        </div>

                        {/* Hover Chevron */}
                        <div className="absolute top-5 right-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                    </button>
                ))}
            </CardContent>
        </Card>
    );
}
