
import { Filter, Users, Building, Moon, Sun } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface CalendarFiltersProps {
  selectedDoctor: string;
  selectedDepartment: string;
  selectedShiftType: string;
  onDoctorChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onShiftTypeChange: (value: string) => void;
  onClearFilters: () => void;
}

const doctors = [
  "All Doctors",
  "Dr. Sarah Johnson",
  "Dr. Michael Chen",
  "Dr. Emily Rodriguez",
  "Dr. David Kim",
  "Dr. Lisa Thompson",
];

const departments = [
  "All Departments",
  "Emergency Medicine",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Radiology",
];

const shiftTypes = [
  "All Shifts",
  "Day Shift",
  "Night Shift",
  "Weekend",
  "Holiday",
];

export function CalendarFilters({
  selectedDoctor,
  selectedDepartment,
  selectedShiftType,
  onDoctorChange,
  onDepartmentChange,
  onShiftTypeChange,
  onClearFilters,
}: CalendarFiltersProps) {
  const { t } = useTranslation();
  const hasActiveFilters = 
    selectedDoctor !== t('calendar.filters.allDoctors') ||
    selectedDepartment !== t('calendar.filters.allDepartments') ||
    selectedShiftType !== t('calendar.filters.allShifts');

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{t('calendar.filters.title')}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Select value={selectedDoctor} onValueChange={onDoctorChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Users className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t('calendar.filters.selectDoctor')} />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor} value={doctor}>
                  {doctor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t('calendar.filters.selectDepartment')} />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedShiftType} onValueChange={onShiftTypeChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center">
                {selectedShiftType.includes("Night") ? (
                  <Moon className="h-4 w-4 mr-2" />
                ) : (
                  <Sun className="h-4 w-4 mr-2" />
                )}
                <SelectValue placeholder={t('calendar.filters.selectShiftType')} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {shiftTypes.map((shiftType) => (
                <SelectItem key={shiftType} value={shiftType}>
                  {shiftType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {[selectedDoctor, selectedDepartment, selectedShiftType]
                .filter((f) => !f.startsWith("All"))
                .length}{" "}
              {t('calendar.filters.active')}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              {t('calendar.filters.clearAll')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
