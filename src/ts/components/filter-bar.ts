
// src/ts/components/filter-bar.ts

export interface FilterBarOptions {
  root?: ParentNode;
  onChange: () => void;
  clearSelector?: string;
}

export function initFilterBar(options: FilterBarOptions): void {
  const root = options.root ?? document;
  const clearSelector =
    options.clearSelector ?? '[data-js-clear-filters]';

  root.querySelectorAll<HTMLInputElement>(
    '[data-js-search]'
  ).forEach((input) => {
    input.addEventListener('input', options.onChange);
  });

  root.querySelectorAll<HTMLSelectElement>(
    '[data-js-filter]'
  ).forEach((select) => {
    select.addEventListener('change', options.onChange);
  });

  root.querySelectorAll<HTMLButtonElement>(
    clearSelector
  ).forEach((button) => {
    button.addEventListener('click', () => {
      root.querySelectorAll<HTMLInputElement>(
        '[data-js-search]'
      ).forEach((input) => {
        input.value = '';
      });

      root.querySelectorAll<HTMLSelectElement>(
        '[data-js-filter]'
      ).forEach((select) => {
        select.selectedIndex = 0;
      });

      options.onChange();
    });
  });
}
