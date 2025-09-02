import { useDrag } from "react-dnd";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DraggableShiftProps {
  shiftId: string;
  doctorId: string;
  doctorName: string;
  timeSlot: string;
  status: "unassigned" | "assigned" | "confirmed";
}

export const DraggableShift = ({ 
  shiftId, 
  doctorId, 
  doctorName, 
  timeSlot, 
  status 
}: DraggableShiftProps) => {
  const { t } = useTranslation();
  const [{ isDragging }, drag] = useDrag({
    type: 'doctor',
    item: { doctorId, doctorName },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`
        p-2 rounded-md border cursor-move transition-all
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
        ${status === 'confirmed' ? 'bg-status-confirmed-light border-status-confirmed' : 
          status === 'assigned' ? 'bg-status-pending-light border-status-pending' : 
          'bg-muted border-muted-foreground'}
        hover:shadow-md
      `}
    >
      <div className="flex items-center gap-2">
        <User className="h-3 w-3" />
        <div className="flex-1">
          <div className="text-sm font-medium">{doctorName}</div>
          <div className="text-xs text-muted-foreground">{timeSlot}</div>
        </div>
        <Badge 
          variant="outline" 
          className={
            status === 'confirmed' ? 'bg-status-confirmed text-status-confirmed-foreground' :
            status === 'assigned' ? 'bg-status-pending text-status-pending-foreground' :
            ''
          }
        >
          {t(`admin.draggable.status.${status}`)}
        </Badge>
      </div>
    </div>
  );
};