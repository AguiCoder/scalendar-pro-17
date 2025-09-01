import { ArrowLeftRight, Plane, Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function QuickActions() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTradeRequest = () => {
    navigate("/trade-requests");
  };

  const handleLeaveRequest = () => {
    toast({
      title: "Leave Request",
      description: "Redirecting to leave request form...",
    });
    // Would navigate to leave request page when implemented
  };

  const handleViewSchedule = () => {
    navigate("/");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={handleTradeRequest}
          className="w-full justify-start gap-3 h-12"
          variant="default"
        >
          <ArrowLeftRight className="h-4 w-4" />
          <div className="text-left">
            <div className="font-medium">Request Shift Trade</div>
            <div className="text-xs opacity-90">Find someone to cover your shift</div>
          </div>
        </Button>

        <Button 
          onClick={handleLeaveRequest}
          className="w-full justify-start gap-3 h-12"
          variant="outline"
        >
          <Plane className="h-4 w-4" />
          <div className="text-left">
            <div className="font-medium">Request Leave</div>
            <div className="text-xs text-muted-foreground">Submit vacation or time off</div>
          </div>
        </Button>

        <Button 
          onClick={handleViewSchedule}
          className="w-full justify-start gap-3 h-12"
          variant="ghost"
        >
          <Calendar className="h-4 w-4" />
          <div className="text-left">
            <div className="font-medium">View Full Schedule</div>
            <div className="text-xs text-muted-foreground">See all upcoming shifts</div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}