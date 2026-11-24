
// src/ts/components/copy-value.ts

import { showToast } from './toast';

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const temporary = document.createElement('textarea');
  temporary.value = value;
  temporary.style.position = 'fixed';
  temporary.style.opacity = '0';

  document.body.appendChild(temporary);
  temporary.select();

  const successful = document.execCommand('copy');
  temporary.remove();

  if (!successful) {
    throw new Error('Clipboard copy failed.');
  }
}

export function initCopyValues(): void {
  document.addEventListener('click', async (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const trigger = target.closest<HTMLElement>(
      '[data-js-copy], [data-js-copy-value]'
    );

    if (!trigger) return;

    const value =
      trigger.dataset.jsCopyValue ??
      trigger.dataset.jsCopy ??
      trigger.textContent?.trim() ??
      '';

    if (!value) return;

    try {
      await copyText(value);

      const originalText = trigger.dataset.originalLabel ??
        trigger.textContent?.trim() ??
        '';

      trigger.dataset.originalLabel = originalText;
      trigger.classList.add('is-copied');

      if (trigger instanceof HTMLButtonElement) {
        trigger.textContent = 'Copied';
      }

      showToast('success', 'Copied');

      window.setTimeout(() => {
        trigger.classList.remove('is-copied');

        if (
          trigger instanceof HTMLButtonElement &&
          trigger.isConnected
        ) {
          trigger.textContent = originalText;
        }
      }, 1400);
    } catch {
      showToast('error', 'Could not copy');
    }
  });
}
