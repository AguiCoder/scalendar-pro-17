import { useState } from "react";
import { MedicalSidebar } from "@/components/MedicalSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ShiftSelector } from "@/components/trade/ShiftSelector";
import { TradeRequestForm } from "@/components/trade/TradeRequestForm";
import { TradeStatusStepper } from "@/components/trade/TradeStatusStepper";
import { TradeRequestHistory } from "@/components/trade/TradeRequestHistory";
import { Shift } from "@/components/ShiftCard";
import { useTranslation } from "react-i18next";

export default function TradeRequestPage() {
  const { t } = useTranslation();
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [currentStatus, setCurrentStatus] = useState<"requested" | "offered" | "accepted" | "approved">("requested");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MedicalSidebar />
        <SidebarInset className="flex-1">
          <main className="container mx-auto p-6 max-w-7xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">{t('tradeRequestPage.title')}</h1>
                <p className="text-muted-foreground">
                  {t('tradeRequestPage.subtitle')}
                </p>
              </div>

              {/* Desktop Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Shift Selection & Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Shift Selection */}
                  <ShiftSelector 
                    selectedShift={selectedShift}
                    onShiftSelect={setSelectedShift}
                  />

                  {/* Trade Request Form */}
                  {selectedShift && (
                    <TradeRequestForm 
                      selectedShift={selectedShift}
                      onSubmit={(data) => {
                        console.log("Trade request submitted:", data);
                        setCurrentStatus("requested");
                      }}
                    />
                  )}
                </div>

                {/* Right Column - Status Stepper */}
                <div className="space-y-6">
                  {selectedShift && (
                    <TradeStatusStepper currentStatus={currentStatus} />
                  )}
                </div>
              </div>

              {/* Trade Request History */}
              <TradeRequestHistory />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}