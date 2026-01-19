"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    delay?: number;
    chartData?: { value: number }[];
}

export function StatsCard({
    title,
    value,
    icon,
    description,
    trend,
    trendValue,
    delay = 0,
    chartData,
}: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card className="hover:border-primary/50 transition-colors overflow-hidden relative">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <div className="text-muted-foreground">{icon}</div>
                </CardHeader>
                <CardContent className="z-10 relative">
                    <div className="text-2xl font-bold">{value}</div>
                    {(description || trendValue) && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            {trend && trendValue && (
                                <span
                                    className={cn(
                                        "font-medium",
                                        trend === "up" && "text-emerald-500",
                                        trend === "down" && "text-rose-500",
                                        trend === "neutral" && "text-muted-foreground"
                                    )}
                                >
                                    {trendValue}
                                </span>
                            )}
                            {description}
                        </p>
                    )}
                </CardContent>
                {chartData && (
                    <div className="absolute bottom-0 right-0 w-full h-1/2 opacity-10 pointer-events-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={
                                        trend === "down"
                                            ? "var(--color-rose-500)"
                                            : "var(--color-emerald-500)"
                                    }
                                    fill={
                                        trend === "down"
                                            ? "var(--color-rose-500)"
                                            : "var(--color-emerald-500)"
                                    }
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </Card>
        </motion.div>
    );
}
