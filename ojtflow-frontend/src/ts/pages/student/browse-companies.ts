// src/ts/pages/student/browse-companies.ts

import { initAppShell } from '../../core/app-shell';

import {
  mockCompanyDirectoryHeading,
  mockCompanyDirectoryFilters
} from '../../mocks/company.mock';

initAppShell();

const heading = mockCompanyDirectoryHeading;
const filters = mockCompanyDirectoryFilters;

// Render the exact heading values from temporary mock data.
const titleElement = document.querySelector<HTMLElement>(
  '.browse-companies-title-row .page-title'
);

const directoryChip = document.querySelector<HTMLElement>(
  '.browse-companies-title-row .chip'
);

const breadcrumbElement = document.querySelector<HTMLElement>(
  '.browse-companies-breadcrumb'
);

const countElement = document.querySelector<HTMLElement>(
  '.browse-companies-count'
);

const subtitleElement = document.querySelector<HTMLElement>(
  '.browse-companies-header .page-subtitle'
);

if (
  titleElement &&
  directoryChip &&
  breadcrumbElement &&
  countElement &&
  subtitleElement
) {
  titleElement.textContent = heading.title;
  directoryChip.textContent = heading.directoryName;

  breadcrumbElement.innerHTML = heading.breadcrumb
    .map((item, index) => {
      const separator = index > 0
        ? '<span aria-hidden="true">›</span>'
        : '';

      return `${separator}<span>${item}</span>`;
    })
    .join('');

  const lastBreadcrumb = breadcrumbElement.lastElementChild;

  if (lastBreadcrumb) {
    lastBreadcrumb.outerHTML = `<strong>${heading.breadcrumb[heading.breadcrumb.length - 1]}</strong>`;
  }

  countElement.textContent = heading.displayedRange;
  subtitleElement.textContent = heading.subtitle;
}

// Render filter defaults from temporary mock data.
const searchInput = document.querySelector<HTMLInputElement>(
  '#company-search'
);

const programFilter = document.querySelector<HTMLSelectElement>(
  '#program-filter'
);

const locationFilter = document.querySelector<HTMLSelectElement>(
  '#location-filter'
);

const availabilityFilter = document.querySelector<HTMLSelectElement>(
  '#availability-filter'
);

const helperText = document.querySelector<HTMLElement>(
  '.browse-companies-filter .filter-bar__helper'
);

const resetButton = document.querySelector<HTMLButtonElement>(
  '#reset-company-filters'
);

if (
  searchInput &&
  programFilter &&
  locationFilter &&
  availabilityFilter &&
  helperText
) {
  searchInput.placeholder = filters.searchPlaceholder;
  programFilter.options[0].textContent = filters.defaultProgram;
  locationFilter.options[0].textContent = filters.defaultLocation;
  availabilityFilter.options[0].textContent = filters.defaultAvailability;
  helperText.textContent = filters.helperText;
}

resetButton?.addEventListener('click', () => {
  if (searchInput) searchInput.value = '';
  if (programFilter) programFilter.selectedIndex = 0;
  if (locationFilter) locationFilter.selectedIndex = 0;
  if (availabilityFilter) availabilityFilter.selectedIndex = 0;
});