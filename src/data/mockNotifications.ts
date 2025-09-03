import { addHours, subHours, subDays, subWeeks } from 'date-fns';
import type { Notification } from '@/types/notifications';

// This function will be called to get translated notifications
export const getMockNotifications = (t: (key: string) => string): Notification[] => [
  {
    id: '1',
    type: 'trade',
    category: 'trades',
    title: t('notifications.messages.shiftTradeAccepted.title'),
    description: t('notifications.messages.shiftTradeAccepted.description'),
    timestamp: subHours(new Date(), 2),
    status: 'unread',
    priority: 'high',
    actionRequired: false,
    relatedData: {
      doctorName: 'Dr. Sarah Johnson',
      date: 'September 15',
      time: '19:00-07:00',
      department: 'Emergency Department'
    }
  },
  {
    id: '2',
    type: 'schedule',
    category: 'schedules',
    title: t('notifications.messages.weeklySchedulePublished.title'),
    description: t('notifications.messages.weeklySchedulePublished.description'),
    timestamp: subHours(new Date(), 5),
    status: 'unread',
    priority: 'normal',
    actionRequired: true,
    relatedData: {
      date: 'September 18-24'
    }
  },
  {
    id: '3',
    type: 'system',
    category: 'system',
    title: t('notifications.messages.profileUpdateRequired.title'),
    description: t('notifications.messages.profileUpdateRequired.description'),
    timestamp: subHours(new Date(), 8),
    status: 'read',
    priority: 'normal',
    actionRequired: true
  },
  {
    id: '4',
    type: 'trade',
    category: 'trades',
    title: t('notifications.messages.newTradeRequest.title'),
    description: t('notifications.messages.newTradeRequest.description'),
    timestamp: subDays(new Date(), 1),
    status: 'read',
    priority: 'normal',
    actionRequired: true,
    relatedData: {
      doctorName: 'Dr. Michael Chen',
      date: 'September 20',
      time: '08:00-18:00',
      department: 'Cardiology'
    }
  },
  {
    id: '5',
    type: 'schedule',
    category: 'schedules',
    title: t('notifications.messages.lastMinuteScheduleChange.title'),
    description: t('notifications.messages.lastMinuteScheduleChange.description'),
    timestamp: subDays(new Date(), 1),
    status: 'read',
    priority: 'urgent',
    actionRequired: true,
    relatedData: {
      date: 'September 16',
      time: '06:00-14:00'
    }
  },
  {
    id: '6',
    type: 'trade',
    category: 'trades',
    title: t('notifications.messages.tradeRequestDenied.title'),
    description: t('notifications.messages.tradeRequestDenied.description'),
    timestamp: subDays(new Date(), 2),
    status: 'read',
    priority: 'normal',
    actionRequired: false,
    relatedData: {
      date: 'September 12'
    }
  },
  {
    id: '7',
    type: 'system',
    category: 'system',
    title: t('notifications.messages.systemMaintenanceComplete.title'),
    description: t('notifications.messages.systemMaintenanceComplete.description'),
    timestamp: subDays(new Date(), 3),
    status: 'read',
    priority: 'low',
    actionRequired: false
  },
  {
    id: '8',
    type: 'schedule',
    category: 'schedules',
    title: t('notifications.messages.monthlyScheduleDraft.title'),
    description: t('notifications.messages.monthlyScheduleDraft.description'),
    timestamp: subDays(new Date(), 5),
    status: 'read',
    priority: 'normal',
    actionRequired: true,
    relatedData: {
      date: 'October'
    }
  },
  {
    id: '9',
    type: 'trade',
    category: 'trades',
    title: t('notifications.messages.tradeDeadlineReminder.title'),
    description: t('notifications.messages.tradeDeadlineReminder.description'),
    timestamp: subWeeks(new Date(), 1),
    status: 'read',
    priority: 'low',
    actionRequired: false
  },
  {
    id: '10',
    type: 'system',
    category: 'system',
    title: t('notifications.messages.welcomeToEscalaAI.title'),
    description: t('notifications.messages.welcomeToEscalaAI.description'),
    timestamp: subWeeks(new Date(), 2),
    status: 'read',
    priority: 'normal',
    actionRequired: true
  }
];

// Keep the old export for backward compatibility
export const mockNotifications = getMockNotifications(() => '');