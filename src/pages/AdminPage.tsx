import { useState } from "react";
import { MedicalSidebar } from "@/components/MedicalSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamManagement } from "@/components/admin/TeamManagement";
import { WorkOrdersImport } from "@/components/admin/WorkOrdersImport";
import { ScheduleManagement } from "@/components/admin/ScheduleManagement";
import { MonitoringInsights } from "@/components/admin/MonitoringInsights";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function AdminPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MedicalSidebar />
        <SidebarInset className="flex-1">
          <main className="container mx-auto p-6 max-w-7xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="page-title">Administration</h1>
                <p className="section-subtitle">
                  Manage your team, schedules, and fairness statistics.
                </p>
              </div>

              {/* Main Tabs */}
              <DndProvider backend={HTML5Backend}>
                <Tabs defaultValue="team" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
                    <TabsTrigger value="schedules">Schedules</TabsTrigger>
                    <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="team" className="space-y-4">
                    <TeamManagement />
                  </TabsContent>
                  
                  <TabsContent value="work-orders" className="space-y-4">
                    <WorkOrdersImport />
                  </TabsContent>
                  
                  <TabsContent value="schedules" className="space-y-4">
                    <ScheduleManagement />
                  </TabsContent>
                  
                  <TabsContent value="monitoring" className="space-y-4">
                    <MonitoringInsights />
                  </TabsContent>
                </Tabs>
              </DndProvider>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}