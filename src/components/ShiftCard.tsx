
import { Clock, User, MapPin, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  doctorName?: string;
  department: string;
  shiftType: "Day Shift" | "Night Shift" | "Weekend" | "Holiday";
  status: "confirmed" | "available" | "negotiation";
  location?: string;
}

interface ShiftCardProps {
  shift?: Shift;
  date: string;
  isToday?: boolean;
}

export function ShiftCard({ shift, date, isToday }: ShiftCardProps) {
  if (!shift) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="shift-card empty">
              <div className="text-center text-muted-foreground">
                <p className="text-xs font-medium mb-1">{date}</p>
                <p className="text-[10px] opacity-60">No shifts</p>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to assign a shift for {date}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const getStatusBadge = (status: Shift["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="secondary" className="bg-status-confirmed-light text-status-confirmed border-status-confirmed/20 text-xs">
            Confirmed
          </Badge>
        );
      case "available":
        return (
          <Badge variant="secondary" className="bg-status-available-light text-status-available border-status-available/20 text-xs">
            Available
          </Badge>
        );
      case "negotiation":
        return (
          <Badge variant="secondary" className="bg-status-negotiation-light text-status-negotiation border-status-negotiation/20 text-xs">
            Negotiation
          </Badge>
        );
    }
  };

  const getCardClassName = () => {
    let className = "shift-card";
    if (isToday) {
      className += " today";
    }
    return `${className} ${shift.status}`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={getCardClassName()}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{date}</p>
                <div className="flex items-center gap-1">
                  {getStatusBadge(shift.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted/50">
                        <MoreHorizontal className="h-3 w-3" />
                        <span className="sr-only">Open shift actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem>
                        Request Trade
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Mark Unavailable
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <p className="text-sm font-medium truncate">
                    {shift.doctorName || "Unassigned"}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" aria-label="Shift time" />
                  <p className="text-xs text-muted-foreground">
                    {shift.startTime} - {shift.endTime}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" aria-label="Department" />
                  <p className="text-xs text-muted-foreground truncate">
                    {shift.department}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{shift.doctorName || "Unassigned Shift"}</p>
            <p className="text-xs">
              {shift.shiftType} • {shift.startTime} - {shift.endTime}
            </p>
            <p className="text-xs">{shift.department}</p>
            {shift.location && (
              <p className="text-xs">Location: {shift.location}</p>
            )}
            <p className="text-xs">Status: {shift.status}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
