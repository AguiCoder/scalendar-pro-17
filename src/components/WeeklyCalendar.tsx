
import { ShiftCard, type Shift } from "./ShiftCard";
import { Badge } from "@/components/ui/badge";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/dateLocale";

interface WeeklyCalendarProps {
  shifts: Shift[];
  currentDate: Date;
}

export function WeeklyCalendar({ shifts, currentDate }: WeeklyCalendarProps) {
  const { t } = useTranslation();
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const today = new Date();

  const getShiftsForDate = (date: Date) => {
    return shifts.filter(shift => isSameDay(new Date(shift.date), date));
  };

  return (
    <div className="space-y-4">
      {/* Mobile: Vertical list */}
      <div className="md:hidden space-y-2">
        {weekDays.map((day, index) => {
          const dayShifts = getShiftsForDate(day);
          const isToday = isSameDay(day, today);
          
          return (
            <div key={index} className="border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {format(day, "EEE", { locale: getDateFnsLocale() })}
                  </p>
                  <p className={`text-lg font-semibold ${
                    isToday ? "text-today-accent" : "text-foreground"
                  }`}>
                    {format(day, "d")}
                  </p>
                </div>
                {dayShifts.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {dayShifts.length === 1 ? t('calendar.counts.shifts_one', { count: dayShifts.length }) : t('calendar.counts.shifts_other', { count: dayShifts.length })}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                {dayShifts.length > 0 ? (
                  dayShifts.map((shift) => (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      date={format(day, "MMM d", { locale: getDateFnsLocale() })}
                      isToday={isToday}
                    />
                  ))
                ) : (
                  <ShiftCard
                    date={format(day, "MMM d", { locale: getDateFnsLocale() })}
                    isToday={isToday}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:block">
        <div className="compact-grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayShifts = getShiftsForDate(day);
            const isToday = isSameDay(day, today);
            
            return (
              <div key={index} className="space-y-2" role="gridcell" aria-label={`${format(day, "EEEE, MMMM d, yyyy", { locale: getDateFnsLocale() })}`}>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {format(day, "EEE", { locale: getDateFnsLocale() })}
                  </p>
                  <p className={`text-lg font-semibold ${
                    isToday ? "text-today-accent" : "text-foreground"
                  }`}>
                    {format(day, "d", { locale: getDateFnsLocale() })}
                  </p>
                </div>

                <div className="space-y-2 min-h-[120px]">
                  {dayShifts.length > 0 ? (
                    <>
                      {dayShifts.slice(0, 2).map((shift) => (
                        <ShiftCard
                          key={shift.id}
                          shift={shift}
                          date={format(day, "MMM d")}
                          isToday={isToday}
                        />
                      ))}
                      {dayShifts.length > 2 && (
                        <div className="text-center">
                          <Badge variant="outline" className="text-xs">
                            {t('calendar.counts.more', { count: dayShifts.length - 2 })}
                          </Badge>
                        </div>
                      )}
                    </>
                  ) : (
                    <ShiftCard
                      date={format(day, "MMM d")}
                      isToday={isToday}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
