
// src/ts/core/app-shell.ts

import type { Portal } from '../types/user.types';

import { requirePortal } from './route-guard';

import { renderSidebar } from '../components/sidebar';
import { renderTopbar } from '../components/topbar';

import { initAssistant } from '../components/ai-assistant';

import {
  getPageAssistantContext,
  getAssistantPromptReply
} from '../services/assistant.service';

import { initModals } from '../components/modal';
import { initCopyValues } from '../components/copy-value';

import { initBottomNav } from '../components/bottom-nav';


// ==========================================
// INITIALIZE AI ASSISTANT
// ==========================================

async function initializeAssistant(
  portal: Portal,
  pageKey: string
): Promise<void> {

  try {
    // Load assistant context through the service.
    const assistantContext = await getPageAssistantContext(
      portal,
      pageKey
    );

    // Initialize assistant with service-based replies.
    initAssistant(
      portal,
      assistantContext,
      getAssistantPromptReply
    );

  } catch (error) {
    console.error(
      'AI Assistant initialization failed:',
      error
    );
  }
}


// ==========================================
// INITIALIZE APPLICATION SHELL
// ==========================================

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


  // ========================================
  // OJTFLOW AI ASSISTANT
  // ========================================

  const pageKey =
    document.body.dataset.page || '';

  // Initialize assistant asynchronously through its service.
  void initializeAssistant(portal, pageKey);


  // ========================================
  // PHASE 9 — SHARED INTERACTIONS
  // ========================================

  initModals();
  initCopyValues();


  // ========================================
  // PHASE 10 — MOBILE NAVIGATION
  // ========================================

  initBottomNav();
}
