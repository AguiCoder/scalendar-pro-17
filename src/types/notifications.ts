export type NotificationType = 'trade' | 'schedule' | 'system' | 'emergency';

export type NotificationCategory = 'all' | 'trades' | 'schedules' | 'system';

export type NotificationStatus = 'read' | 'unread';

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: Date;
  status: NotificationStatus;
  icon?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  actionRequired?: boolean;
  relatedData?: {
    shiftId?: string;
    doctorName?: string;
    date?: string;
    time?: string;
    department?: string;
  };
}

export interface NotificationGroup {
  date: string;
  label: string;
  notifications: Notification[];
}