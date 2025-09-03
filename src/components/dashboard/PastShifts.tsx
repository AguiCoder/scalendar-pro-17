import { format } from "date-fns";
import { Clock, MapPin, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/dateLocale";

interface PastShift {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  department: string;
  shiftType: string;
}

export function PastShifts() {
  const { t } = useTranslation();
  
  // Mock data with translations
  const mockPastShifts: PastShift[] = [
    {
      id: "1",
      date: new Date(2025, 7, 2), // August 2, 2025
      startTime: "08:00",
      endTime: "14:00",
      department: t('mocks.departments.radiology'),
      shiftType: t('mocks.shiftTypes.holidayShift')
    },
    {
      id: "2",
      date: new Date(2025, 7, 2), // August 2, 2025
      startTime: "14:00",
      endTime: "20:00",
      department: t('mocks.departments.radiology'),
      shiftType: t('mocks.shiftTypes.weekendShift')
    },
    {
      id: "3",
      date: new Date(2025, 7, 2), // August 2, 2025
      startTime: "14:00",
      endTime: "20:00",
      department: t('mocks.departments.emergencyMedicine'),
      shiftType: t('mocks.shiftTypes.weekendShift')
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          {t('dashboardComponents.pastShifts.title')} ({mockPastShifts.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('dashboardComponents.pastShifts.subtitle')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockPastShifts.map((shift) => (
          <div 
            key={shift.id}
            className="shift-card p-4 hover:shadow-md transition-shadow border rounded-lg"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {format(shift.date, "d 'de' MMMM 'de' yyyy", { locale: getDateFnsLocale() })}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {shift.shiftType}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {shift.startTime} - {shift.endTime}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {shift.department}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
