
/* src/ts/components/sidebar.ts */

import {
  getNavigationItems,
  getPortalSectionLabel,
  logoutNavigationItem
} from '../core/navigation.config';

import {
  clearSession,
  getSession
} from '../core/session';

import type { Portal } from '../types/user.types';

import {
  escapeHtml,
  icon
} from '../utils/dom';

/* ========================================
   SIDEBAR CONFIGURATION
======================================== */

const LOGIN_ROUTES: Record<Portal, string> = {
  student: '/pages/auth/student-login.html',
  coordinator: '/pages/auth/coordinator-login.html',
  supervisor: '/pages/auth/supervisor-login.html'
};

const PORTAL_LABELS: Record<Portal, string> = {
  student: 'STUDENT PORTAL',
  coordinator: 'OJT COORDINATOR PORTAL',
  supervisor: 'SUPERVISOR PORTAL'
};

/* ========================================
   HELPER — LOGOUT
======================================== */

function handleLogout(portal: Portal): void {
  clearSession();

  window.location.replace(LOGIN_ROUTES[portal]);
}

/* ========================================
   RENDER — BRAND BLOCK
======================================== */

function renderBrand(portal: Portal): string {
  return `
    <div class="sidebar-brand">

      <div class="sidebar-brand__logo"
           aria-hidden="true">
        O
      </div>

      <div class="sidebar-brand__details">

        <p class="sidebar-brand__name">
          UNISphere
        </p>

        <p class="sidebar-brand__portal">
          ${PORTAL_LABELS[portal]}
        </p>

      </div>

    </div>
  `;
}

/* ========================================
   RENDER — NAVIGATION
======================================== */

function renderNavigation(
  portal: Portal,
  currentPage: string
): string {
  const items = getNavigationItems(portal);

  const links = items.map(item => {
    const isActive = currentPage === item.pageKey;

    return `
      <li class="sidebar-nav-item">

        
          <a
          href="${escapeHtml(item.href)}"
          class="sidebar-nav-link${isActive
            ? ' sidebar-nav-link--active'
            : ''}"
          title="${escapeHtml(item.label)}"
          ${isActive ? 'aria-current="page"' : ''}
          data-page-key="${escapeHtml(item.pageKey)}"
        >
        

          ${icon(item.icon, 'icon--20')}

          <span class="sidebar-nav-link__label">
            ${escapeHtml(item.label)}
          </span>

        </a>

      </li>
    `;
  }).join('');

  return `
    <nav
      class="sidebar-navigation"
      aria-label="Main navigation"
    >

      <p class="sidebar-section-label">
        ${getPortalSectionLabel(portal)}
      </p>

      <ul class="sidebar-nav-list">
        ${links}
      </ul>

    </nav>
  `;
}

/* ========================================
   RENDER — LOGOUT BUTTON
======================================== */

function renderLogout(): string {
  return `
    <button
      type="button"
      class="sidebar-logout"
      data-js-sidebar-logout
    >

      ${icon(logoutNavigationItem.icon, 'icon--20')}

      <span>
        ${escapeHtml(logoutNavigationItem.label)}
      </span>

    </button>
  `;
}

/* ========================================
   SIDEBAR INITIALIZATION
======================================== */

export function renderSidebar(
  container: HTMLElement
): void {
  const portalValue = document.body.dataset.portal;

  if (
    portalValue !== 'student' &&
    portalValue !== 'coordinator' &&
    portalValue !== 'supervisor'
  ) {
    console.error(
      'Sidebar initialization failed: invalid data-portal.'
    );

    return;
  }

  const portal: Portal = portalValue;

  const session = getSession();

  if (!session || session.user.portal !== portal) {
    console.error(
      'Sidebar initialization failed: invalid user session.'
    );

    return;
  }

  const currentPage =
    document.body.dataset.page || '';

  const bottomContent = renderLogout();

  container.innerHTML = `
    ${renderBrand(portal)}

    ${renderNavigation(portal, currentPage)}

    <div class="sidebar-bottom">
      ${bottomContent}
    </div>
  `;

  const logoutButton =
    container.querySelector<HTMLButtonElement>(
      '[data-js-sidebar-logout]'
    );

  logoutButton?.addEventListener('click', () => {
    handleLogout(portal);
  });
}
