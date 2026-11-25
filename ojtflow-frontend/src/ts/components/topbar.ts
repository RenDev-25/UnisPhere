
import type { Portal } from '../types/user.types';
import { getSession } from '../core/session';

import {
  renderNotificationDropdown,
  renderNotificationTrigger,
  initNotificationDropdown
} from './notification-dropdown';

import {
  renderProfileTrigger,
  renderProfileDropdown,
  initProfileDropdown
} from './profile-dropdown';

import { initDropdowns } from './dropdown';

import { escapeHtml } from '../utils/dom';

/* ========================================
   USER INITIALS
======================================== */

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

/* ========================================
   STUDENT USER BLOCK
======================================== */

function renderStudentUser(user: {
  name: string;
  roleLabel: string;
}): string {
  return `
    <div class="topbar-student-user">

      <span class="topbar-user-avatar">
        ${escapeHtml(getInitials(user.name))}
      </span>

      <span class="topbar-user-details">

        <span class="topbar-user-name">
          ${escapeHtml(user.name)}
        </span>

        <span class="topbar-user-role">
          ${escapeHtml(user.roleLabel)}
        </span>

      </span>

    </div>
  `;
}

/* ========================================
   TOPBAR RENDERING
======================================== */

export function renderTopbar(
  container: HTMLElement
): void {

  const portalValue = document.body.dataset.portal;

  if (
    portalValue !== 'student' &&
    portalValue !== 'coordinator'
  ) {
    console.error(
      'Topbar initialization failed: invalid data-portal.'
    );

    return;
  }

  const portal: Portal = portalValue;

  const session = getSession();

  if (!session || session.user.portal !== portal) {
    console.error(
      'Topbar initialization failed: invalid user session.'
    );

    return;
  }

  const user = session.user;

  const userBlock = portal === 'coordinator'
    ? renderProfileTrigger(user)
    : renderStudentUser(user);

  const profileDropdown = portal === 'coordinator'
    ? renderProfileDropdown(user)
    : '';

  container.innerHTML = `
    <div class="topbar-inner">

      <div class="topbar-left"></div>

      <div class="topbar-right">

        <div class="topbar-control">
          ${renderNotificationTrigger()}
          ${renderNotificationDropdown()}
        </div>

        <div class="topbar-control topbar-profile-control">
          ${userBlock}
          ${profileDropdown}
        </div>

      </div>

    </div>
  `;

  initDropdowns(container);

  void initNotificationDropdown(container);

  if (portal === 'coordinator') {
    initProfileDropdown(container);
  }
}
