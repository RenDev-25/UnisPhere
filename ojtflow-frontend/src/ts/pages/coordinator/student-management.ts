
/*
 * OJTFlow — Coordinator Student Management
 * Stage 7.3: Student Management Mockup
 */

import { initAppShell } from '../../core/app-shell';
import { renderKpiCard } from '../../components/kpi-card';
import { renderStatusBadge } from '../../components/status-badge';
import { escapeHtml, icon, qs } from '../../utils/dom';
import {
  mockCoordinatorStudentsPage,
} from '../../mocks/coordinator-students.mock';



// =========================================================
// INITIALIZE APPLICATION SHELL
// =========================================================

initAppShell();

// =========================================================
// DATA
// =========================================================

// TEMP MOCK — replaced by student.service.ts in Phase 11.
const data = mockCoordinatorStudentsPage;

const pageContent = qs<HTMLElement>('#page-content');

// Infer the student record type directly from the mock data.
type StudentRecord = (typeof data.records)[number];

// =========================================================
// HELPER: GET INITIALS
// =========================================================

function getStudentInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

// =========================================================
// 7.3.2 PAGE HEADING
// =========================================================

function renderHeading(): string {
  return `
    <header class="page-header student-management-heading">

      <div class="page-heading">
        <h1 class="page-title">
          ${escapeHtml(data.heading.title)}
        </h1>

        <p class="page-subtitle">
          ${escapeHtml(data.heading.subtitle)}
        </p>
      </div>

      <span class="student-management-cohort">
        ${escapeHtml(data.heading.cohortPill)}
      </span>

    </header>
  `;
}

// =========================================================
// 7.3.3 THREE KPI CARDS
// =========================================================

function renderKpis(): string {
  const summary = data.summary;

  return `
    <section
      class="student-management-kpi-grid"
      aria-label="Student statistics"
    >

      ${renderKpiCard({
        label: 'Total Students',
        value: summary.totalStudents,
        accent: 'navy',
      })}

      ${renderKpiCard({
        label: 'Eligible Students',
        value: summary.eligibleStudents,
        accent: 'red',
      })}

      ${renderKpiCard({
        label: 'Not Yet Eligible',
        value: summary.notYetEligibleStudents,
        accent: 'amber',
      })}

    </section>
  `;
}

// =========================================================
// 7.3.4 RECORDS CARD AND FILTERS
// =========================================================

function renderOptions(values: readonly string[]): string {
  return values
    .map(
      (value) => `
        <option value="${escapeHtml(value)}">
          ${escapeHtml(value)}
        </option>
      `,
    )
    .join('');
}

function renderRecordsHeader(): string {
  const card = data.recordsCard;

  return `
    <div class="student-records-header">

      <div class="student-records-title-group">
        <h2 class="section-card__title">
          ${escapeHtml(card.title)}
        </h2>

        <span class="chip">
          ${escapeHtml(card.totalChip)}
        </span>
      </div>

      <p class="student-records-sync">
        ${icon('sync')}
        ${escapeHtml(card.syncNote)}
      </p>

    </div>
  `;
}

function renderFilters(): string {
  return `
    <div class="student-filter-toolbar">

      <div class="field student-search-field">
        <label class="field__label" for="student-search">
          Search Students
        </label>

        <input
          class="input"
          type="search"
          id="student-search"
          placeholder="Search name, email or student number..."
          autocomplete="off"
        />
      </div>

      <div class="field student-filter-field">
        <label class="field__label" for="student-program-filter">
          Academic Program
        </label>

        <div class="select-wrap">
          <select class="select" id="student-program-filter">
            <option value="">All Programs</option>
            ${renderOptions(data.programs)}
          </select>
        </div>
      </div>

      <div class="field student-filter-field">
        <label class="field__label" for="student-eligibility-filter">
          Eligibility Status
        </label>

        <div class="select-wrap">
          <select class="select" id="student-eligibility-filter">
            <option value="">All Statuses</option>
            ${renderOptions(data.eligibilityStatuses)}
          </select>
        </div>
      </div>

      <div class="field student-filter-field">
        <label class="field__label" for="student-ojt-filter">
          OJT Status
        </label>

        <div class="select-wrap">
          <select class="select" id="student-ojt-filter">
            <option value="">All Statuses</option>
            ${renderOptions(data.ojtStatuses)}
          </select>
        </div>
      </div>

      <button
        type="button"
        class="btn btn--secondary student-filter-clear"
        id="student-clear-filters"
      >
        Clear
      </button>

    </div>
  `;
}

// =========================================================
// 7.3.5 STUDENTS TABLE
// =========================================================


function renderStudentRow(student: StudentRecord): string {
  return `
    <tr>
      <td data-label="Student Name">
        <div class="table-user">
          <span class="table-user__avatar" aria-hidden="true">
            ${escapeHtml(getStudentInitials(student.fullName))}
          </span>

          <div class="table-user__details">
            <span class="table-user__name">
              ${escapeHtml(student.fullName)}
            </span>
          </div>
        </div>
      </td>

      <td data-label="Student Number">
        <span class="table-id">
          ${escapeHtml(student.studentNumber)}
        </span>
      </td>

      <td data-label="Academic Program">
        <span class="tag--program">
          ${escapeHtml(student.program)}
        </span>
      </td>

      <td data-label="Eligibility Status">
        ${renderStatusBadge(student.eligibilityStatus)}
      </td>

      <td data-label="OJT Status">
        ${renderStatusBadge(student.ojtStatus)}
      </td>

      <td data-label="Action">
        <div class="table-actions">
          <a
            class="student-view-link"
            href="student-details.html?id=${encodeURIComponent(student.id)}"
          >
            View Details
            ${icon('chevron_right')}
          </a>
        </div>
      </td>
    </tr>
  `;
}


// =========================================================
// NO-RESULTS STATE
// =========================================================

function renderNoResults(): string {
  return `
    <tr>
      <td colspan="6" class="student-empty-cell">

        <div class="empty-state empty-state--compact">

          <span class="empty-state__icon" aria-hidden="true">
            ${icon('search_off')}
          </span>

          <h3 class="empty-state__title">
            No students found
          </h3>

          <p class="empty-state__description">
            No student records match the selected search or filters.
            Clear the filters to view the records.
          </p>

          <div class="empty-state__action">
            <button
              type="button"
              class="btn btn--secondary btn--small"
              data-js-clear-filters
            >
              Clear
            </button>
          </div>

        </div>

      </td>
    </tr>
  `;
}

function renderRows(records: readonly StudentRecord[]): string {
  if (records.length === 0) {
    return renderNoResults();
  }

  return records.map(renderStudentRow).join('');
}

function renderTable(): string {
  return `
    <div class="table-container">
      <div class="table-scroll">

        <table class="data-table student-table">

          <thead>
            <tr>
              <th scope="col">Student Name</th>
              <th scope="col">Student Number</th>
              <th scope="col">Academic Program</th>
              <th scope="col">Eligibility Status</th>
              <th scope="col">OJT Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody id="student-table-body">
            ${renderRows(data.records)}
          </tbody>

        </table>

      </div>
    </div>
  `;
}

// =========================================================
// 7.3.6 FOOTER AND PAGINATION
// =========================================================

function showingText(
  visibleCount: number,
  isFiltered: boolean,
): string {
  if (visibleCount === 0) {
    return 'Showing 0 students';
  }

  if (isFiltered) {
    return `Showing 1-${visibleCount} of ${visibleCount} students`;
  }

  return `Showing 1-${visibleCount} of ${data.summary.totalStudents} students`;
}

function renderPagination(): string {
  return `
    <footer class="pagination student-pagination">

      <p
        class="pagination__range"
        id="student-showing-text"
        aria-live="polite"
      >
        ${showingText(data.records.length, false)}
      </p>

      <nav
        class="pagination__controls"
        aria-label="Student records pagination"
      >

        <button
          type="button"
          class="pagination__button"
          aria-label="Previous page"
          disabled
        >
          ${icon('chevron_left')}
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
          ${icon('chevron_right')}
        </button>

      </nav>

    </footer>
  `;
}

// =========================================================
// RENDER COMPLETE PAGE
// =========================================================

function renderPage(): void {
  pageContent.innerHTML = `
    <div class="page student-management-page">

      ${renderHeading()}

      ${renderKpis()}

      <section
        class="section-card student-records-card"
        aria-label="Student records"
      >
        ${renderRecordsHeader()}
        ${renderFilters()}
        ${renderTable()}
        ${renderPagination()}
      </section>

    </div>
  `;
}

// =========================================================
// SEARCH AND FILTERS
// =========================================================

function initFilters(): void {
  const searchInput = qs<HTMLInputElement>('#student-search');

  const programFilter = qs<HTMLSelectElement>(
    '#student-program-filter',
  );

  const eligibilityFilter = qs<HTMLSelectElement>(
    '#student-eligibility-filter',
  );

  const ojtFilter = qs<HTMLSelectElement>(
    '#student-ojt-filter',
  );

  const clearButton = qs<HTMLButtonElement>(
    '#student-clear-filters',
  );

  const tableBody = qs<HTMLTableSectionElement>(
    '#student-table-body',
  );

  const showingElement = qs<HTMLElement>(
    '#student-showing-text',
  );

  function clearFilters(): void {
    searchInput.value = '';
    programFilter.value = '';
    eligibilityFilter.value = '';
    ojtFilter.value = '';

    applyFilters();
    searchInput.focus();
  }

  function applyFilters(): void {
    const term = searchInput.value.trim().toLowerCase();
    const program = programFilter.value;
    const eligibility = eligibilityFilter.value;
    const ojt = ojtFilter.value;

    const isFiltered = Boolean(
      term || program || eligibility || ojt,
    );

    const filtered = data.records.filter((student) => {
      const matchesSearch =
        term.length === 0 ||
        student.fullName.toLowerCase().includes(term) ||
        (student.email ?? '').toLowerCase().includes(term) ||
        student.studentNumber.toLowerCase().includes(term);

      const matchesProgram =
        !program || student.program === program;

      const matchesEligibility =
        !eligibility || student.eligibilityStatus === eligibility;

      const matchesOjt =
        !ojt || student.ojtStatus === ojt;

      return (
        matchesSearch &&
        matchesProgram &&
        matchesEligibility &&
        matchesOjt
      );
    });

    tableBody.innerHTML = renderRows(filtered);

    showingElement.textContent = showingText(
      filtered.length,
      isFiltered,
    );
  }

  // Search as the user types.
  searchInput.addEventListener('input', applyFilters);

  // Apply dropdown filters.
  programFilter.addEventListener('change', applyFilters);
  eligibilityFilter.addEventListener('change', applyFilters);
  ojtFilter.addEventListener('change', applyFilters);

  // Main Clear button.
  clearButton.addEventListener('click', clearFilters);

  // Event delegation for the Clear button inside the no-results state.
  tableBody.addEventListener('click', (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest('[data-js-clear-filters]')) {
      clearFilters();
    }
  });
}

// =========================================================
// START PAGE
// =========================================================

renderPage();
initFilters();
