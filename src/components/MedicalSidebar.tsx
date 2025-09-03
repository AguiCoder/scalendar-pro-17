
import { useState } from "react";
import { 
  Calendar,
  LayoutDashboard,
  Clock,
  ArrowLeftRight,
  Settings,
  Shield,
  MessageCircle,
  Bell,
  Stethoscope
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";

const navigationItems = [
  { key: "dashboard", url: "/dashboard", icon: LayoutDashboard },
  { key: "calendar", url: "/", icon: Calendar },
  { key: "myShifts", url: "/shifts", icon: Clock },
  { key: "tradeRequests", url: "/trade-requests", icon: ArrowLeftRight },
  { key: "preferences", url: "/preferences", icon: Settings },
  { key: "administration", url: "/admin", icon: Shield },
  { key: "virtualAssistant", url: "/virtual-assistant", icon: MessageCircle },
  { key: "notifications", url: "/notifications", icon: Bell },
];

export function MedicalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation();

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-sidebar-foreground">{t('calendar.sidebar.brandName')}</h2>
                <p className="text-xs text-sidebar-foreground/60">{t('calendar.sidebar.tagline')}</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>{t('calendar.sidebar.navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    asChild
                    className={
                      isActive(item.url)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "hover:bg-sidebar-accent/50"
                    }
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{t(`calendar.sidebar.links.${item.key}`)}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
