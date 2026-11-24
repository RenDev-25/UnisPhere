import { ENV } from '../core/env';

import {
  academicYearConfig,
  mockNotifications,
  newNotificationCount,
} from '../mocks/notification.mock';

import type { NotificationItem } from '../types/notification.types';

const delay = (ms = 250): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

export async function getNotifications(): Promise<NotificationItem[]> {
  if (!ENV.useMocks) {
    throw new Error(
      'Notification API integration is not available yet.',
    );
  }

  await delay();

  return JSON.parse(
    JSON.stringify(mockNotifications),
  ) as NotificationItem[];
}

export async function getNewNotificationCount(): Promise<number> {
  if (!ENV.useMocks) {
    throw new Error(
      'Notification API integration is not available yet.',
    );
  }

  await delay();

  return newNotificationCount;
}

export async function getAcademicYearConfig() {
  if (!ENV.useMocks) {
    throw new Error(
      'Notification API integration is not available yet.',
    );
  }

  await delay();

  return { ...academicYearConfig };
}