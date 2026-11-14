
import type { User } from '../types/user.types';
import { clearSession } from '../core/session';
import { escapeHtml, icon } from '../utils/dom';

const COORDINATOR_LOGIN =
  '/pages/auth/coordinator-login.html';

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

export function renderProfileTrigger(user: User): string {
  const initials = getInitials(user.name);

  return `
    <button
      type="button"
      class="topbar-user-button"
      data-dropdown-trigger="profile"
      aria-label="Open profile menu"
      aria-expanded="false"
      aria-controls="profile-menu"
    >

      <span class="topbar-user-avatar">
        ${escapeHtml(initials)}
      </span>

      <span class="topbar-user-details">

        <span class="topbar-user-name">
          ${escapeHtml(user.name)}
        </span>

        <span class="topbar-user-role">
          ${escapeHtml(user.roleLabel)}
        </span>

      </span>

      ${icon('keyboard_arrow_down', 'icon--18')}

    </button>
  `;
}

export function renderProfileDropdown(user: User): string {
  const initials = getInitials(user.name);

  return `
    <div
    id="profile-menu"
    class="dropdown-panel profile-dropdown"
    data-dropdown-panel="profile"
    hidden
  >

      <div class="profile-dropdown__identity">

        <span class="profile-dropdown__avatar">
          ${escapeHtml(initials)}
        </span>

        <div class="profile-dropdown__details">

          <p class="profile-dropdown__name">
            ${escapeHtml(user.name)}
          </p>

          <p class="profile-dropdown__email">
            ${escapeHtml(user.email)}
          </p>

        </div>

      </div>

      <div class="dropdown-divider"></div>

      <div class="profile-dropdown__menu">

        <button
          type="button"
          class="dropdown-menu-item"
          disabled
          title="Not available yet"
        >
          ${icon('manage_accounts', 'icon--20')}
          <span>Profile Settings</span>
          <span class="dropdown-menu-item__disabled-label">
            Soon
          </span>
        </button>

        <button
          type="button"
          class="dropdown-menu-item"
          disabled
          title="Not available yet"
        >
          ${icon('history', 'icon--20')}
          <span>Audit Logs</span>
          <span class="dropdown-menu-item__disabled-label">
            Soon
          </span>
        </button>

      </div>

      <div class="dropdown-divider"></div>

      <button
        type="button"
        class="dropdown-menu-item dropdown-menu-item--danger"
        data-js-profile-logout
      >
        ${icon('logout', 'icon--20')}
        <span>Sign out</span>
      </button>

    </div>
  `;
}

export function initProfileDropdown(
  container: HTMLElement
): void {
  const logoutButton =
    container.querySelector<HTMLButtonElement>(
      '[data-js-profile-logout]'
    );

  logoutButton?.addEventListener('click', () => {
    clearSession();
    window.location.replace(COORDINATOR_LOGIN);
  });
}
