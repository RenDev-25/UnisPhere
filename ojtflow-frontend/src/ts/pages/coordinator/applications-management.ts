
/* =========================================================
   OJTFlow — Coordinator Applications Management
   Stage 7.11: Applications Management Mockup
   ========================================================= */

import { initAppShell } from '../../core/app-shell';
import { mockCoordinatorApplications } from '../../mocks/application.mock';
import type {
  CoordinatorApplicationRecord,
  CoordinatorApplicationStatus,
} from '../../types/application.types';

// =========================================================
// INITIALIZE APPLICATION SHELL
// =========================================================

initAppShell();

// =========================================================
// PAGE DATA
// =========================================================

const data = mockCoordinatorApplications;

const pageContent = document.querySelector<HTMLElement>('#page-content');

if (!pageContent) {
  throw new Error(
    'Applications Management: #page-content was not found.',
  );
}

// =========================================================
// PAGE STATE
// =========================================================

let searchTerm = '';
let selectedProgram = 'All Programs';
let selectedStatus = 'All Statuses';
let currentPage = 1;

// =========================================================
// HELPERS
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

function formatDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getStatusClass(status: CoordinatorApplicationStatus): string {
  const classes: Record<CoordinatorApplicationStatus, string> = {
    Pending: 'application-status--pending',
    'Under Review': 'application-status--review',
    Accepted: 'application-status--accepted',
    Rejected: 'application-status--rejected',
  };

  return classes[status];
}

// =========================================================
// PAGE HEADING AND COUNTERS
// =========================================================

function renderPageHeading(): string {
  return `
    <section class="applications-page-heading">
      <div>
        <h1 class="page-title">Applications Management</h1>
        <p class="page-subtitle">
          Monitor and manage student applications submitted to Host Training Establishments.
        </p>
      </div>
    </section>
  `;
}

function renderCounters(): string {
  const summary = data.summary;

  const counters = [
    {
      label: 'Total Applications',
      value: summary.total,
      accent: 'total',
    },
    {
      label: 'Pending',
      value: summary.pending,
      accent: 'pending',
    },
    {
      label: 'Under Review',
      value: summary.underReview,
      accent: 'review',
    },
    {
      label: 'Accepted',
      value: summary.accepted,
      accent: 'accepted',
    },
    {
      label: 'Rejected',
      value: summary.rejected,
      accent: 'rejected',
    },
  ];

  return `
    <section class="applications-counter-grid" aria-label="Application summary">
      ${counters
        .map(
          (counter) => `
            <article class="applications-counter applications-counter--${counter.accent}">
              <p class="applications-counter__label">
                ${counter.label}
              </p>
              <p class="applications-counter__value">
                ${counter.value}
              </p>
            </article>
          `,
        )
        .join('')}
    </section>
  `;
}

// =========================================================
// RECORDS CARD AND FILTERS
// =========================================================

function renderRecordsToolbar(): string {
  return `
    <div class="applications-records-toolbar">
      <div class="applications-records-heading">
        <div>
          <h2>Student Applications</h2>
          <p>Showing real-time results</p>
        </div>
      </div>

      <div class="applications-filters">
        <label class="applications-search">
          <span class="applications-visually-hidden">
            Search applications
          </span>
          <span class="applications-search__icon" aria-hidden="true">
            &#128269;
          </span>
          <input
            type="search"
            id="application-search"
            placeholder="Search student, number or company..."
            value="${escapeHtml(searchTerm)}"
          />
        </label>

        <label>
          <span class="applications-visually-hidden">Filter by program</span>
          <select id="application-program-filter">
            <option value="All Programs">All Programs</option>
            <option value="BSIT" ${selectedProgram === 'BSIT' ? 'selected' : ''}>
              BSIT
            </option>
            <option value="BSCS" ${selectedProgram === 'BSCS' ? 'selected' : ''}>
              BSCS
            </option>
          </select>
        </label>

        <label>
          <span class="applications-visually-hidden">Filter by status</span>
          <select id="application-status-filter">
            <option value="All Statuses">All Statuses</option>
            <option value="Pending" ${selectedStatus === 'Pending' ? 'selected' : ''}>
              Pending
            </option>
            <option value="Under Review" ${selectedStatus === 'Under Review' ? 'selected' : ''}>
              Under Review
            </option>
            <option value="Accepted" ${selectedStatus === 'Accepted' ? 'selected' : ''}>
              Accepted
            </option>
            <option value="Rejected" ${selectedStatus === 'Rejected' ? 'selected' : ''}>
              Rejected
            </option>
          </select>
        </label>
      </div>
    </div>
  `;
}

// =========================================================
// FILTER APPLICATION RECORDS
// =========================================================

function getFilteredRecords(): CoordinatorApplicationRecord[] {
  return data.records.filter((record) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !normalizedSearch ||
      record.studentName.toLowerCase().includes(normalizedSearch) ||
      record.studentNumber.toLowerCase().includes(normalizedSearch) ||
      record.companyName.toLowerCase().includes(normalizedSearch);

    const matchesProgram =
      selectedProgram === 'All Programs' ||
      record.academicProgram === selectedProgram;

    const matchesStatus =
      selectedStatus === 'All Statuses' ||
      record.status === selectedStatus;

    return matchesSearch && matchesProgram && matchesStatus;
  });
}

// =========================================================
// APPLICATIONS TABLE
// =========================================================

function renderApplicationsTable(
  records: CoordinatorApplicationRecord[],
): string {
  if (records.length === 0) {
    return `
      <div class="applications-empty-state">
        <div class="applications-empty-state__icon" aria-hidden="true">
          &#128269;
        </div>
        <h3>No matching applications found</h3>
        <p>Try adjusting your search or filter selections.</p>
        <button
          type="button"
          class="btn btn--secondary"
          id="clear-application-filters"
        >
          Clear Filters
        </button>
      </div>
    `;
  }

  const startIndex = (currentPage - 1) * data.pageSize;
  const visibleRecords = records.slice(
    startIndex,
    startIndex + data.pageSize,
  );

  return `
    <div class="applications-table-wrapper">
      <table class="applications-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Student Number</th>
            <th>Academic Program</th>
            <th>Company</th>
            <th>Application Date</th>
            <th>Application Status</th>
            <th class="applications-table__action-heading">Action</th>
          </tr>
        </thead>

        <tbody>
          ${visibleRecords
            .map(
              (record) => `
                <tr>
                  <td>
                    <span class="applications-student-name">
                      ${escapeHtml(record.studentName)}
                    </span>
                  </td>

                  <td>${escapeHtml(record.studentNumber)}</td>

                  <td>
                    <span class="applications-program-tag">
                      ${escapeHtml(record.academicProgram)}
                    </span>
                  </td>

                  <td>${escapeHtml(record.companyName)}</td>

                  <td>${escapeHtml(formatDate(record.applicationDate))}</td>

                  <td>
                    <span class="application-status ${getStatusClass(record.status)}">
                      ${escapeHtml(record.status)}
                    </span>
                  </td>

                  <td class="applications-table__action-cell">
                    <a
                      class="applications-view-link"
                      href="./application-details.html"
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

// =========================================================
// FOOTER AND PAGINATION
// =========================================================

function renderPagination(totalFiltered: number): string {
  const totalPages = Math.max(1, Math.ceil(totalFiltered / data.pageSize));

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const start = totalFiltered === 0
    ? 0
    : (currentPage - 1) * data.pageSize + 1;

  const end = Math.min(currentPage * data.pageSize, totalFiltered);

  return `
    <footer class="applications-table-footer">
      <p>
        Showing ${start}-${end} of ${data.totalRecords} applications
      </p>

      <nav class="applications-pagination" aria-label="Applications pagination">
        <button
          type="button"
          data-page="${currentPage - 1}"
          aria-label="Previous page"
          ${currentPage <= 1 ? 'disabled' : ''}
        >
          Previous
        </button>

        ${Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          return `
            <button
              type="button"
              data-page="${page}"
              class="${page === currentPage ? 'is-active' : ''}"
              aria-current="${page === currentPage ? 'page' : 'false'}"
            >
              ${page}
            </button>
          `;
        }).join('')}

        <button
          type="button"
          data-page="${currentPage + 1}"
          aria-label="Next page"
          ${currentPage >= totalPages ? 'disabled' : ''}
        >
          Next
        </button>
      </nav>
    </footer>
  `;
}

// =========================================================
// RENDER RECORDS CARD
// =========================================================

function renderRecordsCard(): string {
  const filteredRecords = getFilteredRecords();

  return `
    <section class="applications-records-card">
      ${renderRecordsToolbar()}

      ${renderApplicationsTable(filteredRecords)}

      ${renderPagination(filteredRecords.length)}
    </section>
  `;
}

// =========================================================
// RENDER COMPLETE PAGE
// =========================================================

function renderApplicationsManagementPage(): void {
  pageContent.innerHTML = `
    <div class="page applications-management-page">
      ${renderPageHeading()}
      ${renderCounters()}
      ${renderRecordsCard()}
    </div>
  `;

  bindPageEvents();
}

// =========================================================
// PAGE EVENTS
// =========================================================

function bindPageEvents(): void {
  const searchInput = document.querySelector<HTMLInputElement>(
    '#application-search',
  );

  const programFilter = document.querySelector<HTMLSelectElement>(
    '#application-program-filter',
  );

  const statusFilter = document.querySelector<HTMLSelectElement>(
    '#application-status-filter',
  );

  searchInput?.addEventListener('input', () => {
    searchTerm = searchInput.value;
    currentPage = 1;
    renderApplicationsManagementPage();

    const newSearch = document.querySelector<HTMLInputElement>(
      '#application-search',
    );

    newSearch?.focus();

    if (newSearch) {
      newSearch.setSelectionRange(
        searchTerm.length,
        searchTerm.length,
      );
    }
  });

  programFilter?.addEventListener('change', () => {
    selectedProgram = programFilter.value;
    currentPage = 1;
    renderApplicationsManagementPage();
  });

  statusFilter?.addEventListener('change', () => {
    selectedStatus = statusFilter.value;
    currentPage = 1;
    renderApplicationsManagementPage();
  });

  document
    .querySelector('#clear-application-filters')
    ?.addEventListener('click', () => {
      searchTerm = '';
      selectedProgram = 'All Programs';
      selectedStatus = 'All Statuses';
      currentPage = 1;
      renderApplicationsManagementPage();
    });

  document
    .querySelectorAll<HTMLButtonElement>('[data-page]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const requestedPage = Number(button.dataset.page);

        const totalPages = Math.max(
          1,
          Math.ceil(getFilteredRecords().length / data.pageSize),
        );

        if (
          requestedPage >= 1 &&
          requestedPage <= totalPages
        ) {
          currentPage = requestedPage;
          renderApplicationsManagementPage();
        }
      });
    });
}

// =========================================================
// INITIAL PAGE RENDER
// =========================================================

renderApplicationsManagementPage();
