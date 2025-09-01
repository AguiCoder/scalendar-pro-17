import { useState } from "react";
import { Save, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { MedicalSidebar } from "@/components/MedicalSidebar";
import { AvailabilitySection } from "@/components/preferences/AvailabilitySection";
import { VacationsSection } from "@/components/preferences/VacationsSection";
import { RestrictionsSection } from "@/components/preferences/RestrictionsSection";
import { WeightedPreferencesSection } from "@/components/preferences/WeightedPreferencesSection";

const PreferencesPage = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Preferences saved",
      description: "Your scheduling preferences have been updated successfully.",
    });
    
    setIsSaving(false);
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
                  <h1 className="page-title">Doctor Preferences</h1>
                  <p className="section-subtitle">
                    Manage your availability, vacations, restrictions, and preferences
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="availability" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                  <TabsTrigger value="vacations">Vacations</TabsTrigger>
                  <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
                  <TabsTrigger value="preferences">AI Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="availability" className="space-y-6">
                  <AvailabilitySection />
                </TabsContent>

                <TabsContent value="vacations" className="space-y-6">
                  <VacationsSection />
                </TabsContent>

                <TabsContent value="restrictions" className="space-y-6">
                  <RestrictionsSection />
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <WeightedPreferencesSection />
                </TabsContent>
              </Tabs>
            </div>
          </main>

          {/* Sticky Save Button */}
          <div className="border-t border-border bg-card/50 backdrop-blur p-4 lg:p-6">
            <div className="max-w-4xl mx-auto flex justify-end">
              <Button 
                onClick={handleSavePreferences}
                disabled={isSaving}
                className="flex items-center gap-2 min-w-[120px]"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PreferencesPage;