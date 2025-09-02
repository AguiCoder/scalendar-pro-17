import { useState } from "react";
import { MedicalSidebar } from "@/components/MedicalSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ArrowLeftRight, PlaneTakeoff, Clock, MapPin, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, subDays, isAfter, isBefore } from "date-fns";
import { generateMockShifts } from "@/data/mockShifts";
import { Shift } from "@/components/ShiftCard";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/dateLocale";

// Generate shifts for past and upcoming
const allShifts = [
  ...generateMockShifts(subDays(new Date(), 30), 30), // Past 30 days
  ...generateMockShifts(new Date(), 30), // Next 30 days
];

const tradeFormSchema = z.object({
  suggestedColleague: z.string().optional(),
  reason: z.string().min(10, "Please provide a detailed reason (minimum 10 characters)"),
});

const leaveFormSchema = z.object({
  leaveType: z.string(),
  reason: z.string().min(5, "Please provide a reason"),
});

type TradeFormData = z.infer<typeof tradeFormSchema>;
type LeaveFormData = z.infer<typeof leaveFormSchema>;

const mockColleagues = [
  "Dr. Sarah Johnson",
  "Dr. Michael Chen",
  "Dr. Emily Rodriguez",
  "Dr. David Kim",
  "Dr. Lisa Thompson",
];

const getStatusBadge = (t: (key: string) => string, status: Shift["status"]) => {
  const statusConfig = {
    confirmed: {
      variant: "secondary" as const,
      className: "bg-status-confirmed text-status-confirmed-foreground",
      label: t("common.confirmed"),
    },
    available: {
      variant: "secondary" as const,
      className: "bg-status-available text-status-available-foreground",
      label: t("common.available"),
    },
    negotiation: {
      variant: "secondary" as const,
      className: "bg-status-negotiation text-status-negotiation-foreground",
      label: t("common.inNegotiation"),
    }
  };

  const config = statusConfig[status] || statusConfig.confirmed;
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

const formatShiftTime = (shift: Shift) => {
  return `${shift.startTime} - ${shift.endTime}`;
};

const ShiftActions = ({ shift }: { shift: Shift }) => {
  const { toast } = useToast();
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const { t } = useTranslation();

  const tradeForm = useForm<TradeFormData>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      suggestedColleague: "",
      reason: "",
    },
  });

  const leaveForm = useForm<LeaveFormData>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      leaveType: "",
      reason: "",
    },
  });

  const onTradeSubmit = async (data: TradeFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: t("myShifts.toast.tradeSubmittedTitle"),
      description: t("myShifts.toast.tradeSubmittedDescription", { date: format(new Date(shift.date), 'PP', { locale: getDateFnsLocale() }) }),
    });
    
    setTradeDialogOpen(false);
    tradeForm.reset();
  };

  const onLeaveSubmit = async (data: LeaveFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: t("myShifts.toast.leaveSubmittedTitle"),
      description: t("myShifts.toast.leaveSubmittedDescription", { leaveType: data.leaveType, date: format(new Date(shift.date), 'PP', { locale: getDateFnsLocale() }) }),
    });
    
    setLeaveDialogOpen(false);
    leaveForm.reset();
  };

  const isPastShift = isBefore(new Date(shift.date), new Date());

  return (
    <div className="flex gap-2">
      <Dialog open={tradeDialogOpen} onOpenChange={setTradeDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={isPastShift}
            className="flex items-center gap-1"
          >
            <ArrowLeftRight className="h-3 w-3" />
            {t("myShifts.trade")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("myShifts.requestShiftTrade")}</DialogTitle>
            <DialogDescription>
              {t("myShifts.requestTradeDescription", { date: format(new Date(shift.date), 'PPP', { locale: getDateFnsLocale() }), time: formatShiftTime(shift) })}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...tradeForm}>
            <form onSubmit={tradeForm.handleSubmit(onTradeSubmit)} className="space-y-4">
              <FormField
                control={tradeForm.control}
                name="suggestedColleague"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("myShifts.suggestedColleagueOptional")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("myShifts.selectColleaguePlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockColleagues.map((colleague) => (
                          <SelectItem key={colleague} value={colleague}>
                            {colleague}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={tradeForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("myShifts.reasonForTradeRequest")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("myShifts.reasonPlaceholderTrade")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setTradeDialogOpen(false)}>
                  {t("myShifts.cancel")}
                </Button>
                <Button type="submit">
                  {t("myShifts.submitRequest")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={isPastShift}
            className="flex items-center gap-1"
          >
            <PlaneTakeoff className="h-3 w-3" />
            {t("myShifts.leave")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("myShifts.requestLeave")}</DialogTitle>
            <DialogDescription>
              {t("myShifts.requestLeaveDescription", { date: format(new Date(shift.date), 'PPP', { locale: getDateFnsLocale() }), time: formatShiftTime(shift) })}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...leaveForm}>
            <form onSubmit={leaveForm.handleSubmit(onLeaveSubmit)} className="space-y-4">
              <FormField
                control={leaveForm.control}
                name="leaveType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("myShifts.leaveType")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("myShifts.selectLeaveType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vacation">{t("myShifts.vacation")}</SelectItem>
                        <SelectItem value="sick">{t("myShifts.sickLeave")}</SelectItem>
                        <SelectItem value="personal">{t("myShifts.personalLeave")}</SelectItem>
                        <SelectItem value="emergency">{t("myShifts.emergencyLeave")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={leaveForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("myShifts.reason")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("myShifts.reasonPlaceholderLeave")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setLeaveDialogOpen(false)}>
                  {t("myShifts.cancel")}
                </Button>
                <Button type="submit">
                  {t("myShifts.submitRequest")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ShiftTable = ({ shifts }: { shifts: Shift[] }) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("myShifts.dateTime")}</TableHead>
            <TableHead>{t("myShifts.department")}</TableHead>
            <TableHead>{t("myShifts.location")}</TableHead>
            <TableHead>{t("myShifts.status")}</TableHead>
            <TableHead>{t("myShifts.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                {t("myShifts.noShiftsFound")}
              </TableCell>
            </TableRow>
          ) : (
            shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="font-medium">
                      {format(new Date(shift.date), 'PPP', { locale: getDateFnsLocale() })}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatShiftTime(shift)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{shift.department}</div>
                  <div className="text-sm text-muted-foreground">{shift.shiftType}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {shift.location}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(t, shift.status)}
                </TableCell>
                <TableCell>
                  {shift.doctorName && <ShiftActions shift={shift} />}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const ShiftCards = ({ shifts }: { shifts: Shift[] }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {shifts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">{t("myShifts.noShiftsFound")}</p>
          </CardContent>
        </Card>
      ) : (
        shifts.map((shift) => (
          <Card key={shift.id}>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">
                      {format(new Date(shift.date), 'PPP', { locale: getDateFnsLocale() })}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatShiftTime(shift)}
                    </div>
                  </div>
                  {getStatusBadge(t, shift.status)}
                </div>
                
                <div className="text-sm">
                  <div className="font-medium">{shift.department}</div>
                  <div className="text-muted-foreground">{shift.shiftType}</div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {shift.location}
                  </div>
                </div>
                
                {shift.doctorName && (
                  <div className="pt-2 border-t">
                    <ShiftActions shift={shift} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default function MyShiftsPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const today = new Date();
  
  // Filter shifts by upcoming/past
  const upcomingShifts = allShifts.filter(shift => 
    isAfter(new Date(shift.date), subDays(today, 1)) && shift.doctorName
  );
  const pastShifts = allShifts.filter(shift => 
    isBefore(new Date(shift.date), today) && shift.doctorName
  );

  // Apply filters
  const filterShifts = (shifts: Shift[]) => {
    return shifts.filter(shift => {
      const statusMatch = statusFilter === "all" || shift.status === statusFilter;
      const departmentMatch = departmentFilter === "all" || shift.department === departmentFilter;
      return statusMatch && departmentMatch;
    });
  };

  const departments = Array.from(new Set(allShifts.map(shift => shift.department)));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MedicalSidebar />
        <SidebarInset className="flex-1">
          <main className="container mx-auto p-6 max-w-7xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="page-title">{t("myShifts.title")}</h1>
                <p className="section-subtitle">
                  {t("myShifts.subtitle")}
                </p>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <CardTitle className="text-lg">{t("myShifts.filters")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("myShifts.filterByStatus")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("myShifts.allStatuses")}</SelectItem>
                          <SelectItem value="confirmed">{t("common.confirmed")}</SelectItem>
                          <SelectItem value="available">{t("common.available")}</SelectItem>
                          <SelectItem value="negotiation">{t("common.inNegotiation")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("myShifts.filterByDepartment")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("myShifts.allDepartments")}</SelectItem>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t("myShifts.upcomingTab")}
                  </TabsTrigger>
                  <TabsTrigger value="past" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t("myShifts.pastTab")}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("myShifts.upcomingTitle")} ({filterShifts(upcomingShifts).length})</CardTitle>
                      <CardDescription>
                        {t("myShifts.scheduledComingDays")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      {/* Desktop Table View */}
                      <div className="hidden md:block">
                        <ShiftTable shifts={filterShifts(upcomingShifts)} />
                      </div>
                      
                      {/* Mobile Card View */}
                      <div className="md:hidden p-6 pt-0">
                        <ShiftCards shifts={filterShifts(upcomingShifts)} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="past" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Past Shifts ({filterShifts(pastShifts).length})</CardTitle>
                      <CardDescription>
                        Your completed shift history
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      {/* Desktop Table View */}
                      <div className="hidden md:block">
                        <ShiftTable shifts={filterShifts(pastShifts)} />
                      </div>
                      
                      {/* Mobile Card View */}
                      <div className="md:hidden p-6 pt-0">
                        <ShiftCards shifts={filterShifts(pastShifts)} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}