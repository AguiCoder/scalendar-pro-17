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
          Drop doctor here
        </div>
      )}
    </div>
  );
};

export const ScheduleManagement = () => {
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
            title: "Schedule generated successfully",
            description: "Review and validate the schedule before publishing"
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
      title: "Schedule validated",
      description: "All constraints satisfied. Ready to publish."
    });
  };

  const handlePublishSchedule = async () => {
    // Simulate publishing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setScheduleStatus("published");
    toast({
      title: "Schedule published",
      description: "Notifications sent to all assigned doctors"
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
      title: "Shift assigned",
      description: `${doctor.name} assigned to shift`
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
            Schedule Management
          </CardTitle>
          <CardDescription>
            Generate, validate, and publish medical staff schedules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <Badge 
                  variant={scheduleStatus === "published" ? "secondary" : "outline"}
                  className={
                    scheduleStatus === "published" 
                      ? "bg-status-confirmed text-status-confirmed-foreground"
                      : "bg-status-pending text-status-pending-foreground"
                  }
                >
                  {scheduleStatus === "published" ? "Published" : "Draft"}
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Unassigned</span>
                </div>
                <p className="text-2xl font-bold text-destructive">{unassignedShifts}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-status-pending" />
                  <span className="text-sm font-medium">Assigned</span>
                </div>
                <p className="text-2xl font-bold text-status-pending">{assignedShifts}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-status-confirmed" />
                  <span className="text-sm font-medium">Confirmed</span>
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
              {isGenerating ? "Generating..." : "Generate Schedule"}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleValidateSchedule}
              disabled={scheduleStatus === "published" || isGenerating}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate
            </Button>
            
            <Button 
              variant="outline"
              onClick={handlePublishSchedule}
              disabled={scheduleStatus === "published" || unassignedShifts > 0}
            >
              <Upload className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating optimal schedule...</span>
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
                {unassignedShifts} shifts are still unassigned. Complete assignments before publishing.
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
                Manual Schedule Editor
              </CardTitle>
              <CardDescription>
                Drag and drop doctors to assign shifts manually
              </CardDescription>
            </div>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01-15">Week of Jan 15, 2024</SelectItem>
                <SelectItem value="2024-01-22">Week of Jan 22, 2024</SelectItem>
                <SelectItem value="2024-01-29">Week of Jan 29, 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Draggable Doctors */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Available Doctors</h4>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Assigned Doctor</TableHead>
                  <TableHead>Status</TableHead>
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
                        {shift.status === "confirmed" ? "Confirmed" :
                         shift.status === "assigned" ? "Assigned" : "Unassigned"}
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