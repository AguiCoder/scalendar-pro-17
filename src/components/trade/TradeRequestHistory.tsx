import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { 
  MoreHorizontal, 
  Eye, 
  X, 
  RefreshCw,
  History
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface TradeRequest {
  id: string;
  shiftDate: string;
  shiftTime: string;
  department: string;
  colleagueInvolved?: string;
  status: "requested" | "offered" | "accepted" | "approved" | "cancelled" | "rejected";
  createdAt: string;
  reason: string;
}

export function TradeRequestHistory() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const mockTradeRequests: TradeRequest[] = [
    {
      id: "tr-001",
      shiftDate: "2024-12-15",
      shiftTime: "08:00 - 14:00",
      department: t('mocks.departments.emergencyMedicine'),
      colleagueInvolved: t('mocks.doctors.sarahJohnson'),
      status: "accepted",
      createdAt: "2024-12-10T10:30:00Z",
      reason: "Family emergency - need to attend my child's school event"
    },
    {
      id: "tr-002", 
      shiftDate: "2024-12-20",
      shiftTime: "19:00 - 07:00",
      department: t('mocks.departments.cardiology'),
      status: "requested",
      createdAt: "2024-12-08T14:20:00Z",
      reason: "Medical appointment that couldn't be rescheduled"
    },
    {
      id: "tr-003",
      shiftDate: "2024-12-12",
      shiftTime: "14:00 - 20:00", 
      department: t('mocks.departments.neurology'),
      colleagueInvolved: t('mocks.doctors.michaelChen'),
      status: "rejected",
      createdAt: "2024-12-05T09:15:00Z",
      reason: "Personal vacation - already booked flights"
    },
    {
      id: "tr-004",
      shiftDate: "2024-12-25",
      shiftTime: "08:00 - 14:00",
      department: t('mocks.departments.pediatrics'), 
      colleagueInvolved: t('mocks.doctors.emilyRodriguez'),
      status: "approved",
      createdAt: "2024-12-01T16:45:00Z",
      reason: "Christmas with family - willing to take New Year's shift in exchange"
    }
  ];
  
  const [requests, setRequests] = useState<TradeRequest[]>(mockTradeRequests);

  const getStatusBadge = (status: TradeRequest["status"]) => {
    switch (status) {
      case "requested":
        return (
          <Badge variant="secondary" className="bg-status-pending-light text-status-pending border-status-pending/20">
            {t('trade.statusCard.steps.requested.label')}
          </Badge>
        );
      case "offered":
        return (
          <Badge variant="secondary" className="bg-status-offered-light text-status-offered border-status-offered/20">
            {t('trade.statusCard.steps.offered.label')}
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="secondary" className="bg-status-accepted-light text-status-accepted border-status-accepted/20">
            {t('trade.statusCard.steps.accepted.label')}
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary" className="bg-status-offered-light text-status-offered border-status-offered/20">
            {t('trade.statusCard.steps.approved.label')}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            {t('trade.statusCard.steps.cancelled.label')}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
            {t('trade.statusCard.steps.rejected.label')}
          </Badge>
        );
    }
  };

  const handleCancel = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "cancelled" as const }
          : req
      )
    );
    toast({
      title: t('trade.history.toast.cancelledTitle'),
      description: t('trade.history.toast.cancelledDesc'),
    });
  };

  const handleResend = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "requested" as const, createdAt: new Date().toISOString() }
          : req
      )
    );
    toast({
      title: t('trade.history.toast.resentTitle'),
      description: t('trade.history.toast.resentDesc'),
    });
  };

  const canCancel = (status: TradeRequest["status"]) => {
    return ["requested", "offered"].includes(status);
  };

  const canResend = (status: TradeRequest["status"]) => {
    return ["rejected", "cancelled"].includes(status);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          {t('trade.history.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('trade.history.emptyTitle')}</p>
            <p className="text-sm">{t('trade.history.emptySubtitle')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('trade.history.tableHeaders.shift')}</TableHead>
                  <TableHead>{t('trade.history.tableHeaders.department')}</TableHead>
                  <TableHead>{t('trade.history.tableHeaders.colleague')}</TableHead>
                  <TableHead>{t('trade.history.tableHeaders.status')}</TableHead>
                  <TableHead>{t('trade.history.tableHeaders.submitted')}</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {format(parseISO(request.shiftDate), "MMM dd, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.shiftTime}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{request.department}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {request.colleagueInvolved || t('trade.history.openToAll')}
                      </p>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(request.createdAt), "MMM dd, HH:mm")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{t('trade.history.menu.open')}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            {t('trade.history.menu.viewDetails')}
                          </DropdownMenuItem>
                          
                          {canCancel(request.status) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <X className="h-4 w-4 mr-2" />
                                  {t('trade.history.menu.cancel')}
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t('trade.history.cancelDialog.title')}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t('trade.history.cancelDialog.description')}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t('trade.history.cancelDialog.keep')}</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleCancel(request.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {t('trade.history.cancelDialog.confirm')}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          {canResend(request.status) && (
                            <DropdownMenuItem onClick={() => handleResend(request.id)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              {t('trade.history.menu.resend')}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}