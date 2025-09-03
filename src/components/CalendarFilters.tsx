
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
  
  // Use original values for logic, translate only for display
  const doctors = [
    { value: 'All Doctors', label: t('calendar.filters.allDoctors') },
    { value: 'Dr. Sarah Johnson', label: 'Dr. Sarah Johnson' },
    { value: 'Dr. Michael Chen', label: 'Dr. Michael Chen' },
    { value: 'Dr. Emily Rodriguez', label: 'Dr. Emily Rodriguez' },
    { value: 'Dr. David Kim', label: 'Dr. David Kim' },
    { value: 'Dr. Lisa Thompson', label: 'Dr. Lisa Thompson' },
  ];

  const departments = [
    { value: 'All Departments', label: t('calendar.filters.allDepartments') },
    { value: 'Emergency Medicine', label: t('mocks.departments.emergencyMedicine') },
    { value: 'Cardiology', label: t('mocks.departments.cardiology') },
    { value: 'Neurology', label: t('mocks.departments.neurology') },
    { value: 'Pediatrics', label: t('mocks.departments.pediatrics') },
    { value: 'Radiology', label: t('mocks.departments.radiology') },
  ];

  const shiftTypes = [
    { value: 'All Shifts', label: t('calendar.filters.allShifts') },
    { value: 'Day Shift', label: t('mocks.shiftTypes.dayShift') },
    { value: 'Night Shift', label: t('mocks.shiftTypes.nightShift') },
    { value: 'Weekend', label: t('calendar.filters.weekend') },
    { value: 'Holiday', label: t('calendar.filters.holiday') },
  ];

  const hasActiveFilters = 
    selectedDoctor !== 'All Doctors' ||
    selectedDepartment !== 'All Departments' ||
    selectedShiftType !== 'All Shifts';

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
                <SelectItem key={doctor.value} value={doctor.value}>
                  {doctor.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-full min-w-[220px] sm:w-[180px]">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t('calendar.filters.selectDepartment')} />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department.value} value={department.value}>
                  {department.label}
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
                <SelectItem key={shiftType.value} value={shiftType.value}>
                  {shiftType.label}
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
