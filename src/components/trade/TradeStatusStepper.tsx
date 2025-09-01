import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  UserCheck, 
  CheckCircle, 
  Shield,
  Circle
} from "lucide-react";

interface TradeStatusStepperProps {
  currentStatus: "requested" | "offered" | "accepted" | "approved";
}

const steps = [
  {
    key: "requested",
    label: "Requested",
    description: "Trade request submitted",
    icon: Clock,
  },
  {
    key: "offered",
    label: "Offered",
    description: "Colleague responded with interest",
    icon: UserCheck,
  },
  {
    key: "accepted",
    label: "Accepted",
    description: "Both parties agreed to trade",
    icon: CheckCircle,
  },
  {
    key: "approved",
    label: "Approved",
    description: "Administration approved the trade",
    icon: Shield,
  },
] as const;

export function TradeStatusStepper({ currentStatus }: TradeStatusStepperProps) {
  const currentStepIndex = steps.findIndex(step => step.key === currentStatus);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "current";
    return "pending";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-status-confirmed";
      case "current":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-status-confirmed-light text-status-confirmed border-status-confirmed/20">
            Completed
          </Badge>
        );
      case "current":
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Current
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Pending
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Request Status</CardTitle>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const Icon = step.icon;
            
            return (
              <div
                key={step.key}
                className={`flex items-start gap-4 ${
                  status === "current" ? "scale-105" : ""
                } transition-transform`}
              >
                <div className={`mt-1 ${getStatusColor(status)}`}>
                  {status === "completed" ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : status === "current" ? (
                    <Icon className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${getStatusColor(status)}`}>
                      {step.label}
                    </h4>
                    {getStatusBadge(status)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  
                  {status === "current" && (
                    <div className="text-xs text-primary bg-primary/5 p-2 rounded border border-primary/20">
                      {step.key === "requested" && "Waiting for colleague responses..."}
                      {step.key === "offered" && "Review the offer and accept if suitable."}
                      {step.key === "accepted" && "Pending administration approval."}
                      {step.key === "approved" && "Trade completed successfully!"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}