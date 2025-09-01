import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
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

const mockTradeRequests: TradeRequest[] = [
  {
    id: "tr-001",
    shiftDate: "2024-12-15",
    shiftTime: "08:00 - 14:00",
    department: "Emergency Medicine",
    colleagueInvolved: "Dr. Sarah Johnson",
    status: "accepted",
    createdAt: "2024-12-10T10:30:00Z",
    reason: "Family emergency - need to attend my child's school event"
  },
  {
    id: "tr-002", 
    shiftDate: "2024-12-20",
    shiftTime: "19:00 - 07:00",
    department: "Cardiology",
    status: "requested",
    createdAt: "2024-12-08T14:20:00Z",
    reason: "Medical appointment that couldn't be rescheduled"
  },
  {
    id: "tr-003",
    shiftDate: "2024-12-12",
    shiftTime: "14:00 - 20:00", 
    department: "Neurology",
    colleagueInvolved: "Dr. Michael Chen",
    status: "rejected",
    createdAt: "2024-12-05T09:15:00Z",
    reason: "Personal vacation - already booked flights"
  },
  {
    id: "tr-004",
    shiftDate: "2024-12-25",
    shiftTime: "08:00 - 14:00",
    department: "Pediatrics", 
    colleagueInvolved: "Dr. Emily Rodriguez",
    status: "approved",
    createdAt: "2024-12-01T16:45:00Z",
    reason: "Christmas with family - willing to take New Year's shift in exchange"
  }
];

export function TradeRequestHistory() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<TradeRequest[]>(mockTradeRequests);

  const getStatusBadge = (status: TradeRequest["status"]) => {
    switch (status) {
      case "requested":
        return (
          <Badge variant="secondary" className="bg-status-pending-light text-status-pending border-status-pending/20">
            Requested
          </Badge>
        );
      case "offered":
        return (
          <Badge variant="secondary" className="bg-status-offered-light text-status-offered border-status-offered/20">
            Offered
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="secondary" className="bg-status-accepted-light text-status-accepted border-status-accepted/20">
            Accepted
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary" className="bg-status-approved-light text-status-approved border-status-approved/20">
            Approved
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Cancelled
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
            Rejected
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
      title: "Trade Request Cancelled",
      description: "Your trade request has been cancelled successfully.",
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
      title: "Trade Request Resent",
      description: "Your trade request has been resent successfully.",
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
          Trade Request History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No trade requests yet</p>
            <p className="text-sm">Your trade request history will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shift</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Colleague</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
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
                        {request.colleagueInvolved || "Open to all"}
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
                            <span className="sr-only">Open actions menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          
                          {canCancel(request.status) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel Request
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Trade Request</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel this trade request? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Keep Request</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleCancel(request.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Cancel Request
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          {canResend(request.status) && (
                            <DropdownMenuItem onClick={() => handleResend(request.id)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Resend Request
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