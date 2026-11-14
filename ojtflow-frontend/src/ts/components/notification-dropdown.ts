
import { mockNotifications, newNotificationCount } from '../mocks/notification.mock';
import { escapeHtml, icon } from '../utils/dom';

export function renderNotificationDropdown(): string {
  const items = mockNotifications.map(notification => `
    <article class="dropdown-notification${notification.isNew ? ' dropdown-notification--new' : ''}">

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

        <span class="dropdown-count">
          ${newNotificationCount} New
        </span>

      </div>

      <div class="dropdown-list">
        ${items}
      </div>

      <div class="dropdown-footer">
        <span>You're all caught up on recent updates.</span>
      </div>

    </div>
  `;
}

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
        aria-hidden="true"
      ></span>

    </button>
  `;
}
