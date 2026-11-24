
/* src/ts/components/bottom-nav.ts */

import { getNavigationItems } from '../core/navigation.config';
import type { Portal } from '../types/user.types';
import { escapeHtml, icon } from '../utils/dom';

export function initBottomNav(): void {
  const portalValue = document.body.dataset.portal;

  if (portalValue !== 'student' && portalValue !== 'coordinator') {
    return;
  }

  const portal: Portal = portalValue;
  const currentPage = document.body.dataset.page ?? '';
  const items = getNavigationItems(portal);

  let nav = document.querySelector<HTMLElement>('[data-js-bottom-nav]');

  if (!nav) {
    nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.dataset.jsBottomNav = '';
    nav.setAttribute('aria-label', 'Mobile navigation');
    document.body.appendChild(nav);
  }

  nav.innerHTML = items.map((item) => {
    const active = item.pageKey === currentPage;

    return `
      <a
        class="bottom-nav__item${active ? ' bottom-nav__item--active' : ''}"
        href="${escapeHtml(item.href)}"
        ${active ? 'aria-current="page"' : ''}
        aria-label="${escapeHtml(item.label)}"
        ${active ? 'title="Current page"' : ''}
      >
        <span class="bottom-nav__icon" aria-hidden="true">
          ${icon(item.icon, 'icon--20')}
        </span>

        <span class="bottom-nav__label">
          ${escapeHtml(item.label)}
        </span>
      </a>
    `;
  }).join('');
}
