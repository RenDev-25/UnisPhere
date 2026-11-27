
// src/ts/components/count-up.ts

function prefersReducedMotion(): boolean {
  return window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
}

function animateNumber(
  element: HTMLElement,
  target: number,
  durationMs: number
): void {
  if (prefersReducedMotion()) {
    element.textContent = String(target);
    return;
  }

  const start = performance.now();

  const tick = (now: number): void => {
    const progress = Math.min(
      1,
      (now - start) / durationMs
    );

    const eased = 1 - Math.pow(1 - progress, 3);

    element.textContent = String(
      Math.round(target * eased)
    );

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      // Ensure the final value is exact.
      element.textContent = String(target);
    }
  };

  element.textContent = '0';
  requestAnimationFrame(tick);
}

export function initCountUp(durationMs = 650, animate = true): void {
  const reduceMotion = prefersReducedMotion();

  document.querySelectorAll<HTMLElement>(
    '[data-js-count-to]'
  ).forEach((element) => {
    const rawValue = element.dataset.jsCountTo ?? '';
    const target = Number(rawValue);

    if (rawValue.trim() === '' || !Number.isFinite(target)) {
      return;
    }

    if (element.dataset.countUpTarget === rawValue && Number(element.textContent) === target) return;
    element.dataset.countUpTarget = rawValue;

    if (!animate || reduceMotion) {
      element.textContent = String(target);
      return;
    }

    animateNumber(element, target, durationMs);
  });

  document.querySelectorAll<HTMLElement>(
    '[data-js-progress-to]'
  ).forEach((element) => {
    const rawValue = element.dataset.jsProgressTo ?? '';
    const target = Number(rawValue);

    if (rawValue.trim() === '' || !Number.isFinite(target)) {
      return;
    }

    if (element.dataset.progressTarget === rawValue && element.style.width === `${Math.min(100, Math.max(0, target))}%`) return;
    element.dataset.progressTarget = rawValue;

    const percentage = Math.min(100, Math.max(0, target));

    if (!animate || reduceMotion) {
      element.style.width = `${percentage}%`;
      return;
    }

    element.style.width = '0%';

    requestAnimationFrame(() => {
      element.style.transition =
        `width ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      element.style.width = `${percentage}%`;
    });
  });

  document.querySelectorAll<HTMLElement>(
    '[data-js-refresh]'
  ).forEach((button) => {
    button.addEventListener('click', () => {
      if (reduceMotion) return;

      button.classList.remove('is-refreshing');
      void button.offsetWidth;
      button.classList.add('is-refreshing');

      window.setTimeout(() => {
        button.classList.remove('is-refreshing');
      }, 700);
    });
  });
}
