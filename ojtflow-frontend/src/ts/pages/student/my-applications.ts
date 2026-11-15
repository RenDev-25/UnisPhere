
/* src/ts/pages/student/my-applications.ts */

import { initAppShell } from '../../core/app-shell';

import {
  mockApplicationHeading,
  mockApplicationFilters,
  mockApplications,
  mockApplicationEmptyState,
  mockApplicationPlacementNotice
} from '../../mocks/application.mock';

import type {
  ApplicationRecord,
  ApplicationStatus
} from '../../types/application.types';

import {
  escapeHtml,
  icon
} from '../../utils/dom';


/* ========================================
   INITIALIZE APPLICATION SHELL
======================================== */

initAppShell();


/* ========================================
   DOM ELEMENTS
======================================== */

const searchInput =
  document.querySelector<HTMLInputElement>(
    '#application-search'
  );

const statusFilter =
  document.querySelector<HTMLSelectElement>(
    '#application-status-filter'
  );

const sortSelect =
  document.querySelector<HTMLSelectElement>(
    '#application-sort'
  );

const resetButton =
  document.querySelector<HTMLButtonElement>(
    '#reset-application-filters'
  );

const applicationsList =
  document.querySelector<HTMLElement>(
    '#applications-list'
  );

const applicationsEmpty =
  document.querySelector<HTMLElement>(
    '#applications-empty'
  );

const applicationsTotal =
  document.querySelector<HTMLElement>(
    '#applications-total'
  );

const modal =
  document.querySelector<HTMLDialogElement>(
    '#application-details-modal'
  );


/* ========================================
   STATUS CLASS HELPER
======================================== */

function getStatusClass(
  status: ApplicationStatus
): string {

  const classes: Record<ApplicationStatus, string> = {
    'Under Review': 'application-status--under-review',
    'Accepted': 'application-status--accepted',
    'Pending Decision': 'application-status--pending-decision',
    'Rejected': 'application-status--rejected'
  };

  return classes[status];
}


/* ========================================
   FORMAT APPLICATION DATE
======================================== */

function formatDate(dateValue: string): string {

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}


/* ========================================
   RENDER PAGE HEADING
======================================== */

function renderHeading(): void {

  const title = document.querySelector<HTMLElement>(
    '.applications-title-row .page-title'
  );

  const subtitle = document.querySelector<HTMLElement>(
    '.applications-header .page-subtitle'
  );

  if (title) {
    title.textContent = mockApplicationHeading.title;
  }

  if (subtitle) {
    subtitle.textContent = mockApplicationHeading.subtitle;
  }

  if (applicationsTotal) {
    applicationsTotal.textContent =
      `TOTAL APPLICATIONS: ${String(
        mockApplications.length
      ).padStart(2, '0')}`;
  }

}


/* ========================================
   RENDER FILTER OPTIONS
======================================== */

function renderFilterOptions(): void {

  if (searchInput) {
    searchInput.placeholder =
      mockApplicationFilters.searchPlaceholder;
  }

  if (statusFilter) {

    statusFilter.innerHTML = `
      <option value="all">All Statuses</option>

      ${mockApplicationFilters.statusOptions.map(status => `
        <option value="${escapeHtml(status)}">
          ${escapeHtml(status)}
        </option>
      `).join('')}
    `;

  }

  if (sortSelect) {

    sortSelect.innerHTML =
      mockApplicationFilters.sortOptions.map(option => `
        <option value="${option.value}">
          ${escapeHtml(option.label)}
        </option>
      `).join('');

    sortSelect.value =
      mockApplicationFilters.defaultSort;

  }

}


/* ========================================
   RENDER APPLICATION CARD
======================================== */

function renderApplicationCard(
  application: ApplicationRecord
): string {

  const statusClass = getStatusClass(
    application.status
  );

  return `

    <article
      class="application-card"
      data-application-id="${escapeHtml(application.id)}"
    >

      <div class="application-card__main">

        <div
          class="application-card__initials"
          aria-hidden="true"
        >
          ${escapeHtml(application.initials)}
        </div>

        <div class="application-card__information">

          <h2 class="application-card__company">
            ${escapeHtml(application.companyName)}
          </h2>

          <div class="application-card__meta">

            <span class="application-card__meta-item">

              ${icon(
                'location_on',
                'application-card__meta-icon'
              )}

              ${escapeHtml(application.location)}

            </span>

            <span class="application-card__meta-item">

              ${icon(
                'calendar_today',
                'application-card__meta-icon'
              )}

              Applied:
              ${escapeHtml(
                formatDate(application.dateApplied)
              )}

            </span>

          </div>

        </div>

      </div>


      <div class="application-card__actions">

        <span
          class="application-status ${statusClass}"
        >
          ${escapeHtml(application.status)}
        </span>

        <button
          class="btn btn--secondary btn--small application-card__view"
          type="button"
          data-view-application="${escapeHtml(application.id)}"
        >
          View Details
        </button>

      </div>

    </article>

  `;

}


/* ========================================
   FILTER APPLICATIONS
======================================== */

function getFilteredApplications(): ApplicationRecord[] {

  const searchTerm =
    searchInput?.value.trim().toLowerCase() ?? '';

  const selectedStatus =
    statusFilter?.value ?? 'all';

  const sortOrder =
    sortSelect?.value ?? 'newest';


  let filtered = [...mockApplications];


  // Search by company name or location.
  if (searchTerm) {

    filtered = filtered.filter(application => {

      return (
        application.companyName
          .toLowerCase()
          .includes(searchTerm) ||

        application.location
          .toLowerCase()
          .includes(searchTerm)
      );

    });

  }


  // Filter by application status.
  if (selectedStatus !== 'all') {

    filtered = filtered.filter(application => {
      return application.status === selectedStatus;
    });

  }


  // Sort by application date.
  filtered.sort((a, b) => {

    const dateA = new Date(a.dateApplied).getTime();
    const dateB = new Date(b.dateApplied).getTime();

    return sortOrder === 'oldest'
      ? dateA - dateB
      : dateB - dateA;

  });


  return filtered;

}


/* ========================================
   RENDER APPLICATIONS
======================================== */

function renderApplications(): void {

  if (!applicationsList || !applicationsEmpty) {
    return;
  }

  const filteredApplications =
    getFilteredApplications();


  // Update total using the complete application list.
  if (applicationsTotal) {

    applicationsTotal.textContent =
      `TOTAL APPLICATIONS: ${String(
        mockApplications.length
      ).padStart(2, '0')}`;

  }


  // Show the actual empty state only when
  // the application list contains no records.
  if (mockApplications.length === 0) {

    applicationsList.innerHTML = '';

    applicationsEmpty.hidden = false;

    return;

  }


  applicationsEmpty.hidden = true;


  // Show a separate message when filters
  // produce no matching applications.
  if (filteredApplications.length === 0) {

    applicationsList.innerHTML = `
      <div class="applications-no-results">
        No matching applications found.
      </div>
    `;

    return;

  }


  applicationsList.innerHTML =
    filteredApplications
      .map(renderApplicationCard)
      .join('');


  // Attach View Details actions.
  applicationsList
    .querySelectorAll<HTMLButtonElement>(
      '[data-view-application]'
    )
    .forEach(button => {

      button.addEventListener('click', () => {

        const applicationId =
          button.dataset.viewApplication;

        if (!applicationId) return;

        const application = mockApplications.find(
          item => item.id === applicationId
        );

        if (application) {
          openApplicationDetails(application);
        }

      });

    });

}


/* ========================================
   APPLICATION DETAILS MODAL
======================================== */

function openApplicationDetails(
  application: ApplicationRecord
): void {

  if (!modal) return;


  const company =
    document.querySelector<HTMLElement>(
      '#application-modal-company'
    );

  const date =
    document.querySelector<HTMLElement>(
      '#application-modal-date'
    );

  const program =
    document.querySelector<HTMLElement>(
      '#application-modal-program'
    );

  const status =
    document.querySelector<HTMLElement>(
      '#application-modal-status'
    );

  const remarks =
    document.querySelector<HTMLElement>(
      '#application-modal-remarks'
    );

  const nextAction =
    document.querySelector<HTMLElement>(
      '#application-modal-next-action'
    );

  const nextActionText =
    document.querySelector<HTMLElement>(
      '#application-modal-next-action-text'
    );


  if (
    !company ||
    !date ||
    !program ||
    !status ||
    !remarks ||
    !nextAction ||
    !nextActionText
  ) {
    return;
  }


  // Company name.
  company.textContent = application.companyName;


  // Date applied.
  date.textContent = formatDate(
    application.dateApplied
  );


  // Academic program.
  program.textContent =
    application.academicProgram;


  // Application status.
  status.innerHTML = `

    <span class="application-status ${
      getStatusClass(application.status)
    }">

      ${escapeHtml(application.status)}

    </span>

  `;


  // HTE Coordinator remarks.
  remarks.textContent = application.remarks;


  // Next action appears only for Accepted.
  if (
    application.status === 'Accepted' &&
    application.nextAction
  ) {

    nextAction.hidden = false;

    nextActionText.textContent =
      application.nextAction;

  } else {

    nextAction.hidden = true;

    nextActionText.textContent = '';

  }


  // Open modal.
  if (!modal.open) {
    modal.showModal();
  }

}


/* ========================================
   CLOSE MODAL
======================================== */

function closeApplicationModal(): void {

  if (modal?.open) {
    modal.close();
  }

}


document.querySelector<HTMLButtonElement>(
  '#application-modal-close'
)?.addEventListener('click', closeApplicationModal);


document.querySelector<HTMLButtonElement>(
  '#application-modal-close-icon'
)?.addEventListener('click', closeApplicationModal);


// Close when the user clicks the dialog backdrop.
modal?.addEventListener('click', event => {

  if (event.target === modal) {
    closeApplicationModal();
  }

});


/* ========================================
   RESET FILTERS
======================================== */

function resetFilters(): void {

  if (searchInput) {
    searchInput.value = '';
  }

  if (statusFilter) {
    statusFilter.value = 'all';
  }

  if (sortSelect) {
    sortSelect.value =
      mockApplicationFilters.defaultSort;
  }

  renderApplications();

}


resetButton?.addEventListener(
  'click',
  resetFilters
);


/* ========================================
   FILTER EVENT LISTENERS
======================================== */

searchInput?.addEventListener(
  'input',
  renderApplications
);

statusFilter?.addEventListener(
  'change',
  renderApplications
);

sortSelect?.addEventListener(
  'change',
  renderApplications
);


/* ========================================
   RENDER PLACEMENT NOTICE
======================================== */

function renderPlacementNotice(): void {

  const title =
    document.querySelector<HTMLElement>(
      '.applications-notice__title'
    );

  const message =
    document.querySelector<HTMLElement>(
      '.applications-notice__text'
    );

  if (!title || !message) return;

  title.textContent =
    mockApplicationPlacementNotice.title;

  message.textContent =
    mockApplicationPlacementNotice.message + ' ';

  const link = document.createElement('a');

  link.href =
    mockApplicationPlacementNotice.linkHref;

  link.textContent =
    mockApplicationPlacementNotice.linkLabel;

  message.appendChild(link);

  message.appendChild(
    document.createTextNode(
      ' page for your official placement status and deployment information.'
    )
  );

}


/* ========================================
   RENDER EMPTY STATE CONTENT
======================================== */

function renderEmptyStateContent(): void {

  const title =
    applicationsEmpty?.querySelector<HTMLElement>(
      '.empty-state__title'
    );

  const description =
    applicationsEmpty?.querySelector<HTMLElement>(
      '.empty-state__description'
    );

  const button =
    applicationsEmpty?.querySelector<HTMLAnchorElement>(
      '.empty-state__action a'
    );

  if (title) {
    title.textContent = mockApplicationEmptyState.title;
  }

  if (description) {
    description.textContent =
      mockApplicationEmptyState.description;
  }

  if (button) {
    button.textContent =
      mockApplicationEmptyState.buttonLabel;

    button.href =
      mockApplicationEmptyState.buttonHref;
  }

}

/* ========================================
   INITIALIZE PAGE
======================================== */


function initializeMyApplications(): void {

  renderHeading();

  renderFilterOptions();

  renderEmptyStateContent();

  renderPlacementNotice();

  renderApplications();

}



// Initialize after the shared shell.
initializeMyApplications();
