
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
export const mockNotifications: NotificationItem[] = [];

/**
 * Number of unread notifications.
 */
export const newNotificationCount = mockNotifications.filter(
  notification => notification.isNew
).length;
