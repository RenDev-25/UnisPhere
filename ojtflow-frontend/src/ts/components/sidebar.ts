
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
  coordinator: '/pages/auth/coordinator-login.html'
};

const PORTAL_LABELS: Record<Portal, string> = {
  student: 'STUDENT PORTAL',
  coordinator: 'OJT COORDINATOR PORTAL'
};

/* ========================================
   HELPER — USER INITIALS
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
          OJTFlow
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
   RENDER — STUDENT USER CARD
======================================== */

function renderStudentUserCard(
  name: string,
  identifier: string,
  program: string
): string {
  const initials = getInitials(name);

  /*
   * G-17 — Identifier label clarification:
   * "Student ID" is the temporary display label.
   * Confirm whether the final specification
   * requires "Student ID" or "Student Number".
   */

  return `
    <div class="sidebar-user">

      <div
        class="sidebar-user__avatar"
        aria-label="${escapeHtml(name)}"
      >
        ${escapeHtml(initials)}
      </div>

      <div class="sidebar-user__details">

        <p class="sidebar-user__name">
          ${escapeHtml(name)}
        </p>

        <p class="sidebar-user__meta">
          Student ID: ${escapeHtml(identifier || 'N/A')}
        </p>

        <p class="sidebar-user__meta">
          ${escapeHtml(program || 'Program not specified')}
        </p>

      </div>

    </div>
  `;
}

/* ========================================
   RENDER — COORDINATOR USER CARD
======================================== */

function renderCoordinatorUserCard(
  name: string,
  role: string
): string {
  const initials = getInitials(name);

  return `
    <div class="sidebar-user">

      <div
        class="sidebar-user__avatar"
        aria-label="${escapeHtml(name)}"
      >
        ${escapeHtml(initials)}
      </div>

      <div class="sidebar-user__details">

        <p class="sidebar-user__name">
          ${escapeHtml(name)}
        </p>

        <p class="sidebar-user__meta">
          ${escapeHtml(role)}
        </p>

      </div>

    </div>
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
    portalValue !== 'coordinator'
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

  const user = session.user;

 
const userCard = portal === 'student'
  ? renderStudentUserCard(
      user.name,
      user.identifier ?? '',
      user.program ?? ''
    )
  : renderCoordinatorUserCard(
      user.name,
      user.roleLabel
    );

  /*
   * Student:
   * User card first, Log Out last.
   *
   * Coordinator:
   * Log Out first, user card last.
   */

  const bottomContent = portal === 'student'
    ? `${userCard}${renderLogout()}`
    : `${renderLogout()}${userCard}`;

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
