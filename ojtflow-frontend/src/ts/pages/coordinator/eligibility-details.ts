/* =========================================================
   OJTFlow — Coordinator Student Eligibility Details
   Stage 7.10: Student Eligibility Details Mockup
   ========================================================= */

import { initAppShell } from '../../core/app-shell';

import {
  mockEligibilityDetails,
} from '../../mocks/eligibility.mock';

import type {
  EligibilityRequirementItem,
  RequirementVerificationStatus,
} from '../../types/eligibility.types';

// =========================================================
// INITIALIZE APPLICATION SHELL
// =========================================================

initAppShell();


// PAGE DATA
// =========================================================

const data = mockEligibilityDetails;

const pageContent =
  document.querySelector<HTMLElement>('#page-content');

if (!pageContent) {
  throw new Error(
    'Student Eligibility Details: #page-content was not found.',
  );
}

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
      "'": '&#39;',
    };

    return entities[character];
  });
}

// =========================================================
// STATUS CLASS
// =========================================================

function getRequirementStatusClass(
  status: RequirementVerificationStatus,
): string {
  switch (status) {
    case 'Approved':
      return 'eligibility-detail-status--approved';

    case 'Pending':
      return 'eligibility-detail-status--pending';

    case 'For Correction':
      return 'eligibility-detail-status--correction';

    default:
      return '';
  }
}

// =========================================================
// 7.10.2 — BACK LINK AND STUDENT HEADER
// =========================================================

function renderStudentHeader(): string {
  const student = data.student;

  const initial = student.studentName
    .trim()
    .charAt(0)
    .toUpperCase();

  return `
    <section class="eligibility-detail-header-section">

      <a
        href="eligibility-requirements.html"
        class="eligibility-detail-back-link"
      >
        <span class="icon" aria-hidden="true">
          arrow_back
        </span>

        Back to Eligibility &amp; Requirements
      </a>

      <div class="eligibility-detail-page-heading">

        <h1 class="page-title">
          Student Eligibility Details
        </h1>

        <p class="page-subtitle">
          Review the student's eligibility and verify
          submitted pre-deployment requirements.
        </p>

      </div>

      <article class="eligibility-student-card">

        <div class="eligibility-student-identity">

          <div
            class="eligibility-student-avatar"
            aria-label="Student initial ${escapeHtml(initial)}"
          >
            ${escapeHtml(initial)}

            <span
              class="eligibility-student-online-dot"
              aria-hidden="true"
            ></span>
          </div>

          <div class="eligibility-student-information">

            <div class="eligibility-student-name-row">

              <h2 class="eligibility-student-name">
                ${escapeHtml(student.studentName)}
              </h2>

              <span class="eligibility-student-type">
                ${escapeHtml(student.studentType)}
              </span>

            </div>

            <p class="eligibility-student-meta">
              Student No.:
              <strong>${escapeHtml(student.studentNumber)}</strong>

              <span aria-hidden="true">•</span>

              ${escapeHtml(student.program)}

              <span aria-hidden="true">•</span>

              ${escapeHtml(student.yearLevel)}
              (Section ${escapeHtml(student.section)})
            </p>

          </div>

        </div>

        <div class="eligibility-student-status">
          <span class="eligibility-detail-status eligibility-detail-status--approved">
            <span class="icon" aria-hidden="true">
              check_circle
            </span>

            ${escapeHtml(student.eligibilityStatus)}
          </span>
        </div>

      </article>

    </section>
  `;
}

// =========================================================
// 7.10.3 — ELIGIBILITY OVERVIEW
// =========================================================

function renderEligibilityOverview(): string {
  const overview = data.overview;

  const percentage = Math.min(
    100,
    Math.max(0, overview.completionPercentage),
  );

  return `
    <section class="section-card eligibility-overview-card">

      <div class="eligibility-detail-section-heading">

        <div class="eligibility-detail-section-title">

          <h2 class="section-card__title">
            Eligibility Overview
          </h2>

          <span
            class="icon eligibility-info-icon"
            title="Eligibility is based on the required pre-deployment documents."
            aria-label="Eligibility information"
            role="img"
          >
            info
          </span>

        </div>

        <span class="eligibility-standard-label">
          ${escapeHtml(overview.standardLabel)}
        </span>

      </div>

      <div class="eligibility-overview-content">

        <div class="eligibility-overview-progress-heading">

          <div>
            <p class="eligibility-overview-label">
              Requirements Completion
            </p>

            <p class="eligibility-overview-count">
              ${overview.completedRequirements}
              of
              ${overview.totalRequirements}
            </p>
          </div>

          <strong class="eligibility-overview-percentage">
            ${percentage}%
          </strong>

        </div>

        <div
          class="eligibility-progress-track"
          role="progressbar"
          aria-label="Requirements completion"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${percentage}"
        >
          <div
            class="eligibility-progress-fill"
            style="width: ${percentage}%"
          ></div>
        </div>

        <div class="eligibility-overview-footer">

          <span class="eligibility-overview-success">

            <span class="icon" aria-hidden="true">
              check_circle
            </span>

            ${escapeHtml(overview.completionMessage)}

          </span>

          <span class="eligibility-overview-verified">
            ${percentage}% verified
          </span>

        </div>

      </div>

    </section>
  `;
}

// =========================================================
// 7.10.4 — REQUIREMENT ROW
// =========================================================

function renderRequirementRow(
  requirement: EligibilityRequirementItem,
): string {
  const statusClass =
    getRequirementStatusClass(requirement.status);

  return `
    <article class="eligibility-requirement-row">

      <div class="eligibility-requirement-number">
        ${requirement.number}
      </div>

      <div class="eligibility-requirement-information">

        <h3 class="eligibility-requirement-title">
          ${escapeHtml(requirement.title)}
        </h3>

        <p class="eligibility-requirement-description">
          ${escapeHtml(requirement.description)}
        </p>

      </div>

      <div class="eligibility-requirement-status">

        <button
          type="button"
          class="eligibility-detail-status eligibility-requirement-status-button ${statusClass}"
          aria-label="${escapeHtml(requirement.title)} status: ${escapeHtml(requirement.status)}"
          data-requirement-id="${escapeHtml(requirement.id)}"
        >
          ${escapeHtml(requirement.status)}

          <span class="icon" aria-hidden="true">
            expand_more
          </span>
        </button>

      </div>

    </article>
  `;
}

// =========================================================
// 7.10.4 — OJT REQUIREMENTS CHECKLIST
// =========================================================

function renderRequirementsChecklist(): string {
  return `
    <section class="section-card eligibility-checklist-card">

      <div class="eligibility-checklist-header">

        <div class="eligibility-checklist-heading">

          <h2 class="section-card__title">
            OJT Requirements Checklist
          </h2>

          <p class="eligibility-checklist-description">
            Review and verify the physical documents submitted
            by the student. Click badge to change status.
          </p>

        </div>

        <button
          type="button"
          class="btn eligibility-mark-all-button"
          data-js-mark-all-approved
        >
          <span class="icon" aria-hidden="true">
            done_all
          </span>

          Mark All Approved
        </button>

      </div>

      <div class="eligibility-requirements-list">

        ${data.requirements
          .map(renderRequirementRow)
          .join('')}

      </div>

    </section>
  `;
}

// =========================================================
// 7.10.5 — COORDINATOR REMARKS
// =========================================================

function renderCoordinatorRemarks(): string {
  return `
    <section class="section-card eligibility-remarks-card">

      <div class="eligibility-remarks-header">

        <h2 class="section-card__title">
          Coordinator Remarks
        </h2>

        <button
          type="button"
          class="eligibility-edit-remarks"
          data-js-edit-remarks
        >
          <span class="icon" aria-hidden="true">
            edit
          </span>

          Edit Remarks
        </button>

      </div>

      <div class="eligibility-remarks-content">

        <span
          class="icon eligibility-remarks-icon"
          aria-hidden="true"
        >
          format_quote
        </span>

        <p class="eligibility-remarks-text">
          ${escapeHtml(data.coordinatorRemarks.remarks)}
        </p>

      </div>

    </section>
  `;
}

// =========================================================
// 7.10.5 — PAGE FOOTER
// =========================================================

function renderPageFooter(): string {
  return `
    <footer class="eligibility-detail-footer">

      <a
        href="eligibility-requirements.html"
        class="btn btn--secondary eligibility-footer-back"
      >
        <span class="icon" aria-hidden="true">
          arrow_back
        </span>

        Back
      </a>

      <button
        type="button"
        class="btn btn--primary eligibility-save-button"
        data-js-save-changes
      >
        <span class="icon" aria-hidden="true">
          save
        </span>

        Save Changes
      </button>

    </footer>
  `;
}

// =========================================================
// RENDER COMPLETE PAGE
// =========================================================

function renderEligibilityDetailsPage(): void {
  if (!pageContent) {
    console.error('Page content element was not found.');
    return;
  }

  pageContent.innerHTML = `
    <div class="page eligibility-detail-page">

      ${renderStudentHeader()}

      ${renderEligibilityOverview()}

      ${renderRequirementsChecklist()}

      ${renderCoordinatorRemarks()}

      ${renderPageFooter()}

    </div>
  `;
}
// =========================================================
// START PAGE
// =========================================================

renderEligibilityDetailsPage();