
// src/ts/components/toast.ts

import { escapeHtml } from '../utils/dom';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

let toastHost: HTMLElement | null = null;

function getToastHost(): HTMLElement {
  if (toastHost?.isConnected) return toastHost;

  const existingHost = document.getElementById('toast-host');

  if (existingHost) {
    toastHost = existingHost;
    return existingHost;
  }

  toastHost = document.createElement('div');
  toastHost.id = 'toast-host';
  toastHost.className = 'toast-host';
  toastHost.setAttribute('role', 'status');
  toastHost.setAttribute('aria-live', 'polite');
  toastHost.setAttribute('aria-atomic', 'false');

  document.body.appendChild(toastHost);

  return toastHost;
}

export function showToast(
  type: ToastType,
  message: string,
  durationMs = 3500
): void {
  const host = getToastHost();
  const toast = document.createElement('div');

  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

  toast.innerHTML = `
    <span class="toast__message">${escapeHtml(message)}</span>
    <button
      class="toast__close"
      type="button"
      aria-label="Dismiss notification"
      data-js-dismiss-toast
    >
      <span aria-hidden="true">&times;</span>
    </button>
  `;

  host.appendChild(toast);

  let timeoutId = 0;

  const dismiss = (): void => {
    window.clearTimeout(timeoutId);
    toast.remove();
  };

  toast.querySelector('[data-js-dismiss-toast]')
    ?.addEventListener('click', dismiss);

  if (durationMs > 0) {
    timeoutId = window.setTimeout(dismiss, durationMs);
  }
}
