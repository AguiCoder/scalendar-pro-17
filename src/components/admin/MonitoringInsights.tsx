import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  
  // Mock data with translations
  const coverageGaps = [
    {
      date: "2024-01-20",
      timeSlot: "22:00-06:00",
      department: t('mocks.departments.emergencyMedicine'),
      priority: "High",
      duration: "8 hours"
    },
    {
      date: "2024-01-22",
      timeSlot: "14:00-22:00", 
      department: t('mocks.departments.cardiology'),
      priority: "Medium",
      duration: "8 hours"
    },
    {
      date: "2024-01-25",
      timeSlot: "06:00-14:00",
      department: t('mocks.departments.neurology'), 
      priority: "Low",
      duration: "8 hours"
    }
  ];

  // Mock fairness statistics
  const fairnessData = [
    {
      doctorName: t('mocks.doctors.sarahJohnson'),
      nightShifts: 8,
      weekendShifts: 6,
      totalShifts: 24,
      fairnessScore: 85
    },
    {
      doctorName: t('mocks.doctors.michaelChen'),
      nightShifts: 12,
      weekendShifts: 8,
      totalShifts: 28,
      fairnessScore: 72
    },
    {
      doctorName: t('mocks.doctors.emilyRodriguez'),
      nightShifts: 6,
      weekendShifts: 4,
      totalShifts: 20,
      fairnessScore: 92
    },
    {
      doctorName: t('mocks.doctors.davidKim'),
      nightShifts: 10,
      weekendShifts: 7,
      totalShifts: 26,
      fairnessScore: 78
    }
  ];

  // Chart data for shift distribution
  const shiftDistributionData = [
    { name: t('mocks.doctors.sarahJohnson'), nightShifts: 8, weekendShifts: 6, totalShifts: 24 },
    { name: t('mocks.doctors.michaelChen'), nightShifts: 12, weekendShifts: 8, totalShifts: 28 },
    { name: t('mocks.doctors.emilyRodriguez'), nightShifts: 6, weekendShifts: 4, totalShifts: 20 },
    { name: t('mocks.doctors.davidKim'), nightShifts: 10, weekendShifts: 7, totalShifts: 26 }
  ];
  
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
              <span className="text-sm font-medium">{t('admin.monitoring.gaps.title')}</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{totalGaps}</p>
            <p className="text-xs text-muted-foreground">{t('admin.monitoring.overview.highPriority', { count: highPriorityGaps })}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-status-confirmed" />
              <span className="text-sm font-medium">{t('admin.monitoring.overview.coverageRate')}</span>
            </div>
            <p className="text-2xl font-bold text-status-confirmed">87%</p>
            <p className="text-xs text-muted-foreground">{t('admin.monitoring.overview.thisMonth')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-status-pending" />
              <span className="text-sm font-medium">{t('admin.monitoring.overview.avgFairness')}</span>
            </div>
            <p className="text-2xl font-bold text-status-pending">{averageFairness}%</p>
            <p className="text-xs text-muted-foreground">{t('admin.monitoring.overview.thisPeriod')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t('admin.monitoring.overview.activeDoctors')}</span>
            </div>
            <p className="text-2xl font-bold">{fairnessData.length}</p>
            <p className="text-xs text-muted-foreground">{t('admin.monitoring.overview.thisPeriod')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t('admin.monitoring.gaps.title')}
          </CardTitle>
          <CardDescription>
            {t('admin.monitoring.gaps.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.monitoring.gaps.table.date')}</TableHead>
                  <TableHead>{t('admin.monitoring.gaps.table.timeSlot')}</TableHead>
                  <TableHead>{t('admin.monitoring.gaps.table.department')}</TableHead>
                  <TableHead>{t('admin.monitoring.gaps.table.duration')}</TableHead>
                  <TableHead>{t('admin.monitoring.gaps.table.priority')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coverageGaps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {t('admin.monitoring.gaps.table.none')}
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
            {t('admin.monitoring.fairness.title')}
          </CardTitle>
          <CardDescription>
            {t('admin.monitoring.fairness.subtitle')}
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
                    <div>{t('admin.monitoring.fairness.night')}: {doctor.nightShifts}</div>
                    <div>{t('admin.monitoring.fairness.weekend')}: {doctor.weekendShifts}</div>
                    <div>{t('admin.monitoring.fairness.total')}: {doctor.totalShifts}</div>
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
            {t('admin.monitoring.distribution.title')}
          </CardTitle>
          <CardDescription>
            {t('admin.monitoring.distribution.subtitle')}
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
                  name={t('admin.monitoring.distribution.legend.nightShifts')}
                />
                <Bar 
                  dataKey="weekendShifts" 
                  fill="hsl(var(--status-pending))" 
                  name={t('admin.monitoring.distribution.legend.weekendShifts')}
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
            {t('admin.monitoring.coverage.title')}
          </CardTitle>
          <CardDescription>
            {t('admin.monitoring.coverage.subtitle')}
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
                <h4 className="font-medium mb-2">{t('admin.monitoring.coverage.metrics.coverageMetrics')}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t('admin.monitoring.coverage.metrics.totalShifts')}</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('admin.monitoring.coverage.metrics.coveredShifts')}</span>
                    <span className="font-medium text-status-confirmed">136</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('admin.monitoring.coverage.metrics.coverageGaps')}</span>
                    <span className="font-medium text-destructive">20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('admin.monitoring.coverage.metrics.coverageRate')}</span>
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