
// src/ts/components/notification-dropdown.ts

import { escapeHtml, icon } from '../utils/dom';

import {
  getNotifications,
  getNewNotificationCount,
  markNotificationRead
} from '../services/notification.service';

import type { NotificationItem } from '../types/notification.types';


// ==========================================
// RENDER NOTIFICATION DROPDOWN
// ==========================================

export function renderNotificationDropdown(): string {
  return `
    <div
      id="notification-menu"
      class="dropdown-panel notification-dropdown"
      data-dropdown-panel="notifications"
      hidden
    >

      <div class="dropdown-header">

        <h3 class="dropdown-header__title">
          Notifications
        </h3>

        <span
          class="dropdown-count"
          data-js-notification-count
        >
          Loading...
        </span>

      </div>

      <div
        class="dropdown-list"
        data-js-notification-list
      >
        <p class="dropdown-notification-empty">
          Loading notifications...
        </p>
      </div>

      <div class="dropdown-footer">
        <span data-js-notification-footer>
          Please wait while notifications are loaded.
        </span>
      </div>

    </div>
  `;
}


// ==========================================
// RENDER NOTIFICATION TRIGGER
// ==========================================

export function renderNotificationTrigger(): string {
  return `
    <button
      type="button"
      class="topbar-icon-button topbar-notification-button"
      data-dropdown-trigger="notifications"
      aria-label="Open notifications"
      aria-expanded="false"
      aria-controls="notification-menu"
    >
      ${icon('notifications', 'icon--20')}

      <span
        class="topbar-notification-dot"
        data-js-notification-dot
        aria-hidden="true"
      ></span>

    </button>
  `;
}


// ==========================================
// RENDER NOTIFICATION ITEMS
// ==========================================

function renderNotificationItems(
  notifications: NotificationItem[]
): string {

  if (notifications.length === 0) {
    return `
      <p class="dropdown-notification-empty">
        No notifications available.
      </p>
    `;
  }

  return notifications.map(notification => `
    <article tabindex="0" role="button" data-notification-id="${escapeHtml(notification.id)}" class="dropdown-notification${
      notification.isNew
        ? ' dropdown-notification--new'
        : ''
    }">

      <div class="dropdown-notification__indicator"></div>

      <div class="dropdown-notification__content">

        <h4 class="dropdown-notification__title">
          ${escapeHtml(notification.title)}
        </h4>

        <p class="dropdown-notification__detail">
          ${escapeHtml(notification.detail)}
        </p>

        <span class="dropdown-notification__time">
          ${escapeHtml(notification.relativeTime)}
        </span>

      </div>

    </article>
  `).join('');
}


// ==========================================
// LOAD NOTIFICATIONS FROM SERVICE
// ==========================================

export async function initNotificationDropdown(container: HTMLElement): Promise<void> {
  const notificationList = container.querySelector<HTMLElement>('[data-js-notification-list]');
  const notificationCount = container.querySelector<HTMLElement>('[data-js-notification-count]');
  const notificationDot = container.querySelector<HTMLElement>('[data-js-notification-dot]');
  const notificationFooter = container.querySelector<HTMLElement>('[data-js-notification-footer]');
  if (!notificationList || !notificationCount || !notificationDot || !notificationFooter) return;
  const refresh = async () => {
    try {
      const [notifications, unreadCount] = await Promise.all([getNotifications(), getNewNotificationCount()]);
      notificationList.innerHTML = renderNotificationItems(notifications);
      notificationCount.textContent = `${unreadCount} New`;
      notificationDot.hidden = unreadCount === 0;
      notificationFooter.textContent = unreadCount === 0 ? 'You are all caught up.' : 'Select a notification to mark it as read.';
      notificationList.querySelectorAll<HTMLElement>('[data-notification-id]').forEach(item => {
        const markRead = () => { const id = item.dataset.notificationId; if (id) { markNotificationRead(id); void refresh(); } };
        item.addEventListener('click', markRead);
        item.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); markRead(); } });
      });
    } catch (error) {
      console.error('Unable to load notifications:', error);
      notificationList.innerHTML = '<p class="dropdown-notification-empty">Notifications could not be loaded.</p>';
      notificationCount.textContent = '0 New'; notificationDot.hidden = true;
      notificationFooter.textContent = 'Please try again later.';
    }
  };
  await refresh();
  window.setInterval(() => { void refresh(); }, 5000);
  window.addEventListener('storage', event => { if (event.key === 'unisphere_notifications_updated') void refresh(); });
  window.addEventListener('unisphere:notifications-updated', () => void refresh());
}
