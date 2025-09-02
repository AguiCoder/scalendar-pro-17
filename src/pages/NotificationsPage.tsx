import { useState, useEffect } from "react";
import { format, isToday, isYesterday, isWithinInterval, subDays } from 'date-fns';
import { Bell, Filter, MoreVertical, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { MedicalSidebar } from "@/components/MedicalSidebar";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { NotificationDetail } from "@/components/notifications/NotificationDetail";
import { mockNotifications } from "@/data/mockNotifications";
import type { Notification, NotificationCategory, NotificationGroup } from "@/types/notifications";
import { useTranslation } from "react-i18next";

const CATEGORIES = [
  { value: 'all', labelKey: 'notifications.categories.all', count: 0 },
  { value: 'trades', labelKey: 'notifications.categories.trades', count: 0 },
  { value: 'schedules', labelKey: 'notifications.categories.schedules', count: 0 },
  { value: 'system', labelKey: 'notifications.categories.system', count: 0 }
] as const;

const NotificationsPage = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Calculate counts for each category
  const categoriesWithCounts = CATEGORIES.map(category => ({
    ...category,
    count: category.value === 'all' 
      ? notifications.length 
      : notifications.filter(n => n.category === category.value).length
  }));

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => 
      selectedCategory === 'all' || notification.category === selectedCategory
    )
    .sort((a, b) => {
      const timeA = a.timestamp.getTime();
      const timeB = b.timestamp.getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

  // Group notifications by date
  const groupNotificationsByDate = (notifications: Notification[]): NotificationGroup[] => {
    const groups: NotificationGroup[] = [];
    const today = new Date();
    const yesterday = subDays(today, 1);
    const weekAgo = subDays(today, 7);

    const todayNotifications = notifications.filter(n => isToday(n.timestamp));
    const yesterdayNotifications = notifications.filter(n => isYesterday(n.timestamp));
    const thisWeekNotifications = notifications.filter(n => 
      !isToday(n.timestamp) && 
      !isYesterday(n.timestamp) && 
      isWithinInterval(n.timestamp, { start: weekAgo, end: yesterday })
    );
    const olderNotifications = notifications.filter(n => n.timestamp < weekAgo);

    if (todayNotifications.length > 0) {
      groups.push({
        date: format(today, 'yyyy-MM-dd'),
        label: t('notifications.groups.today'),
        notifications: todayNotifications
      });
    }

    if (yesterdayNotifications.length > 0) {
      groups.push({
        date: format(yesterday, 'yyyy-MM-dd'),
        label: t('notifications.groups.yesterday'),
        notifications: yesterdayNotifications
      });
    }

    if (thisWeekNotifications.length > 0) {
      groups.push({
        date: format(weekAgo, 'yyyy-MM-dd'),
        label: t('notifications.groups.last7Days'),
        notifications: thisWeekNotifications
      });
    }

    if (olderNotifications.length > 0) {
      groups.push({
        date: '1970-01-01',
        label: t('notifications.groups.older'),
        notifications: olderNotifications
      });
    }

    return groups;
  };

  const notificationGroups = groupNotificationsByDate(filteredNotifications);

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailOpen(true);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, status: 'read' as const }
        : notification
    ));
    
    toast({
      title: t('notifications.toast.markedAsReadTitle'),
      description: t('notifications.toast.markedAsReadDescription'),
    });
  };

  const handleMarkAllAsRead = () => {
    const unreadInCategory = filteredNotifications.filter(n => n.status === 'unread');
    
    setNotifications(prev => prev.map(notification => {
      const shouldMarkAsRead = selectedCategory === 'all' || notification.category === selectedCategory;
      return shouldMarkAsRead && notification.status === 'unread'
        ? { ...notification, status: 'read' as const }
        : notification;
    }));

    toast({
      title: t('notifications.toast.allMarkedTitle'),
      description: t('notifications.toast.allMarkedDescription', { count: unreadInCategory.length }),
    });
  };

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly show a toast notification (for demo purposes)
      if (Math.random() < 0.1) { // 10% chance every 10 seconds
        toast({
          title: t('notifications.toast.newNotificationTitle'),
          description: t('notifications.toast.newNotificationDescription', { doctor: 'Dr. Martinez' }),
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [toast, t]);

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
                  <div className="flex items-center gap-2">
                    <h1 className="page-title">{t('notifications.title')}</h1>
                    {unreadCount > 0 && (
                      <Badge variant="default" className="bg-status-available text-status-available-foreground">
                        {unreadCount} {t('notifications.unread')}
                      </Badge>
                    )}
                  </div>
                  <p className="section-subtitle">
                    {t('notifications.subtitle')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={filteredNotifications.filter(n => n.status === 'unread').length === 0}
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  {t('notifications.markAllRead')}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                      {t('notifications.sort.newest')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                      {t('notifications.sort.oldest')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Filters */}
              <div className="flex items-center justify-between gap-4">
                <Tabs 
                  value={selectedCategory} 
                  onValueChange={(value) => setSelectedCategory(value as NotificationCategory)}
                  className="flex-1"
                >
                  <TabsList className="grid w-full grid-cols-4">
                    {categoriesWithCounts.map((category) => (
                      <TabsTrigger 
                        key={category.value} 
                        value={category.value}
                        className="flex items-center gap-2"
                      >
                        {t(category.labelKey)}
                        {category.count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'newest' | 'oldest')}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('notifications.sort.newestShort')}</SelectItem>
                    <SelectItem value="oldest">{t('notifications.sort.oldestShort')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notifications List */}
              <div className="space-y-6">
                {notificationGroups.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">{t('notifications.empty.title')}</h3>
                    <p className="text-muted-foreground">
                      {selectedCategory === 'all' 
                        ? t('notifications.empty.allCaughtUp')
                        : t('notifications.empty.noneInCategory', { category: t(`notifications.categories.${selectedCategory}`) })}
                    </p>
                  </div>
                ) : (
                  notificationGroups.map((group) => (
                    <div key={group.date} className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground border-b border-border pb-2">
                        {group.label}
                      </h3>
                      <div className="space-y-2">
                        {group.notifications.map((notification) => (
                          <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onClick={handleNotificationClick}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>

        {/* Notification Detail Sheet */}
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>{t('notifications.sheet.title')}</SheetTitle>
              <SheetDescription>
                {t('notifications.sheet.description')}
              </SheetDescription>
            </SheetHeader>
            
            {selectedNotification && (
              <NotificationDetail
                notification={selectedNotification}
                onClose={() => setIsDetailOpen(false)}
                onMarkAsRead={handleMarkAsRead}
              />
            )}
          </SheetContent>
        </Sheet>
      </div>
    </SidebarProvider>
  );
};

export default NotificationsPage;