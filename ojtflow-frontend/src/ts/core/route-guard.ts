
// src/ts/core/route-guard.ts

import type { Portal, Session } from '../types/user.types';
import { getSession } from './session';

export const loginPath = (portal: Portal): string =>
  `/pages/auth/${portal}-login.html`;

export const homePath = (portal: Portal): string =>
  `/pages/${portal}/dashboard.html`;

/**
 * Returns the session when the user may view this portal.
 * Otherwise, redirects to the correct login page or dashboard.
 */
export function requirePortal(portal: Portal): Session | null {
  const session = getSession();

  // No session: redirect to the login page for the requested portal.
  if (!session) {
    window.location.replace(loginPath(portal));
    return null;
  }

  const sessionPortal = session.user.portal;

  // Validate the portal stored in the session.
  if (sessionPortal !== 'student' && sessionPortal !== 'coordinator') {
    window.location.replace(loginPath(portal));
    return null;
  }

  // A user cannot access the other portal.
  if (sessionPortal !== portal) {
    window.location.replace(homePath(sessionPortal));
    return null;
  }

  // The session belongs to this portal.
  return session;
}
