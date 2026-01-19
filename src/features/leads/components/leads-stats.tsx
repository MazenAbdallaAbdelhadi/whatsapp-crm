import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, DollarSign, Target, TrendingUp } from "lucide-react";

const chartData1 = Array.from({ length: 20 }, () => ({ value: Math.floor(Math.random() * 100) + 50 }));
const chartData2 = Array.from({ length: 20 }, () => ({ value: Math.floor(Math.random() * 100) + 20 }));
const chartData3 = Array.from({ length: 20 }, () => ({ value: Math.floor(Math.random() * 100) + 80 }));
const chartData4 = Array.from({ length: 20 }, () => ({ value: Math.floor(Math.random() * 100) + 10 }));

export const LeadsStats = () => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Total Leads"
                value="2,543"
                icon={<Users className="h-4 w-4" />}
                trend="up"
                trendValue="+12.5%"
                description="from last month"
                chartData={chartData1}
                delay={0.1}
            />
            <StatsCard
                title="Pipeline Value"
                value="$4.2M"
                icon={<DollarSign className="h-4 w-4" />}
                trend="up"
                trendValue="+8.2%"
                description="from last month"
                chartData={chartData2}
                delay={0.2}
            />
            <StatsCard
                title="Conversion Rate"
                value="18.2%"
                icon={<Target className="h-4 w-4" />}
                trend="down"
                trendValue="-1.4%"
                description="from last month"
                chartData={chartData3}
                delay={0.3}
            />
            <StatsCard
                title="New This Week"
                value="+142"
                icon={<TrendingUp className="h-4 w-4" />}
                trend="up"
                trendValue="+24%"
                description="from last week"
                chartData={chartData4}
                delay={0.4}
            />
        </div>
    );
};
