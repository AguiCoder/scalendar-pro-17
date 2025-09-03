import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MedicalSidebar } from "@/components/MedicalSidebar";
import { UpcomingShifts } from "@/components/dashboard/UpcomingShifts";
import { AlertsSection } from "@/components/dashboard/AlertsSection";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { useTranslation } from "react-i18next";

const DashboardPage = () => {
  const { t } = useTranslation();
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
                  <h1 className="page-title">{t("dashboard.title")}</h1>
                  <p className="section-subtitle">
                    {t("dashboard.subtitle")}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Top Row: Quick Actions + Upcoming Shifts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                  <QuickActions />
                </div>
                <div className="lg:col-span-8">
                  <UpcomingShifts />
                </div>
              </div>

              {/* Middle Row: Alerts */}
              <AlertsSection />

              {/* Bottom Row: Metrics */}
              <MetricsOverview />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage;