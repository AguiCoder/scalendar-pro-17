import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2, Plane } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Vacation } from "@/types/preferences";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/dateLocale";

const VACATION_TYPES = [
  { value: 'vacation', label: 'Vacation', color: 'bg-status-vacation' },
  { value: 'sick_leave', label: 'Sick Leave', color: 'bg-status-negotiation' },
  { value: 'personal', label: 'Personal Time', color: 'bg-status-available' },
  { value: 'conference', label: 'Conference', color: 'bg-status-confirmed' },
] as const;

const initialVacations: Vacation[] = [
  {
    id: '1',
    startDate: new Date('2025-03-15'),
    endDate: new Date('2025-03-22'),
    description: 'Spring vacation',
    type: 'vacation'
  },
  {
    id: '2',
    startDate: new Date('2025-07-10'),
    endDate: new Date('2025-07-17'),
    description: 'Summer family trip',
    type: 'vacation'
  }
];

export function VacationsSection() {
  const { t } = useTranslation();
  const [vacations, setVacations] = useState<Vacation[]>(initialVacations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Vacation['type']>('vacation');

  const handleAddVacation = () => {
    if (!startDate || !endDate || !description.trim()) return;

    const newVacation: Vacation = {
      id: Date.now().toString(),
      startDate,
      endDate,
      description: description.trim(),
      type
    };

    setVacations(prev => [...prev, newVacation]);
    
    // Reset form
    setStartDate(undefined);
    setEndDate(undefined);
    setDescription('');
    setType('vacation');
    setIsDialogOpen(false);
  };

  const handleRemoveVacation = (id: string) => {
    setVacations(prev => prev.filter(vacation => vacation.id !== id));
  };

  const getVacationTypeInfo = (type: Vacation['type']) => {
    return VACATION_TYPES.find(t => t.value === type) || VACATION_TYPES[0];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              {t('preferences.vacations.title')}
            </CardTitle>
            <CardDescription>
              {t('preferences.vacations.subtitle')}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('preferences.vacations.add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t('preferences.vacations.dialog.title')}</DialogTitle>
                <DialogDescription>
                  {t('preferences.vacations.dialog.description')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">{t('preferences.vacations.dialog.startDate')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP", { locale: getDateFnsLocale() }) : t('preferences.vacations.dialog.pickDate')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="end-date">{t('preferences.vacations.dialog.endDate')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP", { locale: getDateFnsLocale() }) : t('preferences.vacations.dialog.pickDate')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => startDate ? date < startDate : false}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="type">{t('preferences.vacations.dialog.type')}</Label>
                  <Select value={type} onValueChange={(value: Vacation['type']) => setType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VACATION_TYPES.map((vacationType) => (
                        <SelectItem key={vacationType.value} value={vacationType.value}>
                          {vacationType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">{t('preferences.vacations.dialog.descriptionLabel')}</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('preferences.vacations.dialog.descriptionPlaceholder')}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('preferences.vacations.dialog.cancel')}
                </Button>
                <Button 
                  onClick={handleAddVacation}
                  disabled={!startDate || !endDate || !description.trim()}
                >
                  {t('preferences.vacations.dialog.confirm')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {vacations.length === 0 ? (
          <div className="text-center py-8">
            <Plane className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">{t('preferences.vacations.empty.title')}</h3>
            <p className="text-muted-foreground">{t('preferences.vacations.empty.subtitle')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vacations.map((vacation) => {
              const typeInfo = getVacationTypeInfo(vacation.type);
              const duration = Math.ceil((vacation.endDate.getTime() - vacation.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
              
              return (
                <div key={vacation.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", typeInfo.color)} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{vacation.description}</span>
                        <Badge variant="secondary" className="text-xs">
                          {typeInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('preferences.vacations.range', { start: format(vacation.startDate, 'PP', { locale: getDateFnsLocale() }), end: format(vacation.endDate, 'PP', { locale: getDateFnsLocale() }) })} ({duration} {duration === 1 ? t('preferences.vacations.day') : t('preferences.vacations.days')})
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveVacation(vacation.id)}
                    aria-label={t('preferences.vacations.ariaRemove')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}