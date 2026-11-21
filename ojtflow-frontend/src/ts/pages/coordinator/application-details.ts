
/* =========================================================
   OJTFlow — Coordinator Application Details
   Stage 7.12: Application Details Mockup
   ========================================================= */

import { initAppShell } from '../../core/app-shell';

import {
  mockApplicationDetails,
} from '../../mocks/application.mock';

import type {
  CoordinatorApplicationStatus,
  ApplicationDetailsMockData,
} from '../../types/application.types';

// =========================================================
// INITIALIZE APPLICATION SHELL
// =========================================================

initAppShell();

// =========================================================
// PAGE DATA
// =========================================================

const applicationData: ApplicationDetailsMockData =
  mockApplicationDetails;

const pageContent = document.querySelector<HTMLElement>(
  '#page-content',
);

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

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

// =========================================================
// 7.12.2 BACK LINK, HEADING AND STATUS CHIP
// =========================================================

function renderPageHeader(
  data: ApplicationDetailsMockData,
): string {
  const header = data.header;

  return `
    <section class="application-details-header">

      <a
        href="./applications-management.html"
        class="application-details-back"
      >
        <span class="icon icon--18" aria-hidden="true">
          arrow_back
        </span>

        ${escapeHtml(header.backLabel)}
      </a>

      <div class="application-details-heading">

        <div class="application-details-heading__text">

          <h1 class="page-title">
            ${escapeHtml(header.title)}
          </h1>

          <p class="page-subtitle">
            ${escapeHtml(header.subtitle)}
          </p>

        </div>

        <div class="application-details-heading__badges">

          <span class="chip">
            <span class="icon icon--16" aria-hidden="true">
              calendar_month
            </span>

            ${escapeHtml(header.academicYear)}
          </span>

          <span class="badge badge--pending">
            <span class="badge__dot" aria-hidden="true"></span>

            ${escapeHtml(header.statusLabel)}
          </span>

        </div>

      </div>

    </section>
  `;
}

// =========================================================
// 7.12.3 STUDENT CARD
// =========================================================

function renderStudentCard(
  data: ApplicationDetailsMockData,
): string {
  const student = data.student;

  return `
    <section class="application-student-card">

      <div class="application-student-card__identity">

        <div
          class="application-student-avatar"
          aria-label="Student avatar"
        >

          ${escapeHtml(getInitials(student.fullName))}

          <span
            class="application-student-avatar__check"
            aria-label="Verified student"
          >
            <span class="icon" aria-hidden="true">
              check
            </span>
          </span>

        </div>

        <div>

          <h2 class="application-student-card__name">

            ${escapeHtml(student.fullName)}

            <span
              class="icon application-student-card__verified"
              title="Verified student"
              aria-label="Verified"
            >
              verified
            </span>

          </h2>

          <div class="application-student-card__chips">

            <span class="chip">
              ${escapeHtml(student.studentNumber)}
            </span>

            <span class="tag--program">
              ${escapeHtml(student.academicProgram)}
            </span>

            <span class="chip">
              ${escapeHtml(student.yearLevel)}
            </span>

          </div>

        </div>

      </div>

      <div class="application-student-card__status">

        <span class="badge badge--pending">
          <span class="badge__dot" aria-hidden="true"></span>

          ${escapeHtml(student.verificationStatus)}
        </span>

      </div>

    </section>
  `;
}

// =========================================================
// 7.12.4 APPLICATION INFORMATION
// =========================================================

function renderApplicationInfoBox(
  label: string,
  value: string,
  monospace = false,
): string {
  return `
    <div class="application-details-info-box">

      <span class="application-details-info-box__label">
        ${escapeHtml(label)}
      </span>

      <span class="
        application-details-info-box__value
        ${monospace
          ? 'application-details-info-box__value--monospace'
          : ''}
      ">
        ${escapeHtml(value)}
      </span>

    </div>
  `;
}

function renderApplicationInformation(
  data: ApplicationDetailsMockData,
): string {
  const application = data.application;

  return `
    <section class="section-card application-details-section">

      <div class="section-card__header">

        <div class="section-card__heading">

          <h2 class="section-card__title">
            Application Information
          </h2>

        </div>

      </div>

      <div class="application-details-info-grid">

        ${renderApplicationInfoBox(
          'Application ID',
          application.applicationId,
          true,
        )}

        ${renderApplicationInfoBox(
          'Academic Program',
          application.academicProgram,
        )}

        ${renderApplicationInfoBox(
          'Application Date',
          application.applicationDate,
        )}

        ${renderApplicationInfoBox(
          'Student Email',
          application.studentEmail,
        )}

      </div>

    </section>
  `;
}

// =========================================================
// 7.12.5 COMPANY INFORMATION
// =========================================================

function renderCompanyField(
  label: string,
  value: string,
  isFallback = false,
): string {
  return `
    <div class="application-company-field">

      <span class="info-field__label">
        ${escapeHtml(label)}
      </span>

      <span class="
        application-company-field__value
        ${isFallback
          ? 'application-company-field__value--fallback'
          : ''}
      ">
        ${escapeHtml(value)}
      </span>

    </div>
  `;
}

function renderCompanyInformation(
  data: ApplicationDetailsMockData,
): string {
  const company = data.company;

  return `
    <section class="section-card application-details-section">

      <div class="section-card__header">

        <div class="section-card__heading">

          <h2 class="section-card__title">
            Company Information
          </h2>

        </div>

        <span class="application-company-tag">

          <span class="icon icon--16" aria-hidden="true">
            verified
          </span>

          ${escapeHtml(company.accreditationLabel)}

        </span>

      </div>

      <div class="info-grid">

        ${renderCompanyField(
          'Company Name',
          company.companyName,
        )}

        ${renderCompanyField(
          'Company Contact Person',
          company.contactPerson,
          true,
        )}

        ${renderCompanyField(
          'Company Location',
          company.location,
        )}

        ${renderCompanyField(
          'Company Contact Number',
          company.contactNumber,
          true,
        )}

      </div>

    </section>
  `;
}

// =========================================================
// 7.12.6 UPDATE APPLICATION STATUS
// =========================================================

function renderStatusOptions(
  selectedStatus: CoordinatorApplicationStatus,
): string {
  const statuses: CoordinatorApplicationStatus[] = [
    'Pending',
    'Under Review',
    'Accepted',
    'Rejected',
  ];

  return statuses.map((status) => `
    <option
      value="${escapeHtml(status)}"
      ${selectedStatus === status ? 'selected' : ''}
    >
      ${escapeHtml(status)}
    </option>
  `).join('');
}

function renderApplicationStatusForm(
  data: ApplicationDetailsMockData,
): string {
  const statusUpdate = data.statusUpdate;

  return `
    <section class="section-card application-details-section">

      <div class="section-card__header">

        <div class="section-card__heading">

          <h2 class="section-card__title">
            Update Application Status
          </h2>

        </div>

        <span class="application-status-form__admin-tag">
          Admin Action
        </span>

      </div>

      <div class="application-status-form">

        <div class="application-status-form__fields">

          <div class="field">

            <label
              for="application-status"
              class="field__label"
            >
              Application Status
            </label>

            <div class="select-wrap">

              <select
                id="application-status"
                name="applicationStatus"
                class="select"
              >

                ${renderStatusOptions(statusUpdate.initialStatus)}

              </select>

            </div>

          </div>

          <div class="field">

            <label
              for="coordinator-remarks"
              class="field__label"
            >
              Coordinator Remarks
            </label>

            <textarea
              id="coordinator-remarks"
              name="coordinatorRemarks"
              class="textarea"
              rows="4"
              maxlength="${statusUpdate.maxRemarksLength}"
              placeholder="Enter coordinator remarks..."
            >${escapeHtml(statusUpdate.coordinatorRemarks)}</textarea>

            <div class="textarea-footer">

              <span class="field__hint">
                Maximum ${statusUpdate.maxRemarksLength} characters.
              </span>

              <span
                class="textarea-counter"
                id="remarks-counter"
                aria-live="polite"
              >
                ${statusUpdate.coordinatorRemarks.length}/${statusUpdate.maxRemarksLength}
              </span>

            </div>

          </div>

        </div>

        <div class="application-status-form__note">

          <span class="icon" aria-hidden="true">
            info
          </span>

          <p>
            Record the status confirmed by the partner company.
            The coordinator records verification results and does
            not unilaterally dictate acceptance or rejection on
            the host company's behalf.
          </p>

        </div>

        <footer class="application-status-form__footer">

          <a
            href="./applications-management.html"
            class="btn btn--secondary"
          >
            Back
          </a>

          <button
            type="button"
            class="btn btn--primary"
            id="save-application-changes"
          >
            Save Changes
          </button>

        </footer>

      </div>

    </section>
  `;
}

// =========================================================
// COMPLETE PAGE RENDER
// =========================================================

function renderApplicationDetails(
  data: ApplicationDetailsMockData,
): void {

  if (!pageContent) {
    console.error(
      'Application Details: #page-content element was not found.',
    );

    return;
  }

  pageContent.innerHTML = `
    <div class="page application-details-page">

      ${renderPageHeader(data)}

      ${renderStudentCard(data)}

      ${renderApplicationInformation(data)}

      ${renderCompanyInformation(data)}

      ${renderApplicationStatusForm(data)}

    </div>
  `;

  bindApplicationDetailsEvents(data);
}

// =========================================================
// TEXTAREA CHARACTER COUNTER
// =========================================================

function bindApplicationDetailsEvents(
  data: ApplicationDetailsMockData,
): void {

  const remarksInput =
    document.querySelector<HTMLTextAreaElement>(
      '#coordinator-remarks',
    );

  const remarksCounter =
    document.querySelector<HTMLElement>(
      '#remarks-counter',
    );

  if (remarksInput && remarksCounter) {

    const updateCounter = (): void => {

      const currentLength = remarksInput.value.length;

      remarksCounter.textContent =
        `${currentLength}/${data.statusUpdate.maxRemarksLength}`;

    };

    remarksInput.addEventListener('input', updateCounter);

    updateCounter();
  }

  // Save Changes intentionally has no persistence behavior
  // during the Stage 7.12 mockup phase.
}

// =========================================================
// INITIALIZE PAGE
// =========================================================

renderApplicationDetails(applicationData);
