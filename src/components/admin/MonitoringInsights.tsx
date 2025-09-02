import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Calendar,
  Users,
  Shield
} from "lucide-react";

// Mock data for coverage gaps
const coverageGaps = [
  {
    date: "2024-01-20",
    timeSlot: "22:00-06:00",
    department: "Emergency Medicine",
    priority: "High",
    duration: "8 hours"
  },
  {
    date: "2024-01-22",
    timeSlot: "14:00-22:00", 
    department: "Cardiology",
    priority: "Medium",
    duration: "8 hours"
  },
  {
    date: "2024-01-25",
    timeSlot: "06:00-14:00",
    department: "Neurology", 
    priority: "Low",
    duration: "8 hours"
  }
];

// Mock fairness statistics
const fairnessData = [
  {
    doctorName: "Dr. Sarah Johnson",
    nightShifts: 8,
    weekendShifts: 6,
    totalShifts: 24,
    fairnessScore: 85
  },
  {
    doctorName: "Dr. Michael Chen",
    nightShifts: 12,
    weekendShifts: 8,
    totalShifts: 28,
    fairnessScore: 72
  },
  {
    doctorName: "Dr. Emily Rodriguez",
    nightShifts: 6,
    weekendShifts: 4,
    totalShifts: 20,
    fairnessScore: 92
  },
  {
    doctorName: "Dr. David Kim",
    nightShifts: 10,
    weekendShifts: 7,
    totalShifts: 26,
    fairnessScore: 78
  }
];

// Chart data for shift distribution
const shiftDistributionData = [
  { name: "Dr. Johnson", nightShifts: 8, weekendShifts: 6, totalShifts: 24 },
  { name: "Dr. Chen", nightShifts: 12, weekendShifts: 8, totalShifts: 28 },
  { name: "Dr. Rodriguez", nightShifts: 6, weekendShifts: 4, totalShifts: 20 },
  { name: "Dr. Kim", nightShifts: 10, weekendShifts: 7, totalShifts: 26 }
];

// Pie chart data for coverage
const coverageData = [
  { name: "Covered", value: 87, color: "hsl(var(--status-confirmed))" },
  { name: "Gaps", value: 13, color: "hsl(var(--destructive))" }
];

const getFairnessColor = (score: number) => {
  if (score >= 90) return "bg-status-confirmed text-status-confirmed-foreground";
  if (score >= 75) return "bg-status-pending text-status-pending-foreground";
  return "bg-destructive text-destructive-foreground";
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "destructive";
    case "Medium": return "default";
    case "Low": return "secondary";
    default: return "outline";
  }
};

export const MonitoringInsights = () => {
  const totalGaps = coverageGaps.length;
  const highPriorityGaps = coverageGaps.filter(gap => gap.priority === "High").length;
  const averageFairness = Math.round(
    fairnessData.reduce((sum, doctor) => sum + doctor.fairnessScore, 0) / fairnessData.length
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Coverage Gaps</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{totalGaps}</p>
            <p className="text-xs text-muted-foreground">{highPriorityGaps} high priority</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-status-confirmed" />
              <span className="text-sm font-medium">Coverage Rate</span>
            </div>
            <p className="text-2xl font-bold text-status-confirmed">87%</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-status-pending" />
              <span className="text-sm font-medium">Avg. Fairness</span>
            </div>
            <p className="text-2xl font-bold text-status-pending">{averageFairness}%</p>
            <p className="text-xs text-muted-foreground">Across all doctors</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Active Doctors</span>
            </div>
            <p className="text-2xl font-bold">{fairnessData.length}</p>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Coverage Gaps
          </CardTitle>
          <CardDescription>
            Unassigned shifts requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coverageGaps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No coverage gaps found
                    </TableCell>
                  </TableRow>
                ) : (
                  coverageGaps.map((gap, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{gap.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {gap.timeSlot}
                        </div>
                      </TableCell>
                      <TableCell>{gap.department}</TableCell>
                      <TableCell>{gap.duration}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(gap.priority)}>
                          {gap.priority}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Fairness Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fairness Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Fairness Statistics
            </CardTitle>
            <CardDescription>
              Work distribution fairness across doctors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fairnessData.map((doctor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{doctor.doctorName}</span>
                    <Badge 
                      variant="outline"
                      className={getFairnessColor(doctor.fairnessScore)}
                    >
                      {doctor.fairnessScore}%
                    </Badge>
                  </div>
                  <Progress value={doctor.fairnessScore} className="h-2" />
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>Night: {doctor.nightShifts}</div>
                    <div>Weekend: {doctor.weekendShifts}</div>
                    <div>Total: {doctor.totalShifts}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shift Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Shift Distribution
            </CardTitle>
            <CardDescription>
              Night and weekend shift distribution by doctor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={shiftDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="nightShifts" 
                  fill="hsl(var(--status-negotiation))" 
                  name="Night Shifts"
                />
                <Bar 
                  dataKey="weekendShifts" 
                  fill="hsl(var(--status-pending))" 
                  name="Weekend Shifts"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Coverage Overview
          </CardTitle>
          <CardDescription>
            Overall schedule coverage status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={coverageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {coverageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Coverage Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Shifts</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Covered Shifts</span>
                    <span className="font-medium text-status-confirmed">136</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coverage Gaps</span>
                    <span className="font-medium text-destructive">20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coverage Rate</span>
                    <span className="font-medium">87.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};