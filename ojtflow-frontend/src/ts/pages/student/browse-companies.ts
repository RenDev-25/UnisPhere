// src/ts/pages/student/browse-companies.ts

import { initAppShell } from '../../core/app-shell';
import { getCompanyDirectory } from '../../services/company.service';
import type { CompanyRecord } from '../../types/company.types';

initAppShell();

async function loadCompanyDirectory(): Promise<void> {
  const data = await getCompanyDirectory();

  const {
    heading,
    filters,
    programSection,
    companies
  } = data;

  const PAGE_SIZE = 6;
  const TEMP_STUDENT_NAME = 'Alex Student';
  const TEMP_STUDENT_NUMBER = '2026-0001';

  let currentPage = 1;


// Escape mock values before inserting them into HTML templates.
function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };

    return entities[character];
  });
}

function getElement<T extends HTMLElement>(
  selector: string
): T | null {
  return document.querySelector<T>(selector);
}

// ========================================
// PAGE HEADING
// ========================================

const titleElement = getElement<HTMLElement>(
  '.browse-companies-title-row .page-title'
);

const directoryChip = getElement<HTMLElement>(
  '.browse-companies-title-row .chip'
);

const breadcrumbElement = getElement<HTMLElement>(
  '.browse-companies-breadcrumb'
);

const countElement = getElement<HTMLElement>(
  '.browse-companies-count'
);

const subtitleElement = getElement<HTMLElement>(
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
  countElement.textContent = heading.displayedRange;
  subtitleElement.textContent = heading.subtitle;

  breadcrumbElement.innerHTML = heading.breadcrumb
    .map((item, index) => {
      const separator = index > 0
        ? '<span aria-hidden="true">›</span>'
        : '';

      return `${separator}<span>${escapeHTML(item)}</span>`;
    })
    .join('');

  const lastBreadcrumb = breadcrumbElement.lastElementChild;

  if (lastBreadcrumb) {
    lastBreadcrumb.outerHTML =
      `<strong>${escapeHTML(
        heading.breadcrumb[heading.breadcrumb.length - 1]
      )}</strong>`;
  }
}

// ========================================
// PROGRAM SECTION HEADING
// ========================================

const programTitle = getElement<HTMLElement>(
  '#company-program-title'
);

const programCount = getElement<HTMLElement>(
  '#company-program-count'
);

const programFocus = getElement<HTMLElement>(
  '#company-program-focus'
);

if (programTitle) {
  programTitle.textContent =
    `${programSection.sectionLabel}: ${programSection.programName}`;
}

if (programCount) {
  programCount.textContent =
    `${programSection.partnerCount} Partners`;
}

if (programFocus) {
  programFocus.textContent =
    programSection.focusTags.join(' • ');
}

// ========================================
// FILTER CONTROLS
// ========================================

const searchInput = getElement<HTMLInputElement>(
  '#company-search'
);

const programFilter = getElement<HTMLSelectElement>(
  '#program-filter'
);

const locationFilter = getElement<HTMLSelectElement>(
  '#location-filter'
);

const availabilityFilter = getElement<HTMLSelectElement>(
  '#availability-filter'
);

const helperText = getElement<HTMLElement>(
  '.browse-companies-filter .filter-bar__helper'
);

const resetButton = getElement<HTMLButtonElement>(
  '#reset-company-filters'
);

function addFilterOptions(
  select: HTMLSelectElement,
  values: string[]
): void {
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

if (
  searchInput &&
  programFilter &&
  locationFilter &&
  availabilityFilter
) {
  searchInput.placeholder = filters.searchPlaceholder;

  programFilter.options[0].textContent =
    filters.defaultProgram;

  locationFilter.options[0].textContent =
    filters.defaultLocation;

  availabilityFilter.options[0].textContent =
    filters.defaultAvailability;

addFilterOptions(
  programFilter,
  [...new Set(companies.map((company) => company.program))]
);

addFilterOptions(
  locationFilter,
  [...new Set(companies.map((company) => company.municipality))]
);

  addFilterOptions(availabilityFilter, [
    'Accepting Applications',
    'Not Accepting Applications'
  ]);
}

if (helperText) {
  helperText.textContent = filters.helperText;
}

// ========================================
// COMPANY GRID
// ========================================

const companyGrid = getElement<HTMLElement>(
  '#company-grid'
);

const paginationSummary = getElement<HTMLElement>(
  '#company-pagination-summary'
);

const paginationNumbers = getElement<HTMLElement>(
  '#company-pagination-numbers'
);

const previousButton = getElement<HTMLButtonElement>(
  '#company-previous-page'
);

const nextButton = getElement<HTMLButtonElement>(
  '#company-next-page'
);

function getFilteredCompanies(): CompanyRecord[] {
  const searchTerm = searchInput?.value.trim().toLowerCase() ?? '';
  const selectedProgram = programFilter?.value ?? '';
  const selectedLocation = locationFilter?.value ?? '';
  const selectedAvailability = availabilityFilter?.value ?? '';

  return companies.filter((company) => {
    const matchesSearch =
      !searchTerm ||
      company.name.toLowerCase().includes(searchTerm) ||
      company.location.toLowerCase().includes(searchTerm);

    const matchesProgram =
      !selectedProgram ||
      company.program === selectedProgram;

    const matchesLocation =
      !selectedLocation ||
      company.municipality === selectedLocation;

    const matchesAvailability =
      !selectedAvailability ||
      (selectedAvailability === 'Accepting Applications'
        ? company.availability === 'accepting'
        : company.availability === 'not-accepting');

    return (
      matchesSearch &&
      matchesProgram &&
      matchesLocation &&
      matchesAvailability
    );
  });
}

function getAvailabilityMarkup(company: CompanyRecord): string {
  if (company.availability === 'accepting') {
    return `
      <span class="company-card__availability company-card__availability--accepting">
        Accepting Applications
      </span>
    `;
  }

  return `
    <span class="company-card__availability company-card__availability--closed">
      Not Accepting Applications
    </span>
  `;
}

function renderCompanyCard(company: CompanyRecord): string {
  const availabilityText = company.availability === 'accepting'
    ? `${company.slotsOpen} Slots Open`
    : 'Slots Filled';

  const slotsClass = company.availability === 'accepting'
    ? ''
    : 'company-card__slots--filled';

  return `
    <article class="company-card">

      <div class="company-card__top">

        <div class="company-card__identity">

          <div class="company-card__initials" aria-hidden="true">
            ${escapeHTML(company.initials)}
          </div>

          <h3 class="company-card__name">
            ${escapeHTML(company.name)}
          </h3>

        </div>

        ${getAvailabilityMarkup(company)}

      </div>

      <p class="company-card__location">
        &#9906; ${escapeHTML(company.location)}
      </p>

      <span class="company-card__program">
        ${escapeHTML(company.program)}
      </span>

      <p class="company-card__slots ${slotsClass}">
        ${escapeHTML(availabilityText)}
      </p>

      <div class="company-card__actions">

        <button
          class="btn btn--secondary company-card__view"
          type="button"
          data-company-id="${escapeHTML(company.id)}"
        >
          View Details
        </button>

      </div>

    </article>
  `;
}

function renderPagination(
  filteredCompanies: CompanyRecord[]
): void {
  if (
    !paginationSummary ||
    !paginationNumbers ||
    !previousButton ||
    !nextButton
  ) {
    return;
  }

  const hasActiveFilters =
    Boolean(searchInput?.value.trim()) ||
    Boolean(programFilter?.value) ||
    Boolean(locationFilter?.value) ||
    Boolean(availabilityFilter?.value);

  const totalItems = hasActiveFilters
    ? filteredCompanies.length
    : heading.totalCompanies;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / PAGE_SIZE)
  );

  currentPage = Math.min(currentPage, totalPages);

  const firstItem = totalItems === 0
    ? 0
    : (currentPage - 1) * PAGE_SIZE + 1;

  const lastItem = Math.min(
    currentPage * PAGE_SIZE,
    totalItems
  );

  paginationSummary.textContent =
    `Showing ${firstItem} to ${lastItem} of ${totalItems} partner establishments`;

  previousButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;

  paginationNumbers.innerHTML = '';

  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'company-pagination__number';
    button.textContent = String(page);

    if (page === currentPage) {
      button.setAttribute('aria-current', 'page');
    }

    button.addEventListener('click', () => {
      currentPage = page;
      renderCompanies();
    });

    paginationNumbers.appendChild(button);
  }
}

function renderCompanies(): void {
  if (!companyGrid) return;

  const filteredCompanies = getFilteredCompanies();

  const hasActiveFilters =
    Boolean(searchInput?.value.trim()) ||
    Boolean(programFilter?.value) ||
    Boolean(locationFilter?.value) ||
    Boolean(availabilityFilter?.value);

  const totalItems = hasActiveFilters
    ? filteredCompanies.length
    : heading.totalCompanies;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  if (visibleCompanies.length > 0) {
    companyGrid.innerHTML = visibleCompanies
      .map(renderCompanyCard)
      .join('');
  } else if (!hasActiveFilters && currentPage > 1) {
    companyGrid.innerHTML = `
      <div class="company-grid__notice">
        The remaining six partner records are not included in this
        temporary six-company mock dataset.
      </div>
    `;
  } else {
    companyGrid.innerHTML = `
      <div class="company-grid__empty">
        No partner establishments match your search or filters.
      </div>
    `;
  }

  if (totalItems === 0) {
    currentPage = 1;
  }

  renderPagination(filteredCompanies);
}

// ========================================
// COMPANY DETAILS MODAL
// ========================================

const companyModal = getElement<HTMLDialogElement>(
  '#company-details-modal'
);

const modalIdentity = getElement<HTMLElement>(
  '#company-modal-identity'
);

const modalBody = getElement<HTMLElement>(
  '#company-modal-body'
);

const modalCloseButton = getElement<HTMLButtonElement>(
  '#company-modal-close'
);

const modalCloseIcon = getElement<HTMLButtonElement>(
  '#company-modal-close-icon'
);

const modalApplyButton = getElement<HTMLButtonElement>(
  '#company-modal-apply'
);

function renderTags(tags: string[]): string {
  return `
    <div class="company-modal__tags">
      ${tags.map((tag) => `
        <span class="company-modal__tag">
          ${escapeHTML(tag)}
        </span>
      `).join('')}
    </div>
  `;
}

function renderChecklist(items: string[]): string {
  return `
    <ul class="company-modal__checklist">
      ${items.map((item) => `
        <li>
          <span class="company-modal__check" aria-hidden="true">✓</span>
          <span>${escapeHTML(item)}</span>
        </li>
      `).join('')}
    </ul>
  `;
}

function openCompanyModal(company: CompanyRecord): void {
  if (
    !companyModal ||
    !modalIdentity ||
    !modalBody ||
    !modalApplyButton
  ) {
    return;
  }


  const accepting = company.availability === 'accepting';

  const availabilityMarkup = accepting
    ? `
      <span class="company-card__availability company-card__availability--accepting">
        Accepting Applications
      </span>
    `
    : `
      <span class="company-card__availability company-card__availability--closed">
        Not Accepting Applications
      </span>
    `;

  modalIdentity.innerHTML = `
    <div class="company-modal__initials" aria-hidden="true">
      ${escapeHTML(company.initials)}
    </div>

    <div class="company-modal__identity-content">

      <h2 class="company-modal__name" id="company-modal-name">
        ${escapeHTML(company.name)}
      </h2>

      ${availabilityMarkup}

      <p class="company-modal__address">
        &#9906; ${escapeHTML(company.location)}
      </p>

    </div>
  `;

  modalBody.innerHTML = `
    <section class="company-modal__section">
      <h3>About / Description</h3>
      <p>${escapeHTML(company.description)}</p>
    </section>

    <section class="company-modal__section">
      <h3>Accepted Academic Programs</h3>
      ${renderTags(company.acceptedPrograms)}
    </section>

    <section class="company-modal__section">
      <h3>OJT Opportunity &amp; Slots</h3>
      <p>
        <strong>
          ${accepting
            ? `${company.slotsOpen} Slots Open`
            : 'Slots Filled'}
        </strong>
      </p>
      <div style="margin-top: 9px;">
        ${renderTags(company.opportunityFocus)}
      </div>
    </section>

    <section class="company-modal__section">
      <h3>Key Requirements</h3>
      ${renderChecklist(company.requirements)}
    </section>

    <section class="company-modal__section">
      <h3>Preferred Skills</h3>
      ${renderChecklist(company.preferredSkills)}
    </section>

    <section class="company-modal__section">
      <h3>Contact Person &amp; Information</h3>

      <div class="company-modal__contact">

        <div class="company-modal__contact-item">
          <span class="company-modal__contact-label">
            Contact Person
          </span>
          <span class="company-modal__contact-value">
            ${escapeHTML(company.contactName)}
          </span>
        </div>

        <div class="company-modal__contact-item">
          <span class="company-modal__contact-label">
            Role
          </span>
          <span class="company-modal__contact-value">
            ${escapeHTML(company.contactRole)}
          </span>
        </div>

        <div class="company-modal__contact-item">
          <span class="company-modal__contact-label">
            Phone
          </span>
          <span class="company-modal__contact-value">
            ${escapeHTML(company.contactPhone)}
          </span>
        </div>

        <div class="company-modal__contact-item">
          <span class="company-modal__contact-label">
            Email
          </span>
          <span class="company-modal__contact-value">
            <a href="mailto:${escapeHTML(company.contactEmail)}">
              ${escapeHTML(company.contactEmail)}
            </a>
          </span>
        </div>

      </div>
    </section>

    <div class="company-modal__student-status">
      <strong>Student Status: Eligible</strong>
      (${escapeHTML(TEMP_STUDENT_NAME)} •
      ${escapeHTML(TEMP_STUDENT_NUMBER)})
      — Requirements Cleared
    </div>
  `;

  modalApplyButton.disabled = !accepting;

  if (accepting) {
    modalApplyButton.textContent = 'Apply Now';
  } else {
    modalApplyButton.textContent = 'Not Accepting Applications';
  }

  companyModal.showModal();
}

function closeCompanyModal(): void {
  if (companyModal?.open) {
    companyModal.close();
  }


}

companyGrid?.addEventListener('click', (event: MouseEvent) => {
  const target = event.target;

  if (!(target instanceof Element)) return;

  const viewButton = target.closest<HTMLButtonElement>(
    '[data-company-id]'
  );

  if (!viewButton) return;

  const companyId = viewButton.dataset.companyId;

  const company = companies.find(
  (item) => item.id === companyId
);

  if (company) {
    openCompanyModal(company);
  }
});

modalCloseButton?.addEventListener(
  'click',
  closeCompanyModal
);

modalCloseIcon?.addEventListener(
  'click',
  closeCompanyModal
);

// Clicking the backdrop closes the dialog.
companyModal?.addEventListener('click', (event: MouseEvent) => {
  if (event.target === companyModal) {
    closeCompanyModal();
  }
});

// Native dialog behavior supports Escape to close.
// No real application submission is implemented in this mockup.

// ========================================
// FILTER AND PAGINATION EVENTS
// ========================================

function handleFilterChange(): void {
  currentPage = 1;
  renderCompanies();
}

searchInput?.addEventListener('input', handleFilterChange);
programFilter?.addEventListener('change', handleFilterChange);
locationFilter?.addEventListener('change', handleFilterChange);
availabilityFilter?.addEventListener('change', handleFilterChange);

resetButton?.addEventListener('click', () => {
  if (searchInput) searchInput.value = '';
  if (programFilter) programFilter.selectedIndex = 0;
  if (locationFilter) locationFilter.selectedIndex = 0;
  if (availabilityFilter) availabilityFilter.selectedIndex = 0;

  currentPage = 1;
  renderCompanies();
});

previousButton?.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    renderCompanies();
  }
});

nextButton?.addEventListener('click', () => {
  const filteredCompanies = getFilteredCompanies();

  const hasActiveFilters =
    Boolean(searchInput?.value.trim()) ||
    Boolean(programFilter?.value) ||
    Boolean(locationFilter?.value) ||
    Boolean(availabilityFilter?.value);

  const totalItems = hasActiveFilters
    ? filteredCompanies.length
    : heading.totalCompanies;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / PAGE_SIZE)
  );

  if (currentPage < totalPages) {
    currentPage += 1;
    renderCompanies();
  }
});

// Initial page render.
renderCompanies();

}

void loadCompanyDirectory();