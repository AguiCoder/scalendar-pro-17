
import { ShiftCard, type Shift } from "./ShiftCard";
import { Badge } from "@/components/ui/badge";
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, isSameMonth } from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/dateLocale";

interface MonthlyCalendarProps {
  shifts: Shift[];
  currentDate: Date;
}

export function MonthlyCalendar({ shifts, currentDate }: MonthlyCalendarProps) {
  const { t } = useTranslation();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = calendarStart;

  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const today = new Date();

  const getShiftsForDate = (date: Date) => {
    return shifts.filter(shift => isSameDay(new Date(shift.date), date));
  };

  return (
    <div className="space-y-4">
      {/* Mobile: Vertical list */}
      <div className="md:hidden space-y-2">
        {days.map((day, index) => {
          const dayShifts = getShiftsForDate(day);
          const isToday = isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          if (!isCurrentMonth) return null; // Skip days outside current month on mobile
          
          return (
            <div key={index} className="border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {format(day, "EEE d", { locale: getDateFnsLocale() })}
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

      {/* Desktop: Full calendar grid */}
      <div className="hidden md:block">
        {/* Week day headers */}
        <div className="compact-grid grid-cols-7 gap-2 mb-4">
          {[t('calendar.weekdays.mon'), t('calendar.weekdays.tue'), t('calendar.weekdays.wed'), t('calendar.weekdays.thu'), t('calendar.weekdays.fri'), t('calendar.weekdays.sat'), t('calendar.weekdays.sun')].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-muted-foreground p-2 bg-muted/30 rounded-md">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="compact-grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayShifts = getShiftsForDate(day);
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div 
                key={index} 
                className={`min-h-[100px] space-y-1 ${!isCurrentMonth ? 'opacity-40' : ''}`}
                role="gridcell" 
                aria-label={`${format(day, "EEEE, MMMM d, yyyy", { locale: getDateFnsLocale() })}`}
              >
                <div className="text-center mb-1">
                  <p className={`text-sm font-medium ${
                    isToday ? "text-today-accent font-bold" : 
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {format(day, "d", { locale: getDateFnsLocale() })}
                  </p>
                </div>
                
                {dayShifts.length > 0 ? (
                  <>
                    {dayShifts.slice(0, 1).map((shift) => (
                      <ShiftCard
                        key={shift.id}
                        shift={shift}
                        date={format(day, "d", { locale: getDateFnsLocale() })}
                        isToday={isToday}
                      />
                    ))}
                    {dayShifts.length > 1 && (
                      <div className="text-center">
                        <Badge variant="outline" className="text-[10px] py-0 px-1">
                          {t('calendar.counts.more', { count: dayShifts.length - 1 })}
                        </Badge>
                      </div>
                    )}
                  </>
                ) : isCurrentMonth ? (
                  <ShiftCard
                    date={format(day, "d", { locale: getDateFnsLocale() })}
                    isToday={isToday}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
