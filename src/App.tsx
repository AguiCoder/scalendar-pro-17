import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DashboardPage from "./pages/DashboardPage";
import MyShiftsPage from "./pages/MyShiftsPage";
import AdminPage from "./pages/AdminPage";
import PreferencesPage from "./pages/PreferencesPage";
import NotificationsPage from "./pages/NotificationsPage";
import TradeRequestPage from "./pages/TradeRequestPage";
import VirtualAssistantPage from "./pages/VirtualAssistantPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/shifts" element={<MyShiftsPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/trade-requests" element={<TradeRequestPage />} />
          <Route path="/virtual-assistant" element={<VirtualAssistantPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
