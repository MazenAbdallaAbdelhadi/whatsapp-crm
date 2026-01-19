"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
    { date: "Mon", sent: 120, delivered: 110 },
    { date: "Tue", sent: 150, delivered: 130 },
    { date: "Wed", sent: 180, delivered: 160 },
    { date: "Thu", sent: 220, delivered: 200 },
    { date: "Fri", sent: 280, delivered: 250 },
    { date: "Sat", sent: 350, delivered: 310 },
    { date: "Sun", sent: 400, delivered: 380 },
];

const chartConfig = {
    sent: {
        label: "Messages Sent",
        color: "var(--chart-1)",
    },
    delivered: {
        label: "Delivered",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export function OverviewChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Message Throughput</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={{ className: "stroke-border" }}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={{ className: "stroke-border" }}
                            tickMargin={8}
                            width={40}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area
                            dataKey="delivered"
                            type="natural"
                            fill="var(--color-delivered)"
                            fillOpacity={0.4}
                            stroke="var(--color-delivered)"
                            stackId="a"
                        />
                        <Area
                            dataKey="sent"
                            type="natural"
                            fill="var(--color-sent)"
                            fillOpacity={0.4}
                            stroke="var(--color-sent)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
