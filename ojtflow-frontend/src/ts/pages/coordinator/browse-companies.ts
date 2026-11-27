
/* =========================================================
   UNISphere — Coordinator Browse Companies
   UI Refinement — November 2026
   Phase 11: Service Integration

   Features preserved:
   - Published company records
   - Company summary statistics
   - Application counts
   - Search functionality
   - Academic program filtering
   - Company status filtering
   - View Details navigation
========================================================= */

import { initAppShell } from '../../core/app-shell';

import {
  getCoordinatorPublishedCompanies,
} from '../../services/company.service';

import {
  getCoordinatorApplicationCountsByCompany,
} from '../../services/application.service';


// =========================================================
// 1. SERVICE DATA TYPES
// =========================================================

type CompanyManagementData =
  Awaited<ReturnType<typeof getCoordinatorPublishedCompanies>>;

type CompanyRecord =
  CompanyManagementData['records'][number] & {
    applicationCount: number;
  };

let data: Omit<CompanyManagementData, 'records'> & {
  records: CompanyRecord[];
};


// =========================================================
// 2. INITIALIZE APPLICATION SHELL
// =========================================================

initAppShell();


// =========================================================
// 3. DOM ELEMENT
// =========================================================

function getRequiredElement<T extends HTMLElement>(
  selector: string,
): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(
      `Browse Companies: Required element ${selector} was not found.`,
    );
  }

  return element;
}

const pageContent =
  getRequiredElement<HTMLElement>('#page-content');


// =========================================================
// 4. HTML ESCAPING
// =========================================================

function escapeHtml(value: string): string {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return entities[character];
  });
}


// =========================================================
// 5. PAGE HEADING
// =========================================================

function renderPageHeading(): string {
  return `
    <section class="company-page-heading">

      <h1>Browse Companies</h1>

      <p>
        Browse published partner companies, view their details,
        and monitor student application counts.
      </p>

    </section>
  `;
}


// =========================================================
// 6. KPI SUMMARY CARDS
// =========================================================


// =========================================================
// 6. KPI SUMMARY CARDS
// Style: Student Management scorecard design
// =========================================================

function renderKpiCards(): string {
  const summary = data.summary;

  const cards = [
    {
      label: 'Published Companies',
      value: summary.totalCompanies,
      type: 'total',
    },
    {
      label: 'Active Companies',
      value: summary.activeCompanies,
      type: 'active',
    },
    {
      label: 'Available Slots',
      value: summary.availableSlots,
      type: 'slots',
    },
  ];

  return `
    <section
      class="company-kpi-grid"
      aria-label="Company statistics"
    >

      ${cards.map((card) => `
        <article class="company-kpi-card ${card.type}">

          <span class="company-kpi-label">
            ${card.label}
          </span>

          <strong class="company-kpi-value">
            ${card.value}
          </strong>

        </article>
      `).join('')}

    </section>
  `;
}


// =========================================================
// 7. PROGRAM FILTER OPTIONS
// =========================================================

function renderProgramOptions(): string {
  return data.programs
    .map((program) => `
      <option value="${escapeHtml(program)}">
        ${escapeHtml(program)}
      </option>
    `)
    .join('');
}


// =========================================================
// 8. COMPANY STATUS FILTER OPTIONS
// =========================================================

function renderStatusOptions(): string {
  return data.statuses
    .map((status) => `
      <option value="${escapeHtml(status)}">
        ${escapeHtml(status)}
      </option>
    `)
    .join('');
}


// =========================================================
// 9. PUBLISHED COMPANIES HEADER
// =========================================================

function renderRecordsHeader(): string {
  return `
    <div class="company-records-header">

      <div class="company-records-title-group">

        <h2 class="company-records-title">
          Published Companies
        </h2>

        <span class="company-total-chip">
          ${data.summary.totalCompanies} Published
        </span>

      </div>

    </div>
  `;
}


// =========================================================
// 10. SEARCH AND FILTER CONTROLS
// =========================================================

function renderFilters(): string {
  return `
    <div class="company-filter-toolbar">

      <div class="company-filter-control">

        <label for="company-search">
          Search Companies
        </label>

        <input
          type="search"
          id="company-search"
          class="company-search-input"
          placeholder="Search company name or location..."
          autocomplete="off"
        />

      </div>


      <div class="company-filter-control">

        <label for="company-program-filter">
          Academic Program
        </label>

        <select
          id="company-program-filter"
          class="company-filter-select"
        >

          <option value="">
            All Programs
          </option>

          ${renderProgramOptions()}

        </select>

      </div>


      <div class="company-filter-control">

        <label for="company-status-filter">
          Company Status
        </label>

        <select
          id="company-status-filter"
          class="company-filter-select"
        >

          <option value="">
            All Statuses
          </option>

          ${renderStatusOptions()}

        </select>

      </div>

    </div>
  `;
}


// =========================================================
// 11. COMPANY TABLE ROW
// =========================================================

function renderCompanyRow(
  company: CompanyRecord,
): string {

  const statusClass =
    company.status === 'Active'
      ? 'active'
      : 'inactive';

  const companyLogo = company.logoDataUrl
    ? `
      <img
        class="company-initials-tile company-logo-image"
        src="${escapeHtml(company.logoDataUrl)}"
        alt="${escapeHtml(company.name)} logo"
      />
    `
    : `
      <div class="company-initials-tile">
        ${escapeHtml(company.initials)}
      </div>
    `;

  return `
    <tr>

      <!-- COMPANY NAME -->

      <td data-label="Company Name">

        <div class="company-name-cell">

          ${companyLogo}

          <div class="company-name-information">

            <span class="company-name">
              ${escapeHtml(company.name)}
            </span>

            <span class="company-subtitle">
              ${escapeHtml(company.subtitle)}
            </span>

          </div>

        </div>

      </td>


      <!-- LOCATION -->

      <td data-label="Location">

        <span class="company-location">
          ${escapeHtml(company.location)}
        </span>

      </td>


      <!-- ACADEMIC PROGRAM -->

      <td data-label="Academic Program">

        <span class="company-program-tag">
          ${escapeHtml(company.program)}
        </span>

      </td>


      <!-- AVAILABLE SLOTS -->

      <td data-label="Available Slots">

        <span class="company-slot-count">
          ${company.availableSlots}
        </span>

      </td>


      <!-- COMPANY STATUS -->

      <td data-label="Company Status">

        <span class="company-status ${statusClass}">
          ${escapeHtml(company.status)}
        </span>

      </td>


      <!-- STUDENTS APPLIED -->

      <td data-label="Students Applied">

        <strong class="company-slot-count">
          ${company.applicationCount ?? 0}
        </strong>

      </td>


      <!-- ACTIONS -->

      <td data-label="Actions">

        <div class="company-row-actions">

          <a
            href="company-details.html?id=${encodeURIComponent(company.id)}"
            class="company-row-action"
          >
            View Details
          </a>

        </div>

      </td>

    </tr>
  `;
}


// =========================================================
// 12. COMPANY TABLE CONTENT
// =========================================================

function renderCompaniesTable(
  companies: CompanyRecord[],
): string {

  if (companies.length === 0) {

    const hasAnyCompany =
      data.records.length > 0;

    return `
      <tr>

        <td colspan="7" class="company-empty-state">

          <div class="company-empty-state__content">

            <strong>
              ${hasAnyCompany
                ? 'No matching companies found'
                : 'No published companies yet'}
            </strong>

            <p>
              ${hasAnyCompany
                ? 'Try changing your search or filters.'
                : 'There are no published company profiles available to browse yet.'}
            </p>

          </div>

        </td>

      </tr>
    `;
  }

  return companies
    .map((company) => renderCompanyRow(company))
    .join('');
}


// =========================================================
// 13. COMPANY TABLE
// =========================================================

function renderTable(): string {
  return `
    <div
      class="company-table-wrapper"
      role="region"
      aria-label="Published company records"
      tabindex="0"
    >

      <table class="company-table">

        <thead>

          <tr>

            <th scope="col">
              Company Name
            </th>

            <th scope="col">
              Location
            </th>

            <th scope="col">
              Academic Program
            </th>

            <th scope="col">
              Available Slots
            </th>

            <th scope="col">
              Company Status
            </th>

            <th scope="col">
              Students Applied
            </th>

            <th scope="col">
              Actions
            </th>

          </tr>

        </thead>


        <tbody id="company-table-body">

          ${renderCompaniesTable(data.records)}

        </tbody>

      </table>

    </div>
  `;
}


// =========================================================
// 14. PAGINATION FOOTER
// =========================================================

function renderPagination(): string {
  return `
    <footer class="company-table-footer">

      <p
        class="company-showing-text"
        id="company-showing-text"
        aria-live="polite"
      >
        Showing ${data.records.length} of ${data.records.length} companies
      </p>


      <nav
        class="company-pagination"
        aria-label="Company records pagination"
      >

        <button
          type="button"
          class="company-page-button"
          aria-label="Previous page"
          disabled
        >
          &lsaquo;
        </button>


        <button
          type="button"
          class="company-page-button active"
          aria-current="page"
        >
          1
        </button>


        <button
          type="button"
          class="company-page-button"
          aria-label="Next page"
          disabled
        >
          &rsaquo;
        </button>

      </nav>

    </footer>
  `;
}


// =========================================================
// 15. COMPLETE RECORDS CARD
// =========================================================

function renderRecordsCard(): string {
  return `
    <section
      class="company-records-card"
      aria-label="Published company records"
    >

      ${renderRecordsHeader()}

      ${renderFilters()}

      ${renderTable()}

      ${renderPagination()}

    </section>
  `;
}


// =========================================================
// 16. RENDER COMPLETE PAGE
// =========================================================

function renderBrowseCompaniesPage(): void {

  pageContent.innerHTML = `

    <div class="company-management-page">

      ${renderPageHeading()}

      ${renderKpiCards()}

      ${renderRecordsCard()}

    </div>

  `;
}


// =========================================================
// 17. SEARCH AND FILTER FUNCTIONALITY
// =========================================================

function initializeCompanyFilters(): void {

  const searchInput =
    getRequiredElement<HTMLInputElement>(
      '#company-search',
    );


  const programFilter =
    getRequiredElement<HTMLSelectElement>(
      '#company-program-filter',
    );


  const statusFilter =
    getRequiredElement<HTMLSelectElement>(
      '#company-status-filter',
    );


  const tableBody =
    getRequiredElement<HTMLTableSectionElement>(
      '#company-table-body',
    );


  const showingText =
    getRequiredElement<HTMLElement>(
      '#company-showing-text',
    );


  // -------------------------------------------------------
  // APPLY SEARCH AND FILTERS
  // -------------------------------------------------------

  function applyFilters(): void {

    const searchTerm = searchInput.value
      .trim()
      .toLowerCase();

    const selectedProgram =
      programFilter.value.trim().toLowerCase();

    const selectedStatus =
      statusFilter.value;


    const filteredCompanies =
      data.records.filter((company) => {

        // Search by company name or location

        const matchesSearch =
          company.name.toLowerCase().includes(searchTerm) ||
          company.location.toLowerCase().includes(searchTerm);


        // Search by academic program

        const acceptedPrograms = (
          company.acceptedPrograms || [company.program]
        ).map((value) =>
          String(value).trim().toLowerCase()
        );

        const companyProgram =
          String(company.program || '')
            .trim()
            .toLowerCase();

        const matchesProgram =
          !selectedProgram ||
          acceptedPrograms.includes(selectedProgram) ||
          companyProgram === selectedProgram;


        // Search by company status

        const matchesStatus =
          !selectedStatus ||
          company.status === selectedStatus;


        return (
          matchesSearch &&
          matchesProgram &&
          matchesStatus
        );

      });


    // Update table records

    tableBody.innerHTML =
      renderCompaniesTable(filteredCompanies);


    // Update result information

    showingText.textContent =
      `Showing ${filteredCompanies.length} of ${data.records.length} companies`;

  }


  // -------------------------------------------------------
  // SEARCH EVENT
  // -------------------------------------------------------

  searchInput.addEventListener(
    'input',
    applyFilters,
  );


  // -------------------------------------------------------
  // ACADEMIC PROGRAM FILTER EVENT
  // -------------------------------------------------------

  programFilter.addEventListener(
    'change',
    applyFilters,
  );


  // -------------------------------------------------------
  // COMPANY STATUS FILTER EVENT
  // -------------------------------------------------------

  statusFilter.addEventListener(
    'change',
    applyFilters,
  );

}


// =========================================================
// 18. PAGE INITIALIZATION
// PHASE 11 — SERVICE INTEGRATION
// =========================================================

async function initBrowseCompanies(): Promise<void> {

  try {

    // Load published companies from company service

    const companyData =
      await getCoordinatorPublishedCompanies();


    // Load student application counts by company

    const applicationCounts =
      await getCoordinatorApplicationCountsByCompany();


    // Combine company records and application counts

    data = {

      ...companyData,

      records: companyData.records.map((company) => ({

        ...company,

        applicationCount:
          applicationCounts[company.id] ?? 0,

      })),

    };


    // Render the complete Browse Companies page

    renderBrowseCompaniesPage();


    // Initialize search and filters

    initializeCompanyFilters();


  } catch (error: unknown) {

    console.error(
      'Failed to load published companies:',
      error,
    );


    pageContent.innerHTML = `

      <div class="company-management-page">

        <section class="company-page-heading">

          <h1>Browse Companies</h1>

          <p>
            Browse published partner companies and monitor student applications.
          </p>

        </section>

        <section class="company-records-card">

          <div class="company-empty-state">

            <div class="company-empty-state__content">

              <strong>
                Unable to load companies
              </strong>

              <p>
                Something went wrong while retrieving published company records.
                Please refresh the page and try again.
              </p>

            </div>

          </div>

        </section>

      </div>

    `;

  }

}


// =========================================================
// 19. INITIALIZE PAGE
// =========================================================

void initBrowseCompanies();


// =========================================================
// 20. SYNCHRONIZATION WITH OTHER PAGES
// =========================================================

// Refresh when the user returns to this page.
// This preserves the existing synchronization behavior.

window.addEventListener('focus', () => {
  window.location.reload();
});


// Refresh when company, application, or deployment
// records are updated in another browser tab.

window.addEventListener('storage', (event) => {

  const relevantKeys = [
    'ojtflow_applications',
    'ojtflow_deployments',
    'ojtflow_company_records_updated',
  ];

  if (
    event.key &&
    relevantKeys.includes(event.key)
  ) {
    window.location.reload();
  }

});
