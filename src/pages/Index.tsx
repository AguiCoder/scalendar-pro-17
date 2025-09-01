
import { useState } from "react";
import { CalendarDays, Grid3X3 } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MedicalSidebar } from "@/components/MedicalSidebar";
import { CalendarFilters } from "@/components/CalendarFilters";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { MonthlyCalendar } from "@/components/MonthlyCalendar";
import { mockShifts } from "@/data/mockShifts";
import type { Shift } from "@/components/ShiftCard";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<"week" | "month">("week");
  
  // Filter states
  const [selectedDoctor, setSelectedDoctor] = useState("All Doctors");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedShiftType, setSelectedShiftType] = useState("All Shifts");

  // Filter shifts based on selected criteria
  const filteredShifts = mockShifts.filter((shift: Shift) => {
    if (selectedDoctor !== "All Doctors" && shift.doctorName !== selectedDoctor) {
      return false;
    }
    if (selectedDepartment !== "All Departments" && shift.department !== selectedDepartment) {
      return false;
    }
    if (selectedShiftType !== "All Shifts" && shift.shiftType !== selectedShiftType) {
      return false;
    }
    return true;
  });

  const handleClearFilters = () => {
    setSelectedDoctor("All Doctors");
    setSelectedDepartment("All Departments");
    setSelectedShiftType("All Shifts");
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MedicalSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-20 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex h-full items-center justify-between px-4 lg:px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div>
                  <h1 className="page-title">Shift Calendar</h1>
                  <p className="section-subtitle">
                    Manage medical staff scheduling
                  </p>
                </div>
              </div>
              
              <div className="month-navigation">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  aria-label="Previous month"
                  className="h-8 w-8 p-0"
                >
                  ←
                </Button>
                <span className="text-sm font-semibold min-w-[140px] text-center px-2">
                  {format(currentDate, "MMMM yyyy")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  aria-label="Next month"
                  className="h-8 w-8 p-0"
                >
                  →
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Filters */}
              <CalendarFilters
                selectedDoctor={selectedDoctor}
                selectedDepartment={selectedDepartment}
                selectedShiftType={selectedShiftType}
                onDoctorChange={setSelectedDoctor}
                onDepartmentChange={setSelectedDepartment}
                onShiftTypeChange={setSelectedShiftType}
                onClearFilters={handleClearFilters}
              />

              {/* View Toggle and Calendar */}
              <Tabs 
                value={viewType} 
                onValueChange={(value) => setViewType(value as "week" | "month")}
                className="space-y-4"
              >
                <TabsList className="grid w-fit grid-cols-2">
                  <TabsTrigger value="week" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Week View
                  </TabsTrigger>
                  <TabsTrigger value="month" className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    Month View
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="week" className="space-y-4">
                  <WeeklyCalendar shifts={filteredShifts} currentDate={currentDate} />
                </TabsContent>

                <TabsContent value="month" className="space-y-4">
                  <MonthlyCalendar shifts={filteredShifts} currentDate={currentDate} />
                </TabsContent>
              </Tabs>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Total Shifts</h3>
                      <p className="text-2xl font-bold text-foreground">{filteredShifts.length}</p>
                    </div>
                    <div className="w-2 h-8 bg-primary/20 rounded-full" />
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Available</h3>
                      <p className="text-2xl font-bold text-status-available">
                        {filteredShifts.filter(s => s.status === "available").length}
                      </p>
                    </div>
                    <div className="w-2 h-8 bg-status-available/30 rounded-full" />
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Confirmed</h3>
                      <p className="text-2xl font-bold text-status-confirmed">
                        {filteredShifts.filter(s => s.status === "confirmed").length}
                      </p>
                    </div>
                    <div className="w-2 h-8 bg-status-confirmed/30 rounded-full" />
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">In Negotiation</h3>
                      <p className="text-2xl font-bold text-status-negotiation">
                        {filteredShifts.filter(s => s.status === "negotiation").length}
                      </p>
                    </div>
                    <div className="w-2 h-8 bg-status-negotiation/30 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
