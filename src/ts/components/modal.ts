
// src/ts/components/modal.ts

const openerByModal = new Map<string, HTMLElement | null>();
let previousBodyOverflow = '';
let openModalCount = 0;
let initialized = false;

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

function getFocusable(modal: HTMLElement): HTMLElement[] {
  return Array.from(
    modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((element) => {
    return !element.hasAttribute('hidden') &&
      element.getAttribute('aria-hidden') !== 'true';
  });
}

export function openModal(id: string): void {
  const modal = document.getElementById(id);
  if (!modal || !modal.hidden) return;

  openerByModal.set(
    id,
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
  );

  if (openModalCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  openModalCount += 1;
  modal.hidden = false;
  modal.setAttribute('aria-modal', 'true');

  const focusable = getFocusable(modal);
  (focusable[0] ?? modal).focus();
}

export function closeModal(id: string): void {
  const modal = document.getElementById(id);
  if (!modal || modal.hidden) return;

  modal.hidden = true;
  modal.removeAttribute('aria-modal');

  openModalCount = Math.max(0, openModalCount - 1);

  if (openModalCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }

  const opener = openerByModal.get(id);
  openerByModal.delete(id);

  if (opener?.isConnected) {
    opener.focus();
  }
}

function handleDocumentKeydown(event: KeyboardEvent): void {
  const openModals = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[role="dialog"]:not([hidden]), .modal:not([hidden])'
    )
  );

  const modal = openModals[openModals.length - 1];
  if (!modal) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeModal(modal.id);
    return;
  }

  if (event.key !== 'Tab') return;

  const focusable = getFocusable(modal);

  if (focusable.length === 0) {
    event.preventDefault();
    modal.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function initModals(): void {
  if (initialized) return;
  initialized = true;

  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const openTrigger = target.closest<HTMLElement>(
      '[data-js-open-modal]'
    );

    if (openTrigger) {
      openModal(openTrigger.dataset.jsOpenModal ?? '');
      return;
    }

    const closeTrigger = target.closest<HTMLElement>(
      '[data-js-close-modal]'
    );

    if (closeTrigger) {
      closeModal(closeTrigger.dataset.jsCloseModal ?? '');
      return;
    }

    const backdrop = target.closest<HTMLElement>(
      '[data-js-modal-backdrop]'
    );

    if (backdrop && target === backdrop) {
      closeModal(backdrop.id);
    }
  });

  document.addEventListener('keydown', handleDocumentKeydown);
}
