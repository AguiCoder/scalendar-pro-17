import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Play, 
  CheckCircle, 
  Upload, 
  RefreshCw, 
  Edit3, 
  AlertTriangle,
  Clock,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDrop } from "react-dnd";
import { DraggableShift } from "@/components/admin/DraggableShift";
import { useTranslation } from "react-i18next";

interface ScheduleShift {
  id: string;
  date: string;
  timeSlot: string;
  doctorId?: string;
  doctorName?: string;
  department: string;
  status: "unassigned" | "assigned" | "confirmed";
}

const mockScheduleData: ScheduleShift[] = [
  {
    id: "shift-1",
    date: "2024-01-15",
    timeSlot: "08:00-16:00",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Johnson",
    department: "Emergency Medicine",
    status: "assigned"
  },
  {
    id: "shift-2",
    date: "2024-01-15",
    timeSlot: "16:00-00:00",
    department: "Emergency Medicine",
    status: "unassigned"
  },
  {
    id: "shift-3",
    date: "2024-01-16",
    timeSlot: "00:00-08:00",
    doctorId: "doc-2",
    doctorName: "Dr. Michael Chen",
    department: "Neurology",
    status: "confirmed"
  }
];

const mockDoctors = [
  { id: "doc-1", name: "Dr. Sarah Johnson", department: "Emergency Medicine" },
  { id: "doc-2", name: "Dr. Michael Chen", department: "Neurology" },
  { id: "doc-3", name: "Dr. Emily Rodriguez", department: "Pediatrics" },
];

interface DroppableSlotProps {
  shift: ScheduleShift;
  onDrop: (shiftId: string, doctorId: string) => void;
}

const DroppableSlot = ({ shift, onDrop }: DroppableSlotProps) => {
  const { t } = useTranslation();
  const [{ isOver }, drop] = useDrop({
    accept: 'doctor',
    drop: (item: { doctorId: string }) => {
      onDrop(shift.id, item.doctorId);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`
        min-h-[60px] p-2 border-2 border-dashed rounded-lg transition-colors
        ${isOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
        ${shift.status === 'unassigned' ? 'bg-muted/20' : ''}
      `}
    >
      {shift.doctorName ? (
        <DraggableShift
          shiftId={shift.id}
          doctorId={shift.doctorId!}
          doctorName={shift.doctorName}
          timeSlot={shift.timeSlot}
          status={shift.status}
        />
      ) : (
        <div className="text-center text-muted-foreground text-sm">
          {t('admin.schedule.manual.table.dropHere')}
        </div>
      )}
    </div>
  );
};

export const ScheduleManagement = () => {
  const { t } = useTranslation();
  const [scheduleStatus, setScheduleStatus] = useState<"draft" | "published">("draft");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleShift[]>(mockScheduleData);
  const [selectedWeek, setSelectedWeek] = useState("2024-01-15");
  const { toast } = useToast();

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate schedule generation
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setScheduleStatus("draft");
          toast({
            title: t('admin.schedule.toasts.generatedTitle'),
            description: t('admin.schedule.toasts.generatedDesc')
          });
          return 100;
        }
        return prev + 20;
      });
    }, 500);
  };

  const handleValidateSchedule = async () => {
    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: t('admin.schedule.toasts.validatedTitle'),
      description: t('admin.schedule.toasts.validatedDesc')
    });
  };

  const handlePublishSchedule = async () => {
    // Simulate publishing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setScheduleStatus("published");
    toast({
      title: t('admin.schedule.toasts.publishedTitle'),
      description: t('admin.schedule.toasts.publishedDesc')
    });
  };

  const handleShiftDrop = (shiftId: string, doctorId: string) => {
    const doctor = mockDoctors.find(d => d.id === doctorId);
    if (!doctor) return;

    setScheduleData(prev => prev.map(shift => 
      shift.id === shiftId 
        ? { 
            ...shift, 
            doctorId, 
            doctorName: doctor.name, 
            status: "assigned" as const 
          }
        : shift
    ));

    toast({
      title: t('admin.schedule.toasts.assignedTitle'),
      description: t('admin.schedule.toasts.assignedDesc', { doctor: doctor.name })
    });
  };

  const unassignedShifts = scheduleData.filter(s => s.status === "unassigned").length;
  const assignedShifts = scheduleData.filter(s => s.status === "assigned").length;
  const confirmedShifts = scheduleData.filter(s => s.status === "confirmed").length;

  return (
    <div className="space-y-6">
      {/* Schedule Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('admin.schedule.title')}
          </CardTitle>
          <CardDescription>
            {t('admin.schedule.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('admin.schedule.statusCard.label')}</span>
                </div>
                <Badge 
                  variant={scheduleStatus === "published" ? "secondary" : "outline"}
                  className={
                    scheduleStatus === "published" 
                      ? "bg-status-confirmed text-status-confirmed-foreground"
                      : "bg-status-pending text-status-pending-foreground"
                  }
                >
                  {scheduleStatus === "published" ? t('admin.schedule.statusCard.published') : t('admin.schedule.statusCard.draft')}
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">{t('admin.schedule.statusCard.unassigned')}</span>
                </div>
                <p className="text-2xl font-bold text-destructive">{unassignedShifts}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-status-pending" />
                  <span className="text-sm font-medium">{t('admin.schedule.statusCard.assigned')}</span>
                </div>
                <p className="text-2xl font-bold text-status-pending">{assignedShifts}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-status-confirmed" />
                  <span className="text-sm font-medium">{t('admin.schedule.statusCard.confirmed')}</span>
                </div>
                <p className="text-2xl font-bold text-status-confirmed">{confirmedShifts}</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleGenerateSchedule}
              disabled={isGenerating}
            >
              <Play className="h-4 w-4 mr-2" />
              {isGenerating ? t('admin.schedule.actions.generating') : t('admin.schedule.actions.generate')}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleValidateSchedule}
              disabled={scheduleStatus === "published" || isGenerating}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {t('admin.schedule.actions.validate')}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handlePublishSchedule}
              disabled={scheduleStatus === "published" || unassignedShifts > 0}
            >
              <Upload className="h-4 w-4 mr-2" />
              {t('admin.schedule.actions.publish')}
            </Button>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('admin.schedule.progress.generating')}</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}

          {/* Warnings */}
          {unassignedShifts > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('admin.schedule.warnings.unassigned', { count: unassignedShifts })}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Manual Schedule Editor */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                              <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  {t('admin.schedule.manual.title')}
                </CardTitle>
                <CardDescription>
                  {t('admin.schedule.manual.subtitle')}
                </CardDescription>
            </div>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('admin.schedule.manual.selectWeek')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01-15">{t('admin.schedule.manual.weeks.2024-01-15')}</SelectItem>
                <SelectItem value="2024-01-22">{t('admin.schedule.manual.weeks.2024-01-22')}</SelectItem>
                <SelectItem value="2024-01-29">{t('admin.schedule.manual.weeks.2024-01-29')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Draggable Doctors */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('admin.schedule.manual.availableDoctors')}</h4>
            <div className="flex flex-wrap gap-2">
              {mockDoctors.map((doctor) => (
                <DraggableShift
                  key={doctor.id}
                  shiftId=""
                  doctorId={doctor.id}
                  doctorName={doctor.name}
                  timeSlot={doctor.department}
                  status="assigned"
                />
              ))}
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.schedule.manual.table.date')}</TableHead>
                  <TableHead>{t('admin.schedule.manual.table.timeSlot')}</TableHead>
                  <TableHead>{t('admin.schedule.manual.table.department')}</TableHead>
                  <TableHead>{t('admin.schedule.manual.table.assignedDoctor')}</TableHead>
                  <TableHead>{t('admin.schedule.manual.table.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleData.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-medium">{shift.date}</TableCell>
                    <TableCell>{shift.timeSlot}</TableCell>
                    <TableCell>{shift.department}</TableCell>
                    <TableCell>
                      <DroppableSlot shift={shift} onDrop={handleShiftDrop} />
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          shift.status === "confirmed" ? "secondary" :
                          shift.status === "assigned" ? "outline" : "destructive"
                        }
                        className={
                          shift.status === "confirmed" 
                            ? "bg-status-confirmed text-status-confirmed-foreground"
                            : shift.status === "assigned"
                            ? "bg-status-pending text-status-pending-foreground"
                            : ""
                        }
                      >
                        {shift.status === "confirmed" ? t('admin.schedule.statusCard.confirmed') :
                         shift.status === "assigned" ? t('admin.schedule.statusCard.assigned') : t('admin.schedule.statusCard.unassigned')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};