
/* src/ts/components/dropdown.ts */

export function initDropdowns(
  container: HTMLElement
): void {
  const triggers = Array.from(
    container.querySelectorAll<HTMLButtonElement>(
      '[data-dropdown-trigger]'
    )
  );

  const panels = Array.from(
    container.querySelectorAll<HTMLElement>(
      '[data-dropdown-panel]'
    )
  );

  function closeAll(): void {
    panels.forEach(panel => {
      panel.hidden = true;
    });

    triggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function openDropdown(name: string): void {
    closeAll();

    const trigger = triggers.find(
      item => item.dataset.dropdownTrigger === name
    );

    const panel = panels.find(
      item => item.dataset.dropdownPanel === name
    );

    if (!trigger || !panel) return;

    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.stopPropagation();

      const name = trigger.dataset.dropdownTrigger;
      const panel = panels.find(
        item => item.dataset.dropdownPanel === name
      );

      if (!name || !panel) return;

      if (!panel.hidden) {
        closeAll();
      } else {
        openDropdown(name);
      }
    });
  });

  // Close when clicking outside the topbar.
 document.addEventListener('click', event => {
  const target = event.target;

  if (!(target instanceof Node)) return;

  const clickedInsideDropdown = [
    ...triggers,
    ...panels
  ].some(element => element.contains(target));

  if (!clickedInsideDropdown) {
    closeAll();
  }
});
  // Close when pressing Escape.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeAll();
    }
  });
}
