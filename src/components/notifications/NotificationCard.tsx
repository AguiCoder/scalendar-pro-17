import { formatDistanceToNow, format } from 'date-fns';
import { 
  ArrowLeftRight, 
  Calendar, 
  Settings, 
  AlertTriangle, 
  Clock, 
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/notifications';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@/lib/dateLocale';

const notificationIcons = {
  trade: ArrowLeftRight,
  schedule: Calendar,
  system: Settings,
  emergency: AlertTriangle
};

const priorityColors = {
  low: 'text-muted-foreground',
  normal: 'text-status-available',
  high: 'text-status-negotiation',
  urgent: 'text-destructive'
};

const priorityBadges = {
  low: 'secondary',
  normal: 'default',
  high: 'default',
  urgent: 'destructive'
} as const;

const statusIcons = {
  accepted: CheckCircle,
  denied: XCircle,
  pending: Clock,
  info: Info,
  warning: AlertCircle
};

interface NotificationCardProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const { t } = useTranslation();
  const Icon = notificationIcons[notification.type];
  const timeAgo = formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: getDateFnsLocale() as any });
  const fullTimestamp = format(notification.timestamp, 'PPP p', { locale: getDateFnsLocale() });

  const getStatusIcon = () => {
    if (notification.title.toLowerCase().includes('accepted')) return statusIcons.accepted;
    if (notification.title.toLowerCase().includes('denied')) return statusIcons.denied;
    if (notification.title.toLowerCase().includes('request')) return statusIcons.pending;
    if (notification.priority === 'urgent') return statusIcons.warning;
    return statusIcons.info;
  };

  const StatusIcon = getStatusIcon();

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
        notification.status === 'unread' && "bg-status-available-light border-l-4 border-l-status-available"
      )}
      onClick={() => onClick(notification)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar with Icon */}
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className={cn("text-white", {
              'bg-status-confirmed': notification.type === 'trade',
              'bg-status-available': notification.type === 'schedule',
              'bg-status-negotiation': notification.type === 'system',
              'bg-destructive': notification.type === 'emergency'
            })}>
              <Icon className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={cn(
                    "font-medium leading-tight",
                    notification.status === 'unread' ? "font-semibold text-foreground" : "text-foreground"
                  )}>
                    {notification.title}
                  </h3>
                  <StatusIcon className={cn("h-4 w-4 shrink-0", {
                    'text-status-confirmed': notification.title.toLowerCase().includes('accepted'),
                    'text-destructive': notification.title.toLowerCase().includes('denied'),
                    'text-status-negotiation': notification.title.toLowerCase().includes('request'),
                    'text-status-vacation': notification.priority === 'urgent'
                  })} />
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {notification.description}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground" title={fullTimestamp}>
                    {timeAgo}
                  </span>
                  
                  {notification.priority !== 'normal' && (
                    <Badge 
                      variant={priorityBadges[notification.priority]}
                      className="text-xs"
                    >
                      {t(`notifications.priority.${notification.priority}`)}
                    </Badge>
                  )}
                  
                  {notification.actionRequired && (
                    <Badge variant="outline" className="text-xs text-status-negotiation border-status-negotiation">
                      {t('notifications.badge.actionRequired')}
                    </Badge>
                  )}

                  {notification.relatedData?.department && (
                    <Badge variant="secondary" className="text-xs">
                      {notification.relatedData.department}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Unread indicator */}
              {notification.status === 'unread' && (
                <div className="w-2 h-2 bg-status-available rounded-full shrink-0 mt-2" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}