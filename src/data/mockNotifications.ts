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
    title: 'Last-Minute Schedule Change',
    description: 'Your September 16 shift has been moved from 2:00 PM - 10:00 PM to 6:00 AM - 2:00 PM due to staff shortage.',
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
    title: 'Trade Request Denied',
    description: 'Your trade request for September 12 night shift was denied by administration due to minimum staffing requirements.',
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
    title: 'System Maintenance Complete',
    description: 'The scheduled maintenance has been completed. All features are now fully operational.',
    timestamp: subDays(new Date(), 3),
    status: 'read',
    priority: 'low',
    actionRequired: false
  },
  {
    id: '8',
    type: 'schedule',
    category: 'schedules',
    title: 'Monthly Schedule Draft',
    description: 'October schedule draft is available for review. Please submit any preference changes by September 25.',
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
    title: 'Trade Deadline Reminder',
    description: 'Reminder: Trade requests for shifts in the next 48 hours require supervisor approval.',
    timestamp: subWeeks(new Date(), 1),
    status: 'read',
    priority: 'low',
    actionRequired: false
  },
  {
    id: '10',
    type: 'system',
    category: 'system',
    title: 'Welcome to Escala AI',
    description: 'Welcome! Your account has been set up successfully. Complete your profile to get started with intelligent scheduling.',
    timestamp: subWeeks(new Date(), 2),
    status: 'read',
    priority: 'normal',
    actionRequired: true
  }
];

// Keep the old export for backward compatibility
export const mockNotifications = getMockNotifications(() => '');