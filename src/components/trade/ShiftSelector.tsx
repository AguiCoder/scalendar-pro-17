import { useState } from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shift } from "@/components/ShiftCard";
import { mockShifts } from "@/data/mockShifts";
import { format, parseISO } from "date-fns";

interface ShiftSelectorProps {
  selectedShift: Shift | null;
  onShiftSelect: (shift: Shift) => void;
}

export function ShiftSelector({ selectedShift, onShiftSelect }: ShiftSelectorProps) {
  // Filter for assigned shifts only (has doctorName)
  const assignedShifts = mockShifts.filter(shift => shift.doctorName);

  const getStatusBadge = (status: Shift["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="secondary" className="bg-status-confirmed-light text-status-confirmed border-status-confirmed/20">
            Confirmed
          </Badge>
        );
      case "available":
        return (
          <Badge variant="secondary" className="bg-status-available-light text-status-available border-status-available/20">
            Available for Trade
          </Badge>
        );
      case "negotiation":
        return (
          <Badge variant="secondary" className="bg-status-negotiation-light text-status-negotiation border-status-negotiation/20">
            In Negotiation
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Select Shift to Trade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedShifts.slice(0, 8).map((shift) => (
            <TooltipProvider key={shift.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedShift?.id === shift.id 
                        ? "ring-2 ring-primary border-primary bg-primary/5" 
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => onShiftSelect(shift)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">
                          {format(parseISO(shift.date), "MMM dd, yyyy")}
                        </p>
                        {getStatusBadge(shift.status)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {shift.doctorName}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {shift.startTime} - {shift.endTime}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground truncate">
                            {shift.department}
                          </p>
                        </div>
                      </div>

                      {selectedShift?.id === shift.id && (
                        <div className="pt-2 border-t">
                          <Button size="sm" className="w-full">
                            Selected for Trade
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-medium">{shift.shiftType}</p>
                    <p className="text-xs">{shift.department}</p>
                    {shift.location && (
                      <p className="text-xs">Location: {shift.location}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {assignedShifts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No assigned shifts available for trade</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}