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
import { useTranslation } from "react-i18next";

interface TradeStatusStepperProps {
  currentStatus: "requested" | "offered" | "accepted" | "approved";
}

const steps = [
  {
    key: "requested",
    label: "trade.statusCard.steps.requested.label",
    description: "trade.statusCard.steps.requested.description",
    icon: Clock,
  },
  {
    key: "offered",
    label: "trade.statusCard.steps.offered.label",
    description: "trade.statusCard.steps.offered.description",
    icon: UserCheck,
  },
  {
    key: "accepted",
    label: "trade.statusCard.steps.accepted.label",
    description: "trade.statusCard.steps.accepted.description",
    icon: CheckCircle,
  },
  {
    key: "approved",
    label: "trade.statusCard.steps.approved.label",
    description: "trade.statusCard.steps.approved.description",
    icon: Shield,
  },
] as const;

export function TradeStatusStepper({ currentStatus }: TradeStatusStepperProps) {
  const { t } = useTranslation();
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
            {t('trade.statusCard.badges.completed')}
          </Badge>
        );
      case "current":
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {t('trade.statusCard.badges.current')}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            {t('trade.statusCard.badges.pending')}
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('trade.statusCard.title')}</CardTitle>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {t('trade.statusCard.stepCounter', { current: currentStepIndex + 1, total: steps.length })}
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
                      {t(step.label)}
                    </h4>
                    {getStatusBadge(status)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {t(step.description)}
                  </p>
                  
                  {status === "current" && (
                    <div className="text-xs text-primary bg-primary/5 p-2 rounded border border-primary/20">
                      {step.key === "requested" && t('trade.statusCard.stepMessages.requested')}
                      {step.key === "offered" && t('trade.statusCard.stepMessages.offered')}
                      {step.key === "accepted" && t('trade.statusCard.stepMessages.accepted')}
                      {step.key === "approved" && t('trade.statusCard.stepMessages.approved')}
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