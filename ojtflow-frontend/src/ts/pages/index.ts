
// src/ts/pages/index.ts

import { getSession } from '../core/session';
import { homePath, loginPath } from '../core/route-guard';

const session = getSession();

if (!session) {
  // No active session: use Student Login as the default entry.
  window.location.replace(loginPath('student'));
} else if (
  session.user.portal === 'student' ||
  session.user.portal === 'coordinator'
) {
  // Send the user to their own portal dashboard.
  window.location.replace(homePath(session.user.portal));
} else {
  // Invalid portal value: return to the default login page.
  window.location.replace(loginPath('student'));
}
