import { ArrowLeftRight, Plane, Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function QuickActions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleTradeRequest = () => {
    navigate("/trade-requests");
  };

  const handleLeaveRequest = () => {
    toast({
      title: t('dashboardComponents.quickActions.leave.toastTitle'),
      description: t('dashboardComponents.quickActions.leave.toastDescription'),
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
          {t('dashboardComponents.quickActions.title')}
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
            <div className="font-medium">{t('dashboardComponents.quickActions.trade.title')}</div>
            <div className="text-xs opacity-90">{t('dashboardComponents.quickActions.trade.subtitle')}</div>
          </div>
        </Button>

        <Button 
          onClick={handleLeaveRequest}
          className="w-full justify-start gap-3 h-12"
          variant="outline"
        >
          <Plane className="h-4 w-4" />
          <div className="text-left">
            <div className="font-medium">{t('dashboardComponents.quickActions.leave.title')}</div>
            <div className="text-xs text-muted-foreground">{t('dashboardComponents.quickActions.leave.subtitle')}</div>
          </div>
        </Button>

        <Button 
          onClick={handleViewSchedule}
          className="w-full justify-start gap-3 h-12"
          variant="ghost"
        >
          <Calendar className="h-4 w-4" />
          <div className="text-left">
            <div className="font-medium">{t('dashboardComponents.quickActions.schedule.title')}</div>
            <div className="text-xs text-muted-foreground">{t('dashboardComponents.quickActions.schedule.subtitle')}</div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}