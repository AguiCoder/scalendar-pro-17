import { format } from 'date-fns';
import { 
  ArrowLeftRight, 
  Calendar, 
  Settings, 
  AlertTriangle,
  User,
  Clock,
  MapPin,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/notifications';

const notificationIcons = {
  trade: ArrowLeftRight,
  schedule: Calendar,
  system: Settings,
  emergency: AlertTriangle
};

interface NotificationDetailProps {
  notification: Notification;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

export function NotificationDetail({ notification, onClose, onMarkAsRead }: NotificationDetailProps) {
  const Icon = notificationIcons[notification.type];
  const fullTimestamp = format(notification.timestamp, 'EEEE, MMMM d, yyyy \'at\' h:mm a');

  const handleMarkAsRead = () => {
    if (notification.status === 'unread') {
      onMarkAsRead(notification.id);
    }
  };

  const getActionButtons = () => {
    switch (notification.type) {
      case 'trade':
        if (notification.title.toLowerCase().includes('request') && notification.actionRequired) {
          return (
            <div className="flex gap-2">
              <Button size="sm" className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Accept Trade
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                Decline
              </Button>
            </div>
          );
        }
        break;
      case 'schedule':
        if (notification.actionRequired) {
          return (
            <Button size="sm" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              View Schedule
            </Button>
          );
        }
        break;
      case 'system':
        if (notification.actionRequired) {
          return (
            <Button size="sm" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Update Profile
            </Button>
          );
        }
        break;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-full text-white", {
          'bg-status-confirmed': notification.type === 'trade',
          'bg-status-available': notification.type === 'schedule',
          'bg-status-negotiation': notification.type === 'system',
          'bg-destructive': notification.type === 'emergency'
        })}>
          <Icon className="h-6 w-6" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">
                {notification.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {fullTimestamp}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {notification.status === 'unread' && (
                <Badge variant="default" className="bg-status-available text-status-available-foreground">
                  Unread
                </Badge>
              )}
              {notification.priority !== 'normal' && (
                <Badge variant={notification.priority === 'urgent' ? 'destructive' : 'secondary'}>
                  {notification.priority}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Content */}
      <div className="space-y-4">
        <p className="text-foreground leading-relaxed">
          {notification.description}
        </p>

        {/* Related Data */}
        {notification.relatedData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notification.relatedData.doctorName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Doctor:</span>
                  <span className="text-sm">{notification.relatedData.doctorName}</span>
                </div>
              )}
              
              {notification.relatedData.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Date:</span>
                  <span className="text-sm">{notification.relatedData.date}</span>
                </div>
              )}
              
              {notification.relatedData.time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Time:</span>
                  <span className="text-sm">{notification.relatedData.time}</span>
                </div>
              )}
              
              {notification.relatedData.department && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Department:</span>
                  <span className="text-sm">{notification.relatedData.department}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {getActionButtons()}
        </div>
        
        <div className="flex items-center gap-2">
          {notification.status === 'unread' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMarkAsRead}
            >
              Mark as Read
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}