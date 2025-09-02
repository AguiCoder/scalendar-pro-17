import { format } from "date-fns";
import { Bell, ArrowLeftRight, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/dateLocale";

interface Alert {
  id: string;
  type: "trade_request" | "schedule_published" | "last_minute_change" | "approval_needed";
  title: string;
  description: string;
  timestamp: Date;
  priority: "high" | "medium" | "low";
  actionable: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "trade_request",
    title: "Trade Request Pending",
    description: "Dr. Sarah Miller wants to trade your Dec 15th shift",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    priority: "high",
    actionable: true
  },
  {
    id: "2",
    type: "schedule_published",
    title: "January Schedule Published",
    description: "Your schedule for January 2024 is now available",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    priority: "medium",
    actionable: false
  },
  {
    id: "3",
    type: "last_minute_change",
    title: "Shift Change Required",
    description: "Emergency coverage needed for ICU Dec 12th, 2-10 PM",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    priority: "high",
    actionable: true
  },
  {
    id: "4",
    type: "approval_needed",
    title: "Leave Request Approved",
    description: "Your vacation request for Dec 20-25 has been approved",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    priority: "low",
    actionable: false
  }
];

const getAlertIcon = (type: string) => {
  switch (type) {
    case "trade_request":
      return <ArrowLeftRight className="h-4 w-4 text-status-pending" />;
    case "schedule_published":
      return <Calendar className="h-4 w-4 text-status-available" />;
    case "last_minute_change":
      return <AlertTriangle className="h-4 w-4 text-status-vacation" />;
    case "approval_needed":
      return <CheckCircle className="h-4 w-4 text-status-confirmed" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-status-vacation";
    case "medium":
      return "text-status-pending";
    case "low":
      return "text-status-confirmed";
    default:
      return "text-muted-foreground";
  }
};

export function AlertsSection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAlertClick = (alert: Alert) => {
    if (alert.type === "trade_request") {
      navigate("/trade-requests");
    } else if (alert.type === "schedule_published") {
      navigate("/");
    } else {
      toast({
        title: t('dashboardComponents.alerts.toastTitle'),
        description: alert.description,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          {t('dashboardComponents.alerts.title')}
          <Badge variant="secondary" className="ml-auto">
            {mockAlerts.filter(a => a.actionable).length} {t('dashboardComponents.alerts.actionable')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3" role="region" aria-live="polite" aria-label={t('dashboardComponents.alerts.ariaLabel')}>
          {mockAlerts.map((alert) => (
            <div 
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => handleAlertClick(alert)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleAlertClick(alert);
                }
              }}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-foreground truncate">
                    {alert.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                      {t(`dashboardComponents.alerts.priority.${alert.priority}`)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(alert.timestamp, "PP p", { locale: getDateFnsLocale() })}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {alert.description}
                </p>
                {alert.actionable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 h-7 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAlertClick(alert);
                    }}
                  >
                    {t('dashboardComponents.alerts.takeAction')}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}