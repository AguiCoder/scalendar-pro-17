import { useState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { DayAvailability, TimeRange } from "@/types/preferences";

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

const initialAvailability: DayAvailability[] = DAYS.map(day => ({
  day: day.key,
  isAvailable: day.key !== 'saturday' && day.key !== 'sunday',
  timeRanges: day.key !== 'saturday' && day.key !== 'sunday' 
    ? [{ id: '1', start: '08:00', end: '17:00' }] 
    : []
}));

export function AvailabilitySection() {
  const [availability, setAvailability] = useState<DayAvailability[]>(initialAvailability);

  const updateDayAvailability = (dayKey: string, isAvailable: boolean) => {
    setAvailability(prev => prev.map(day => 
      day.day === dayKey 
        ? { ...day, isAvailable, timeRanges: isAvailable ? day.timeRanges : [] }
        : day
    ));
  };

  const addTimeRange = (dayKey: string) => {
    const newTimeRange: TimeRange = {
      id: Date.now().toString(),
      start: '09:00',
      end: '17:00'
    };

    setAvailability(prev => prev.map(day => 
      day.day === dayKey 
        ? { ...day, timeRanges: [...day.timeRanges, newTimeRange] }
        : day
    ));
  };

  const updateTimeRange = (dayKey: string, rangeId: string, field: 'start' | 'end', value: string) => {
    setAvailability(prev => prev.map(day => 
      day.day === dayKey 
        ? {
            ...day, 
            timeRanges: day.timeRanges.map(range => 
              range.id === rangeId ? { ...range, [field]: value } : range
            )
          }
        : day
    ));
  };

  const removeTimeRange = (dayKey: string, rangeId: string) => {
    setAvailability(prev => prev.map(day => 
      day.day === dayKey 
        ? { ...day, timeRanges: day.timeRanges.filter(range => range.id !== rangeId) }
        : day
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Weekly Availability
        </CardTitle>
        <CardDescription>
          Set your available days and time ranges for scheduling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="space-y-4">
            {availability.map((day) => {
              const dayLabel = DAYS.find(d => d.key === day.day)?.label || '';
              
              return (
                <div key={day.day} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3 min-w-[120px]">
                    <Switch
                      checked={day.isAvailable}
                      onCheckedChange={(checked) => updateDayAvailability(day.day, checked)}
                      aria-label={`Toggle ${dayLabel} availability`}
                    />
                    <Label className="font-medium">{dayLabel}</Label>
                  </div>
                  
                  <div className="flex-1">
                    {day.isAvailable && (
                      <div className="space-y-2">
                        {day.timeRanges.map((range) => (
                          <div key={range.id} className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={range.start}
                              onChange={(e) => updateTimeRange(day.day, range.id, 'start', e.target.value)}
                              className="w-32"
                            />
                            <span className="text-muted-foreground">to</span>
                            <Input
                              type="time"
                              value={range.end}
                              onChange={(e) => updateTimeRange(day.day, range.id, 'end', e.target.value)}
                              className="w-32"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeRange(day.day, range.id)}
                              disabled={day.timeRanges.length === 1}
                              aria-label="Remove time range"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeRange(day.day)}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Add time range
                        </Button>
                      </div>
                    )}
                    {!day.isAvailable && (
                      <p className="text-sm text-muted-foreground">Not available</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <Accordion type="multiple" className="space-y-2">
            {availability.map((day) => {
              const dayLabel = DAYS.find(d => d.key === day.day)?.label || '';
              
              return (
                <AccordionItem key={day.day} value={day.day} className="border border-border rounded-lg">
                  <AccordionTrigger className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={day.isAvailable}
                        onCheckedChange={(checked) => updateDayAvailability(day.day, checked)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Toggle ${dayLabel} availability`}
                      />
                      <span className="font-medium">{dayLabel}</span>
                      {day.isAvailable && (
                        <span className="text-sm text-muted-foreground">
                          ({day.timeRanges.length} range{day.timeRanges.length !== 1 ? 's' : ''})
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    {day.isAvailable && (
                      <div className="space-y-3">
                        {day.timeRanges.map((range) => (
                          <div key={range.id} className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs text-muted-foreground">Start</Label>
                                <Input
                                  type="time"
                                  value={range.start}
                                  onChange={(e) => updateTimeRange(day.day, range.id, 'start', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">End</Label>
                                <Input
                                  type="time"
                                  value={range.end}
                                  onChange={(e) => updateTimeRange(day.day, range.id, 'end', e.target.value)}
                                />
                              </div>
                            </div>
                            {day.timeRanges.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeTimeRange(day.day, range.id)}
                                className="w-full flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeRange(day.day)}
                          className="w-full flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Add time range
                        </Button>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}