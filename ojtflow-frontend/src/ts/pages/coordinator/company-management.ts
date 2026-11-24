
/* =========================================================
   OJTFlow — Coordinator Company Management
   Stage 7.5: Company Management Mockup
   Phase 11: Service Integration
   ========================================================= */

import { initAppShell } from '../../core/app-shell';
import { getCompanyManagement } from '../../services/company.service';

// =========================================================
// SERVICE DATA TYPES
// =========================================================

type CompanyManagementData =
  Awaited<ReturnType<typeof getCompanyManagement>>;

let data: CompanyManagementData;

type CompanyRecord = CompanyManagementData['records'][number];

// =========================================================
// INITIALIZE APPLICATION SHELL
// =========================================================

initAppShell();

// =========================================================
// DOM ELEMENT
// =========================================================

function getRequiredElement<T extends HTMLElement>(
  selector: string,
): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(
      `Company Management: Required element ${selector} was not found.`,
    );
  }

  return element;
}

const pageContent =
  getRequiredElement<HTMLElement>('#page-content');

// =========================================================
// HTML ESCAPING
// =========================================================

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
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
// 7.5.2 PAGE HEADING AND KPI CARDS
// =========================================================

function renderPageHeading(): string {
  return `
    <section class="company-page-heading">
      <h1>Company Management</h1>

      <p>
        Manage partner companies and monitor their available
        OJT opportunities and slots.
      </p>
    </section>
  `;
}

function renderKpiCards(): string {
  const summary = data.summary;

  const cards = [
    {
      label: 'Total Companies',
      value: summary.totalCompanies,
      icon: '▦',
      type: 'total',
    },
    {
      label: 'Active Companies',
      value: summary.activeCompanies,
      icon: '✓',
      type: 'active',
    },
    {
      label: 'Available Slots',
      value: summary.availableSlots,
      icon: '◫',
      type: 'slots',
    },
  ];

  return `
    <section
      class="company-kpi-grid"
      aria-label="Company statistics"
    >
      ${cards.map((card) => `
        <article class="company-kpi-card">

          <div
            class="company-kpi-icon ${card.type}"
            aria-hidden="true"
          >
            ${card.icon}
          </div>

          <div class="company-kpi-information">
            <span class="company-kpi-label">
              ${card.label}
            </span>

            <strong class="company-kpi-value">
              ${card.value}
            </strong>
          </div>

        </article>
      `).join('')}
    </section>
  `;
}

// =========================================================
// 7.5.3 RECORDS CARD AND FILTERS
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

function renderStatusOptions(): string {
  return data.statuses
    .map((status) => `
      <option value="${escapeHtml(status)}">
        ${escapeHtml(status)}
      </option>
    `)
    .join('');
}

function renderRecordsHeader(): string {
  return `
    <div class="company-records-header">

      <div class="company-records-title-group">

        <h2 class="company-records-title">
          Company Records
        </h2>

        <span class="company-total-chip">
          ${data.summary.totalCompanies} Total
        </span>

      </div>

      <a
        href="company-add.html"
        class="company-add-button"
      >
        <span aria-hidden="true">+</span>
        Add Company
      </a>

    </div>
  `;
}

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
          <option value="">All Programs</option>
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
          <option value="">All Statuses</option>
          ${renderStatusOptions()}
        </select>
      </div>

    </div>
  `;
}

// =========================================================
// 7.5.4 COMPANIES TABLE
// =========================================================

function renderCompanyRow(company: CompanyRecord): string {
  const statusClass =
    company.status === 'Active' ? 'active' : 'inactive';

  return `
    <tr>

      <td data-label="Company Name">
        <div class="company-name-cell">

          <div class="company-initials-tile">
            ${escapeHtml(company.initials)}
          </div>

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

      <td data-label="Location">
        <span class="company-location">
          ${escapeHtml(company.location)}
        </span>
      </td>

      <td data-label="Academic Program">
        <span class="company-program-tag">
          ${escapeHtml(company.program)}
        </span>
      </td>

      <td data-label="Available Slots">
        <span class="company-slot-count">
          ${company.availableSlots}
        </span>
      </td>

      <td data-label="Company Status">
        <span class="company-status ${statusClass}">
          ${escapeHtml(company.status)}
        </span>
      </td>

      <td data-label="Actions">
        <div class="company-row-actions">

          <a
            href="company-details.html?id=${encodeURIComponent(company.id)}"
            class="company-row-action"
          >
            View Details
          </a>

          <a
            href="company-edit.html?id=${encodeURIComponent(company.id)}"
            class="company-row-action"
          >
            Edit
          </a>

        </div>
      </td>

    </tr>
  `;
}

function renderCompaniesTable(
  companies: CompanyRecord[],
): string {
  if (companies.length === 0) {
    return `
      <tr>
        <td colspan="6" class="company-empty-state">
          No companies found matching your filters.
        </td>
      </tr>
    `;
  }

  return companies.map(renderCompanyRow).join('');
}

function renderTable(): string {
  return `
    <div class="company-table-wrapper">

      <table class="company-table">

        <thead>
          <tr>
            <th scope="col">Company Name</th>
            <th scope="col">Location</th>
            <th scope="col">Academic Program</th>
            <th scope="col">Available Slots</th>
            <th scope="col">Company Status</th>
            <th scope="col">Actions</th>
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
// 7.5.5 FOOTER PAGINATION
// =========================================================

function renderPagination(): string {
  return `
    <footer class="company-table-footer">

      <p
        class="company-showing-text"
        id="company-showing-text"
        aria-live="polite"
      >
        Showing ${Math.min(data.records.length, 5)} of ${data.records.length} companies
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
          disabled
          aria-label="Next page"
        >
          &rsaquo;
        </button>

      </nav>

    </footer>
  `;
}

// =========================================================
// COMPLETE RECORDS CARD
// =========================================================

function renderRecordsCard(): string {
  return `
    <section
      class="company-records-card"
      aria-label="Company records"
    >

      ${renderRecordsHeader()}

      ${renderFilters()}

      ${renderTable()}

      ${renderPagination()}

    </section>
  `;
}

// =========================================================
// RENDER COMPLETE PAGE
// =========================================================

function renderCompanyManagementPage(): void {
  pageContent.innerHTML = `
    ${renderPageHeading()}

    ${renderKpiCards()}

    ${renderRecordsCard()}
  `;
}

// =========================================================
// SEARCH AND FILTER FUNCTIONALITY
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

  function applyFilters(): void {
    const searchTerm = searchInput.value
      .trim()
      .toLowerCase();

    const selectedProgram = programFilter.value;
    const selectedStatus = statusFilter.value;

    const filteredCompanies = data.records.filter(
      (company) => {
        const matchesSearch =
          company.name.toLowerCase().includes(searchTerm) ||
          company.location.toLowerCase().includes(searchTerm);

        const matchesProgram =
          !selectedProgram ||
          company.program === selectedProgram;

        const matchesStatus =
          !selectedStatus ||
          company.status === selectedStatus;

        return (
          matchesSearch &&
          matchesProgram &&
          matchesStatus
        );
      },
    );

    tableBody.innerHTML =
      renderCompaniesTable(filteredCompanies);

    showingText.textContent =
      `Showing ${filteredCompanies.length} of ${data.records.length} companies`;
  }

  // Search event
  searchInput.addEventListener(
    'input',
    applyFilters,
  );

  // Academic program filter
  programFilter.addEventListener(
    'change',
    applyFilters,
  );

  // Company status filter
  statusFilter.addEventListener(
    'change',
    applyFilters,
  );
}

// =========================================================
// PAGE INITIALIZATION — PHASE 11 SERVICE INTEGRATION
// =========================================================

async function initCompanyManagement(): Promise<void> {
  data = await getCompanyManagement();

  renderCompanyManagementPage();
  initializeCompanyFilters();
}

void initCompanyManagement().catch((error: unknown) => {
  console.error('Failed to load company management:', error);
});
