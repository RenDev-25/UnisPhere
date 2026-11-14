
/* src/ts/core/app-shell.ts */

import type { Portal } from '../types/user.types';

import { requirePortal } from './route-guard';

import { renderSidebar } from '../components/sidebar';
import { renderTopbar } from '../components/topbar';

/**
 * Initialize the shared application shell.
 * Call once at the top of every portal page script.
 */
export function initAppShell(): void {

  // Get and validate the current portal.
  const portalValue = document.body.dataset.portal;

  if (
    portalValue !== 'student' &&
    portalValue !== 'coordinator'
  ) {
    throw new Error(
      'Application shell initialization failed: invalid data-portal.'
    );
  }

  const portal: Portal = portalValue;

  // Validate the user's session and portal access.
  const session = requirePortal(portal);

  // Stop rendering if the guard redirected the user.
  if (!session) return;

  // Locate the sidebar and topbar containers.
  const sidebarElement = document.querySelector<HTMLElement>(
    '[data-js-sidebar]'
  );

  const topbarElement = document.querySelector<HTMLElement>(
    '[data-js-topbar]'
  );

  if (!sidebarElement || !topbarElement) {
    throw new Error(
      'Application shell initialization failed: sidebar or topbar container is missing.'
    );
  }

  // Render shared application components.
  renderSidebar(sidebarElement);
  renderTopbar(topbarElement);
}
