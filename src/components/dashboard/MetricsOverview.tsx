import { TrendingUp, Clock, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const shiftDistributionData = [
  { name: "Mon", shifts: 4, fill: "hsl(var(--status-confirmed))" },
  { name: "Tue", shifts: 3, fill: "hsl(var(--status-confirmed))" },
  { name: "Wed", shifts: 5, fill: "hsl(var(--status-confirmed))" },
  { name: "Thu", shifts: 2, fill: "hsl(var(--status-confirmed))" },
  { name: "Fri", shifts: 4, fill: "hsl(var(--status-confirmed))" },
  { name: "Sat", shifts: 1, fill: "hsl(var(--status-confirmed))" },
  { name: "Sun", shifts: 2, fill: "hsl(var(--status-confirmed))" },
];

const statusData = [
  { name: "Confirmed", value: 15, fill: "hsl(var(--status-confirmed))" },
  { name: "Pending", value: 3, fill: "hsl(var(--status-pending))" },
  { name: "In Trade", value: 2, fill: "hsl(var(--status-negotiation))" },
];

const monthlyTrendsData = [
  { month: "Oct", hours: 160 },
  { month: "Nov", hours: 172 },
  { month: "Dec", hours: 145 },
  { month: "Jan", hours: 168 },
];

const chartConfig = {
  shifts: {
    label: "Shifts",
    color: "hsl(var(--primary))",
  },
  hours: {
    label: "Hours", 
    color: "hsl(var(--primary))",
  },
  confirmed: {
    label: "Confirmed",
    color: "hsl(var(--status-confirmed))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--status-pending))",
  },
  negotiation: {
    label: "In Trade",
    color: "hsl(var(--status-negotiation))",
  },
};

export function MetricsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Weekly Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-primary" />
            Weekly Distribution
          </CardTitle>
          <CardDescription>Shifts per day this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shiftDistributionData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="shifts" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Shift Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-primary" />
            Shift Status
          </CardTitle>
          <CardDescription>Current month breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex justify-center gap-4 mt-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1 text-xs">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-muted-foreground">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            Monthly Hours
          </CardTitle>
          <CardDescription>Working hours trend</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendsData}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}