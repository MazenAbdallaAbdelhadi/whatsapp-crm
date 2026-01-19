"use client";

import { ActionButton } from "@/components/action-button";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { PlatformDistributionChart } from "@/components/dashboard/platform-distribution-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatsCard } from "@/components/dashboard/stats-card";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Instagram,
  Layers,
  Megaphone,
  MessageSquare,
  RefreshCcw,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock Data for Sparklines
const mockTrendUp = [
  { value: 10 }, { value: 20 }, { value: 18 }, { value: 30 }, { value: 45 }, { value: 40 }, { value: 60 }
];
const mockTrendDown = [
  { value: 60 }, { value: 50 }, { value: 55 }, { value: 40 }, { value: 30 }, { value: 35 }, { value: 20 }
];
const mockTrendNeutral = [
  { value: 30 }, { value: 32 }, { value: 28 }, { value: 30 }, { value: 31 }, { value: 29 }, { value: 30 }
];

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data fetch
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
    toast.success("Dashboard data refreshed");
  };

  const handleNotify = () => {
    toast.info("You'll be notified when this integration is available.");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-6">

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DateRangePicker />
          <LoadingButton
            variant="outline"
            size="icon"
            loading={refreshing}
            onClick={handleRefresh}
            title="Refresh Data"
          >
            {!refreshing && <RefreshCcw className="h-4 w-4" />}
          </LoadingButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Contacts"
          value="2,350"
          icon={<Users className="h-4 w-4" />}
          trend="up"
          trendValue="+180"
          description="from last month"
          delay={0}
          chartData={mockTrendUp}
        />
        <StatsCard
          title="Active Campaigns"
          value="12"
          icon={<Megaphone className="h-4 w-4" />}
          trend="up"
          trendValue="+2"
          description="active now"
          delay={0.1}
          chartData={mockTrendUp}
        />
        <StatsCard
          title="Messages Sent (24h)"
          value="12,234"
          icon={<Send className="h-4 w-4" />}
          trend="down"
          trendValue="-5%"
          description="vs yesterday"
          delay={0.2}
          chartData={mockTrendDown}
        />
        <StatsCard
          title="Queue Status"
          value="45"
          icon={<Layers className="h-4 w-4" />}
          description="messages pending"
          delay={0.3}
          chartData={mockTrendNeutral}
        />
      </div>

      {/* Main Content Areas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-full">
        <OverviewChart />
        <PlatformDistributionChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-full">
        <div className="col-span-4 h-full">
          <RecentActivity />
        </div>
        <div className="col-span-3 h-full">
          <QuickActions />
        </div>
      </div>

      {/* Improved Coming Soon Section */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Unlock More Power</h3>
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-linear-to-br from-background to-muted/50 border-input/50 shadow-sm">
            <CardHeader>
              <Instagram className="h-8 w-8 text-pink-500 mb-2" />
              <CardTitle className="text-base">Instagram Integration</CardTitle>
              <CardDescription>Connect your Instagram Professional account to manage DMs and auto-replies.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="secondary" className="w-full" onClick={handleNotify}>Notify Me</Button>
            </CardFooter>
          </Card>

          <Card className="bg-linear-to-br from-background to-muted/50 border-input/50 shadow-sm">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle className="text-base">Messenger Support</CardTitle>
              <CardDescription>Unified inbox for Facebook Page messages with automated bot flows.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="secondary" className="w-full" onClick={handleNotify}>Notify Me</Button>
            </CardFooter>
          </Card>

          <Card className="bg-linear-to-br from-background to-muted/50 border-input/50 shadow-sm">
            <CardHeader>
              <Send className="h-8 w-8 text-sky-500 mb-2" />
              <CardTitle className="text-base">Telegram Bot</CardTitle>
              <CardDescription>Connect Telegram bots to broadcast channels and manage subscriber groups.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="secondary" className="w-full" onClick={handleNotify}>Notify Me</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
