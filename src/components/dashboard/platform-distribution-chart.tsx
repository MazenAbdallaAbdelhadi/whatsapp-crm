"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Label, Pie, PieChart } from "recharts";

const chartData = [
    { platform: "whatsapp", count: 850, fill: "var(--color-whatsapp)" },
    { platform: "others", count: 150, fill: "var(--color-others)" },
];

const chartConfig = {
    whatsapp: {
        label: "WhatsApp",
        color: "var(--chart-2)",
    },
    others: {
        label: "Others",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig;

export function PlatformDistributionChart() {
    const totalUsers = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0);
    }, []);

    return (
        <Card className="col-span-3 flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Active active users by channel</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="platform"
                            innerRadius={65}
                            strokeWidth={5}
                        >
                            <Cell key="cell-0" fill="var(--color-whatsapp)" />
                            <Cell key="cell-1" fill="var(--color-others)" />
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalUsers.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-xs"
                                                >
                                                    Users
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                        {/* Legend at bottom, simpler */}
                        <ChartLegend
                            content={<ChartLegendContent nameKey="platform" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
