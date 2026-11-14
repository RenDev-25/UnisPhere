
import type { NotificationItem } from '../types/notification.types';

/**
 * Academic year configuration.
 * Keep this data separate from the Topbar component.
 */
export const academicYearConfig = {
  label: 'A.Y. 2026-2027',
  semester: 'First Semester',
};

/**
 * Notification mock data.
 */
export const mockNotifications: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    title: '4 New Student Clearance Submissions',
    detail: 'Students have submitted their clearance documents for review.',
    relativeTime: '10 minutes ago',
    isNew: true,
  },
  {
    id: 'NOTIF-002',
    title: 'HTE Partner Capacity Confirmed',
    detail: 'Your partner establishment has confirmed its available slots.',
    relativeTime: '1 hour ago',
    isNew: true,
  },
];

/**
 * Number of unread notifications.
 */
export const newNotificationCount = mockNotifications.filter(
  notification => notification.isNew
).length;
