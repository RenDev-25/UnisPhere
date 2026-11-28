import { getSession } from '../core/session';
import { homePath } from '../core/route-guard';
import { qs } from '../utils/dom';

// The landing page is shown to everyone. If someone is already
// signed in, the buttons at the bottom lead to their dashboard.
const session = getSession();

if (session) {
  const signIn = qs<HTMLAnchorElement>('[data-js-sign-in]');

  signIn.href = homePath(session.user.portal);
  signIn.textContent = 'Go to Dashboard';

  qs('[data-js-sign-up]').hidden = true;
}