
import type { Portal } from '../types/user.types';
import { getSession, setSession } from '../core/session';

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
    portalValue !== 'coordinator' &&
    portalValue !== 'supervisor'
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

  let synchronizedUser = session.user;
  try {
    const accountKey = portal === 'student' ? 'ojtflow_student_accounts' : portal === 'supervisor' ? 'ojtflow_supervisor_accounts' : '';
    if (accountKey) {
      const stored = JSON.parse(localStorage.getItem(accountKey) || '[]') as Array<{user?: typeof session.user}>;
      const account = stored.find(item => item.user?.id === session.user.id)?.user;
      if (account) {
        synchronizedUser = account;
        if (JSON.stringify(account) !== JSON.stringify(session.user)) setSession({ ...session, user: account });
      }
    }
  } catch (error) {
    console.warn('Unable to refresh the signed-in profile from its account record.', error);
  }

  const user = synchronizedUser;

  const userBlock = portal !== 'student'
    ? renderProfileTrigger(user)
    : renderStudentUser(user);

  const profileDropdown = portal !== 'student'
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

  if (portal !== 'student') {
    initProfileDropdown(container);
  }
}
