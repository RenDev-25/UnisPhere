
/* src/ts/components/topbar.ts */

import type { Portal } from '../types/user.types';
import { getNavigationItems } from '../core/navigation.config';
import { getSession } from '../core/session';

import { academicYearConfig } from '../mocks/notification.mock';

import {
  renderNotificationDropdown,
  renderNotificationTrigger
} from './notification-dropdown';

import {
  renderProfileTrigger,
  renderProfileDropdown,
  initProfileDropdown
} from './profile-dropdown';

import { initDropdowns } from './dropdown';

import {
  escapeHtml,
  icon
} from '../utils/dom';

/* ========================================
   PAGE TITLE
======================================== */

function getPageTitle(
  portal: Portal,
  pageKey: string
): string {
  const item = getNavigationItems(portal).find(
    navigationItem => navigationItem.pageKey === pageKey
  );

  if (item) {
    return item.label;
  }

  return portal === 'coordinator'
    ? 'Coordinator Workspace'
    : 'Portal Console';
}

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
   BREADCRUMB
======================================== */

function renderBreadcrumb(
  portal: Portal,
  pageTitle: string
): string {
  if (portal === 'coordinator') {
    return `
      <nav
        class="topbar-breadcrumb"
        aria-label="Breadcrumb"
      >

        <span>BatStateU Portal</span>

        ${icon('chevron_right', 'icon--16')}

        <span>Coordinator Workspace</span>

        ${icon('chevron_right', 'icon--16')}

        <strong>${escapeHtml(pageTitle)}</strong>

      </nav>
    `;
  }

  return `
    <nav
      class="topbar-breadcrumb topbar-breadcrumb--student"
      aria-label="Breadcrumb"
    >

      <span>BatStateU OJTFlow</span>

      ${icon('chevron_right', 'icon--16')}

      <span>Portal Console</span>

      ${icon('chevron_right', 'icon--16')}

      <strong>${escapeHtml(pageTitle)}</strong>

    </nav>
  `;
}

/* ========================================
   ACADEMIC YEAR CHIP
======================================== */

function renderAcademicYear(): string {
  return `
    <div class="topbar-academic-year">

      ${icon('calendar_month', 'icon--18')}

      <span>
        ${escapeHtml(academicYearConfig.label)}
        <span class="topbar-academic-year__separator">•</span>
        ${escapeHtml(academicYearConfig.semester)}
      </span>

    </div>
  `;
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

  const currentPage =
    document.body.dataset.page || '';

  const pageTitle = getPageTitle(portal, currentPage);

  const userBlock = portal === 'coordinator'
    ? renderProfileTrigger(user)
    : renderStudentUser(user);

  const profileDropdown = portal === 'coordinator'
    ? renderProfileDropdown(user)
    : '';

  container.innerHTML = `
    <div class="topbar-inner">

      <div class="topbar-left">
        ${renderBreadcrumb(portal, pageTitle)}
      </div>

      <div class="topbar-right">

        ${renderAcademicYear()}

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

  if (portal === 'coordinator') {
    initProfileDropdown(container);
  }
}
