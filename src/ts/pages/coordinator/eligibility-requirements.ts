
/* =========================================================
   UNISphere — Coordinator Eligibility & Requirements
   Stage 7.9: Eligibility & Requirements Mockup
   ========================================================= */

import { initAppShell } from '../../core/app-shell';

import { getEligibilityPage } from '../../services/eligibility.service';

import type {
  EligibilityStatus,
} from '../../types/eligibility.types';

import {
  renderKpiCard,
} from '../../components/kpi-card';

import {
  renderStatusBadge,
} from '../../components/status-badge';

import {
  escapeHtml,
} from '../../utils/dom';

// =========================================================
// INITIALIZE APPLICATION SHELL
// =========================================================

initAppShell();

// =========================================================
// PAGE DATA
// =========================================================

type EligibilityPageData =
  Awaited<ReturnType<typeof getEligibilityPage>>;

let data: EligibilityPageData;

type EligibilityRecord = EligibilityPageData['records'][number];

// =========================================================
// REQUIRED ELEMENT HELPER
// =========================================================

function getRequiredElement<T extends HTMLElement>(
  selector: string,
): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(
      `Eligibility & Requirements: Required element ${selector} was not found.`,
    );
  }

  return element;
}

const pageContent =
  getRequiredElement<HTMLElement>('#page-content');

// =========================================================
// 7.9.2 — PAGE HEADING
// =========================================================

function renderPageHeading(): string {
  return `
    <section class="eligibility-heading">

      <div class="page-heading">

        <h1 class="page-title">
          Eligibility &amp; Requirements
        </h1>

        <p class="page-subtitle">
          Review student eligibility and monitor
          pre-deployment requirement completion.
        </p>

      </div>

    </section>
  `;
}

// =========================================================
// 7.9.2 — KPI CARDS
// =========================================================

function renderEligibilityKpis(): string {
  const summary = data.summary;

  return `
    <section
      class="eligibility-kpi-grid"
      aria-label="Eligibility summary"
    >

      ${renderKpiCard({
        label: 'Total Students',
        value: summary.totalStudents,
        iconName: 'groups',
        accent: 'navy',
      })}

      ${renderKpiCard({
        label: 'For Review',
        value: summary.forReview,
        iconName: 'pending_actions',
        accent: 'amber',
      })}

      ${renderKpiCard({
        label: 'Eligible',
        value: summary.eligible,
        iconName: 'verified',
        accent: 'green',
      })}

      ${renderKpiCard({
        label: 'Incomplete Requirements',
        value: summary.incompleteRequirements,
        iconName: 'assignment_late',
        accent: 'red',
      })}

    </section>
  `;
}

// =========================================================
// 7.9.3 — PROGRAM FILTER OPTIONS
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
// 7.9.3 — STATUS FILTER OPTIONS
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
// 7.9.3 — RECORDS HEADER AND FILTERS
// =========================================================

function renderRecordsHeader(): string {
  return `
    <div class="eligibility-records-header">

      <div class="eligibility-records-title-group">

        <h2 class="section-card__title">
          Student Eligibility Records
        </h2>

        <span class="eligibility-records-count">
          Showing ${data.records.length} of ${data.records.length} active entries
        </span>

      </div>

    </div>
  `;
}

function renderFilters(): string {
  return `
    <div class="eligibility-filter-toolbar">

      <div class="field eligibility-search-field">

        <label
          class="field__label"
          for="eligibility-search"
        >
          Search Students
        </label>

        <input
          class="input"
          type="search"
          id="eligibility-search"
          placeholder="Search student name or number..."
          autocomplete="off"
        />

      </div>

      <div class="field eligibility-filter-field">

        <label
          class="field__label"
          for="eligibility-program-filter"
        >
          Academic Program
        </label>

        <div class="select-wrap">
          <select
            class="select"
            id="eligibility-program-filter"
          >
            <option value="">All Programs</option>
            ${renderProgramOptions()}
          </select>
        </div>

      </div>

      <div class="field eligibility-filter-field">

        <label
          class="field__label"
          for="eligibility-status-filter"
        >
          Eligibility Status
        </label>

        <div class="select-wrap">
          <select
            class="select"
            id="eligibility-status-filter"
          >
            <option value="">All Statuses</option>
            ${renderStatusOptions()}
          </select>
        </div>

      </div>

    </div>
  `;
}

// =========================================================
// 7.9.4 — ELIGIBILITY TABLE ROW
// =========================================================

function renderEligibilityRow(
  record: EligibilityRecord,
): string {
  return `
    <tr>

      <td data-label="Student Name">
        <span class="eligibility-student-name">
          ${escapeHtml(record.studentName)}
        </span>
      </td>

      <td data-label="Student Number">
        <span class="table-id">
          ${escapeHtml(record.studentNumber)}
        </span>
      </td>

      <td data-label="Academic Program">
        <span class="tag--program">
          ${escapeHtml(record.program)}
        </span>
      </td>

      <td data-label="Requirements">
        <span class="eligibility-requirements-count">
          ${escapeHtml(record.requirements)}
        </span>
      </td>

      <td data-label="Eligibility Status">
        ${renderStatusBadge(record.status)}
      </td>

      <td data-label="Action">
        <div class="table-actions">

          <a
            class="eligibility-view-link"
            href="eligibility-details.html?id=${encodeURIComponent(record.id)}"
          >
            View Details
            <span class="icon" aria-hidden="true">
              chevron_right
            </span>
          </a>

        </div>
      </td>

    </tr>
  `;
}

// =========================================================
// 7.9.4 — TABLE CONTENT
// =========================================================

function renderEligibilityTable(
  records: EligibilityRecord[],
): string {
  if (records.length === 0) {
    return `
      <tr>
        <td colspan="6" class="eligibility-empty-cell">

          <div class="empty-state empty-state--compact">

            <span
              class="empty-state__icon"
              aria-hidden="true"
            >
              search_off
            </span>

            <h3 class="empty-state__title">
              No students found
            </h3>

            <p class="empty-state__description">
              No student records match the selected search
              or filters. Clear the filters to view the records.
            </p>

            <div class="empty-state__action">
              <button
                type="button"
                class="btn btn--secondary btn--small"
                data-js-clear-filters
              >
                Clear Filters
              </button>
            </div>

          </div>

        </td>
      </tr>
    `;
  }

  return records
    .map(renderEligibilityRow)
    .join('');
}

// =========================================================
// 7.9.4 — TABLE MARKUP
// =========================================================

function renderTable(): string {
  return `
    <div class="table-container">

      <div class="table-scroll">

        <table class="data-table eligibility-table">

          <thead>
            <tr>
              <th scope="col">Student Name</th>
              <th scope="col">Student Number</th>
              <th scope="col">Academic Program</th>
              <th scope="col">Requirements</th>
              <th scope="col">Eligibility Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody id="eligibility-table-body">
            ${renderEligibilityTable(data.records)}
          </tbody>

        </table>

      </div>

    </div>
  `;
}

// =========================================================
// 7.9.5 — TABLE FOOTER AND PAGINATION
// =========================================================

function renderPagination(): string {
  return `
    <footer class="pagination eligibility-pagination">

      <p
        class="pagination__range"
        id="eligibility-showing-text"
        aria-live="polite"
      >
        Showing ${data.records.length ? 1 : 0}-${data.records.length} of ${data.records.length} students
      </p>

      <nav
        class="pagination__controls"
        aria-label="Eligibility records pagination"
      >

        <button
          type="button"
          class="pagination__button"
          aria-label="Previous page"
          disabled
        >
          chevron_left
        </button>

        <button
          type="button"
          class="pagination__button is-active"
          aria-current="page"
          aria-label="Page 1"
          disabled
        >
          1
        </button>

        <button
          type="button"
          class="pagination__button"
          aria-label="Next page"
          disabled
        >
          chevron_right
        </button>

      </nav>

    </footer>
  `;
}

// =========================================================
// 7.9.3–7.9.5 — COMPLETE RECORDS CARD
// =========================================================

function renderRecordsCard(): string {
  return `
    <section
      class="section-card eligibility-records-card"
      aria-label="Student eligibility records"
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

function renderEligibilityPage(): void {
  pageContent.innerHTML = `
    <div class="page eligibility-page">

      ${renderPageHeading()}

      ${renderEligibilityKpis()}

      ${renderRecordsCard()}

    </div>
  `;
}

// =========================================================
// SEARCH AND FILTER FUNCTIONALITY
// =========================================================

function initializeEligibilityFilters(): void {
  const searchInput =
    getRequiredElement<HTMLInputElement>(
      '#eligibility-search',
    );

  const programFilter =
    getRequiredElement<HTMLSelectElement>(
      '#eligibility-program-filter',
    );

  const statusFilter =
    getRequiredElement<HTMLSelectElement>(
      '#eligibility-status-filter',
    );

  const tableBody =
    getRequiredElement<HTMLTableSectionElement>(
      '#eligibility-table-body',
    );

  const showingText =
    getRequiredElement<HTMLElement>(
      '#eligibility-showing-text',
    );

  function applyFilters(): void {
    const searchTerm = searchInput.value
      .trim()
      .toLowerCase();

    const selectedProgram = programFilter.value;

    const selectedStatus =
      statusFilter.value as EligibilityStatus | '';

    const filteredRecords = data.records.filter(
      (record) => {
        const matchesSearch =
          record.studentName.toLowerCase().includes(searchTerm) ||
          record.studentNumber.toLowerCase().includes(searchTerm);

        const matchesProgram =
          !selectedProgram ||
          record.program === selectedProgram;

        const matchesStatus =
          !selectedStatus ||
          record.status === selectedStatus;

        return (
          matchesSearch &&
          matchesProgram &&
          matchesStatus
        );
      },
    );

    tableBody.innerHTML =
      renderEligibilityTable(filteredRecords);

    if (filteredRecords.length === 0) {
      showingText.textContent = 'Showing 0 students';
    } else {
      showingText.textContent =
        `Showing 1-${filteredRecords.length} of ${data.records.length} students`;
    }

    initializeClearFilters();
  }

  function initializeClearFilters(): void {
    const clearButton =
      document.querySelector<HTMLButtonElement>(
        '[data-js-clear-filters]',
      );

    clearButton?.addEventListener('click', () => {
      searchInput.value = '';
      programFilter.value = '';
      statusFilter.value = '';

      applyFilters();
    });
  }

  searchInput.addEventListener('input', applyFilters);
  programFilter.addEventListener('change', applyFilters);
  statusFilter.addEventListener('change', applyFilters);

  initializeClearFilters();
}

// =========================================================
// START PAGE
// =========================================================

async function initEligibilityRequirements(): Promise<void> {
  data = await getEligibilityPage();

  renderEligibilityPage();
  initializeEligibilityFilters();
}

void initEligibilityRequirements().catch((error: unknown) => {
  console.error('Failed to load eligibility records:', error);
});

window.addEventListener('focus', () => window.location.reload());
window.addEventListener('storage', event => { if (event.key === 'ojtflow_student_requirements' || event.key === 'ojtflow_student_eligibility' || event.key === 'ojtflow_student_accounts') window.location.reload(); });
