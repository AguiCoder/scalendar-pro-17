import { format } from "date-fns";
import { Clock, MapPin, CheckCircle2, AlertCircle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Shift {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  department: string;
  status: "confirmed" | "pending" | "negotiation";
}

const mockUpcomingShifts: Shift[] = [
  {
    id: "1",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    startTime: "08:00",
    endTime: "16:00",
    department: "Emergency Department",
    status: "confirmed"
  },
  {
    id: "2", 
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    startTime: "20:00",
    endTime: "08:00",
    department: "ICU",
    status: "pending"
  },
  {
    id: "3",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    startTime: "12:00", 
    endTime: "20:00",
    department: "Cardiology",
    status: "negotiation"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
      return <CheckCircle2 className="h-4 w-4 text-status-confirmed" />;
    case "pending":
      return <AlertCircle className="h-4 w-4 text-status-pending" />;
    case "negotiation":
      return <Users className="h-4 w-4 text-status-negotiation" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "negotiation":
      return "outline";
    default:
      return "secondary";
  }
};

export function UpcomingShifts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Upcoming Shifts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          {mockUpcomingShifts.map((shift) => (
            <div 
              key={shift.id}
              className="shift-card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {format(shift.date, "EEEE, MMM d")}
                    </h3>
                    <Badge 
                      variant={getStatusVariant(shift.status)}
                      className="text-xs"
                    >
                      {shift.status}
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
                
                <Tooltip>
                  <TooltipTrigger>
                    {getStatusIcon(shift.status)}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{shift.status}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}