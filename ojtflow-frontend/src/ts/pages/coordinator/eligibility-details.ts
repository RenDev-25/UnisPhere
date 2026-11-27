
/* =========================================================
   UNISphere — Coordinator Student Eligibility Details
   Stage 7.10: Student Eligibility Details
   ========================================================= */

import { initAppShell } from '../../core/app-shell';

import { getEligibilityDetails, saveEligibilityDecision, saveEligibilityRemarks } from '../../services/eligibility.service';
import { updateStudentRequirementStatus, markAllStudentRequirementsPassed } from '../../services/requirement.service';
import { getRequiredQueryParam } from '../../core/query-params';

import type { EligibilityRequirementItem } from '../../types/eligibility.types';

// =========================================================
// INITIALIZE APPLICATION SHELL
// =========================================================

initAppShell();

// =========================================================
// PAGE DATA
// =========================================================

type EligibilityDetailsData =
  Awaited<ReturnType<typeof getEligibilityDetails>>;

let data: EligibilityDetailsData;

const pageContentElement =
  document.querySelector<HTMLElement>('#page-content');

if (!pageContentElement) {
  throw new Error(
    'Student Eligibility Details: #page-content was not found.',
  );
}

const eligibilityDetailsPageContent: HTMLElement = pageContentElement;
// =========================================================
// HTML ESCAPING
// =========================================================

function escapeHtml(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  return text.replace(/[&<>"']/g, (character) => {
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
              Physical Verification Progress
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
            ${percentage}% passed
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
        <label class="sr-only" for="requirement-status-${escapeHtml(requirement.id)}">${escapeHtml(requirement.title)} status</label>
        <select id="requirement-status-${escapeHtml(requirement.id)}" class="eligibility-requirement-status-select" data-requirement-status="${escapeHtml(requirement.id)}">
          <option value="Missing" ${requirement.status === 'Missing' ? 'selected' : ''}>Missing / Incomplete</option>
          <option value="Pending" ${requirement.status === 'Pending' ? 'selected' : ''}>Pending Verification</option>
          <option value="Passed" ${requirement.status === 'Passed' ? 'selected' : ''}>Passed / Completed</option>
        </select>
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
          <h2 class="section-card__title">OJT Requirements Checklist</h2>
          <p class="eligibility-checklist-description">Record the outcome of the student's face-to-face submission and verification at the OJT Office. This checklist is for monitoring only.</p>
        </div>
        <button type="button" class="btn btn--secondary" data-js-mark-all-submitted>Mark All Submitted</button>
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
      <h2 class="section-card__title">Final OJT Eligibility Decision</h2>
      <p>The Coordinator records the official eligibility decision only after coordinating with the OJT Facilitator and physically checking the student's submitted documents at the OJT Office. Requirement statuses record the outcome of physical submission and verification.</p>
      <label for="coordinator-final-eligibility">Coordinator Decision</label>
      <select id="coordinator-final-eligibility">
        <option value="For Review" ${data.student.eligibilityStatus==='For Review'?'selected':''}>Pending / For Review</option>
        <option value="Eligible" ${data.student.eligibilityStatus==='Eligible'?'selected':''}>Mark as Eligible</option>
        <option value="Not Eligible" ${data.student.eligibilityStatus==='Not Eligible'?'selected':''}>Not Eligible</option>
      </select>

      <div class="eligibility-remarks-header">
        <h2 class="section-card__title">Coordinator Remarks</h2>
      </div>
      <label for="coordinator-remarks-input">Remarks / Physical Follow-up Notes</label>
      <textarea id="coordinator-remarks-input" rows="4" maxlength="1000" placeholder="Enter coordination notes, missing physical documents, or follow-up instructions...">${escapeHtml(data.coordinatorRemarks.remarks || '')}</textarea>
      <p class="eligibility-checklist-description">These remarks are shared with the student's account. Online upload does not replace face-to-face submission or verification.</p>

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
  eligibilityDetailsPageContent.innerHTML = `
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

async function initEligibilityDetails(): Promise<void> {
  const studentId = getRequiredQueryParam('id');
  data = await getEligibilityDetails(studentId);
  renderEligibilityDetailsPage();

  eligibilityDetailsPageContent.querySelectorAll<HTMLSelectElement>('[data-requirement-status]').forEach(select => {
    select.addEventListener('change', () => {
      try {
        const requirementId = select.dataset.requirementStatus;
        if (!requirementId) return;
        updateStudentRequirementStatus(studentId, requirementId, select.value as 'Passed' | 'Pending' | 'Missing');
        window.location.reload();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : 'Unable to update requirement status.');
      }
    });
  });
  eligibilityDetailsPageContent.querySelector('[data-js-mark-all-submitted]')?.addEventListener('click', () => {
    if (!window.confirm('Confirm that all required documents were physically submitted and verified at the OJT Office?')) return;
    try { markAllStudentRequirementsPassed(studentId); window.location.reload(); }
    catch (error) { window.alert(error instanceof Error ? error.message : 'Unable to update requirements.'); }
  });

  const saveButton = document.querySelector<HTMLButtonElement>('[data-js-save-changes]');
  saveButton?.addEventListener('click', () => {
    try {
      const remarks = document.querySelector<HTMLTextAreaElement>('#coordinator-remarks-input')?.value || '';
      const decision = document.querySelector<HTMLSelectElement>('#coordinator-final-eligibility')?.value as 'Eligible'|'Not Eligible'|'For Review'|undefined;
      saveEligibilityRemarks(studentId, remarks);
      if (decision) saveEligibilityDecision(studentId, decision);
      window.alert('Coordinator eligibility decision and remarks saved.');
      window.location.reload();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to save eligibility changes.');
    }
  });
}

void initEligibilityDetails().catch((error: unknown) => {
  console.error('Failed to load eligibility details:', error);
  eligibilityDetailsPageContent.innerHTML = `<section class=\"section-card\"><h1 class=\"page-title\">Student Eligibility Record Not Found</h1><p>${escapeHtml(error instanceof Error ? error.message : 'Unable to load this student record.')}</p><a class=\"btn btn--secondary\" href=\"eligibility-requirements.html\">Back to Eligibility &amp; Requirements</a></section>`;
});

window.addEventListener('storage', event => {
  if (event.key === 'ojtflow_student_requirements' || event.key === 'ojtflow_eligibility_remarks' || event.key === 'ojtflow_student_eligibility') window.location.reload();
});
