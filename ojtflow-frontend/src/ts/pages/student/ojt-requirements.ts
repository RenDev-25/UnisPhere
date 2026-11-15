
/* src/ts/pages/student/ojt-requirements.ts */

import { initAppShell } from '../../core/app-shell';

import {
  mockRequirementHeading,
  mockRequirementCompletion,
  mockRequirements,
  mockRequirementAssistance,
  mockRequirementDetail
} from '../../mocks/requirement.mock';

import type {
  RequirementRecord,
  RequirementStatus
} from '../../types/requirement.types';

import {
  escapeHtml,
  icon
} from '../../utils/dom';


/* ========================================
   INITIALIZE SHARED APP SHELL
======================================== */

initAppShell();


/* ========================================
   DOM ELEMENTS
======================================== */

const headingSection =
  document.querySelector<HTMLElement>(
    '.ojt-requirements-header'
  );

const completionSection =
  document.querySelector<HTMLElement>(
    '.requirements-completion-section'
  );

const listSection =
  document.querySelector<HTMLElement>(
    '.requirements-list-section'
  );

const assistanceSection =
  document.querySelector<HTMLElement>(
    '.requirements-assistance-section'
  );

const detailSection =
  document.querySelector<HTMLElement>(
    '#requirement-detail-view'
  );


/* ========================================
   STATUS HELPERS
======================================== */

function getStatusClass(status: RequirementStatus): string {

  switch (status) {

    case 'Verified':
      return 'badge--approved';

    case 'Pending Review':
      return 'badge--pending';

    case 'Not Submitted':
      return 'badge--rejected';

    default:
      return 'badge--draft';

  }

}


function renderStatusBadge(status: RequirementStatus): string {

  return `
    <span class="badge ${getStatusClass(status)}">
      <span class="badge__dot"></span>
      ${escapeHtml(status)}
    </span>
  `;

}


/* ========================================
   6.4.2 PAGE HEADING
======================================== */

function renderHeading(): void {

  if (!headingSection) return;

  const data = mockRequirementHeading;

  headingSection.innerHTML = `

    <div class="page-header">

      <div class="page-heading">

        <div class="requirements-title-row">

          <h1 class="page-title">
            ${escapeHtml(data.title)}
          </h1>

          <span class="requirements-progress-chip">
            ${escapeHtml(data.progressLabel)}
          </span>

        </div>

        <p class="page-subtitle">
          ${escapeHtml(data.subtitle)}
        </p>

      </div>

      <div class="page-actions">

        <div class="requirements-curriculum-chip">

          <span>Curriculum</span>

          <strong>
            ${escapeHtml(data.curriculum)}
            &bull;
            ${data.hoursTarget} Hours Target
          </strong>

        </div>

      </div>

    </div>

  `;

}


/* ========================================
   6.4.3 COMPLETION CARD
======================================== */

function renderCompletionCard(): void {

  if (!completionSection) return;

  const data = mockRequirementCompletion;

  const percentage = data.total > 0
    ? Math.round((data.completed / data.total) * 100)
    : 0;

  completionSection.innerHTML = `

    <section class="section-card requirements-completion-card">

      <div class="requirements-completion-header">

        <h2 class="requirements-completion-title">
          Requirements Completion
        </h2>

        <span class="chip requirements-year-chip">
          ${escapeHtml(data.academicYear)}
        </span>

      </div>


      <div class="requirements-completion-summary">

        <strong class="requirements-completion-count">
          ${data.completed} of ${data.total} Completed (${percentage}%)
        </strong>

        <span class="requirements-completion-percent">
          ${percentage}%
        </span>

      </div>


      <div
        class="progress progress--bar requirements-completion-progress"
        role="progressbar"
        aria-label="Requirements completion"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${percentage}"
      >

        <span
          class="progress__fill"
          style="width: ${percentage}%"
        ></span>

      </div>


      <div class="requirements-progress-helper">

        <span>
          Minimum threshold for deployment eligibility:
          <strong>${data.minimumThreshold}%</strong>
        </span>

        <span>
          Stage:
          <strong>${escapeHtml(data.stage)}</strong>
        </span>

      </div>


      <div class="requirements-stat-grid">

        <div class="requirements-stat-tile">

          <span class="requirements-stat-label">
            Total
          </span>

          <strong class="requirements-stat-value">
            ${data.total}
          </strong>

        </div>


        <div class="requirements-stat-tile">

          <span class="requirements-stat-label">
            Completed
          </span>

          <strong class="requirements-stat-value">
            ${data.completed}
          </strong>

        </div>


        <div class="requirements-stat-tile">

          <span class="requirements-stat-label">
            Action Needed
          </span>

          <strong class="requirements-stat-value requirements-stat-value--critical">
            ${data.actionNeeded}
          </strong>

        </div>


        <div class="requirements-stat-tile">

          <span class="requirements-stat-label">
            Status
          </span>

          <strong class="requirements-stat-value requirements-stat-value--status">
            ${escapeHtml(data.status)}
          </strong>

        </div>

      </div>

    </section>

  `;

}


/* ========================================
   6.4.4 REQUIREMENT ROW
======================================== */

function renderRequirementRow(
  requirement: RequirementRecord
): string {

  const actionClass =
    requirement.status === 'Not Submitted'
      ? 'requirement-row--action'
      : '';

  const actionRequired =
    requirement.actionRequired
      ? `
        <div class="requirement-row__action-required">
          ${icon('error_outline')}
          <span>${escapeHtml(requirement.actionRequired)}</span>
        </div>
      `
      : '';

  return `

    <article
      class="requirement-row ${actionClass}"
      data-requirement-id="${escapeHtml(requirement.id)}"
    >

      <div class="requirement-row__icon">
        ${icon(requirement.icon)}
      </div>


      <div class="requirement-row__main">

        <div class="requirement-row__title-line">

          <span class="requirement-row__number">
            ${requirement.number}.
          </span>

          <h3 class="requirement-row__title">
            ${escapeHtml(requirement.title)}
          </h3>

          <span class="requirement-category">
            ${escapeHtml(requirement.category)}
          </span>

        </div>


        <p class="requirement-row__description">
          ${escapeHtml(requirement.description)}
        </p>


        <p class="requirement-row__submission">

          <strong>Submitted:</strong>

          ${escapeHtml(requirement.submittedDate)}

          &bull;

          ${escapeHtml(requirement.submissionNote)}

        </p>

        ${actionRequired}

      </div>


      <div class="requirement-row__side">

        ${renderStatusBadge(requirement.status)}

        <button
          class="btn btn--ghost requirement-row__details"
          type="button"
          data-view-requirement="${escapeHtml(requirement.id)}"
          aria-label="View details for ${escapeHtml(requirement.title)}"
        >
          View Details
          ${icon('arrow_forward')}
        </button>

      </div>

    </article>

  `;

}


/* ========================================
   6.4.4 REQUIREMENT LIST
======================================== */

function renderRequirementList(): void {

  if (!listSection) return;

  listSection.innerHTML = `

    <section class="section-card requirements-list-card">

      <div class="requirements-list-heading">

        <div>

          <h2 class="requirements-list-title">
            Required Verification Documents
          </h2>

          <p class="requirements-list-subtitle">
            Review the documents required for your OJT clearance.
          </p>

        </div>

        <span class="requirements-checklist-label">
          BATSTATEU CICS INTERNSHIP CHECKLIST
        </span>

      </div>


      <div class="requirements-list">

        ${mockRequirements
          .map(requirement => renderRequirementRow(requirement))
          .join('')}

      </div>

    </section>

  `;

}


/* ========================================
   6.4.5 ASSISTANCE CARD
======================================== */

function renderAssistanceCard(): void {

  if (!assistanceSection) return;

  const data = mockRequirementAssistance;

  assistanceSection.innerHTML = `

    <div class="requirements-assistance-card">

      <div class="requirements-assistance-content">

        <div class="requirements-assistance-icon">
          ${icon('support_agent')}
        </div>

        <div>

          <h2 class="requirements-assistance-title">
            ${escapeHtml(data.title)}
          </h2>

          <p class="requirements-assistance-description">
            ${escapeHtml(data.description)}
          </p>

        </div>

      </div>


      <div class="requirements-assistance-action">

        <button
          class="btn btn--primary"
          type="button"
          id="submit-endorsement-request"
        >
          ${escapeHtml(data.buttonLabel)}
          ${icon('arrow_forward')}
        </button>

      </div>

    </div>

  `;

}


/* ========================================
   6.4.6 REQUIREMENT DETAIL VIEW
======================================== */

function renderRequirementDetail(
  requirement: RequirementRecord
): void {

  if (!detailSection) return;

  const detail = mockRequirementDetail;

  const isExampleDetail =
    requirement.id === detail.requirementId;

  const title = isExampleDetail
    ? detail.title
    : requirement.title;

  const category = isExampleDetail
    ? detail.category
    : requirement.category;

  const documentId = isExampleDetail
    ? detail.documentId
    : requirement.documentId;

  const description = isExampleDetail
    ? detail.description
    : requirement.description;

  const status = isExampleDetail
    ? detail.status
    : requirement.status;

  const itemLabel = `Item ${requirement.number} of ${mockRequirements.length}`;

  const dateChecked = isExampleDetail
    ? detail.dateChecked
    : '—';

  const coordinatorName = isExampleDetail
    ? detail.coordinatorName
    : '—';

  const remarks = isExampleDetail
    ? detail.remarks
    : 'No coordinator remarks supplied in the available Stage 6.4 excerpt.';

  detailSection.innerHTML = `

    <button
      class="btn btn--ghost requirement-detail-back"
      type="button"
      id="back-to-requirements"
    >
      ${icon('arrow_back')}
      Back to Requirements List
    </button>


    <section class="section-card requirement-detail-card">

      <div class="requirement-detail-topline">

        <span class="requirement-detail-item-label">
          ${escapeHtml(itemLabel)}
        </span>

        ${renderStatusBadge(status)}

      </div>


      <div class="requirement-detail-heading">

        <div class="requirement-detail-icon">
          ${icon(isExampleDetail ? detail.icon : requirement.icon)}
        </div>

        <div>

          <h1 class="requirement-detail-title">
            ${escapeHtml(title)}
          </h1>

          <div class="requirement-detail-meta">

            <span class="requirement-category">
              ${escapeHtml(category)}
            </span>

            <span class="requirement-detail-document-id">
              Document ID: ${escapeHtml(documentId)}
            </span>

          </div>

        </div>

      </div>


      <section class="requirement-detail-block">

        <h3>Requirement Description</h3>

        <p>
          ${escapeHtml(description)}
        </p>

      </section>


      <section class="requirement-detail-block">

        <h3>Evaluation Status</h3>

        <p>
          ${escapeHtml(
            isExampleDetail
              ? detail.evaluationStatus
              : status
          )}
        </p>

        <p class="requirement-detail-note">
          ${escapeHtml(
            isExampleDetail
              ? detail.evaluationNote
              : 'Other possible evaluation states include Pending Review and Not Submitted.'
          )}
        </p>

      </section>


      <section class="requirement-detail-block">

        <h3>Date Checked by Coordinator</h3>

        <div class="requirement-detail-info-grid">

          <div class="requirement-detail-info">

            <span>Date Checked</span>

            <strong>
              ${escapeHtml(dateChecked)}
            </strong>

          </div>


          <div class="requirement-detail-info">

            <span>Coordinator</span>

            <strong>
              ${escapeHtml(coordinatorName)}
            </strong>

          </div>

        </div>

      </section>


      <section class="requirement-detail-block">

        <h3>Coordinator Remarks &amp; Validation</h3>

        <p>
          ${escapeHtml(remarks)}
        </p>

      </section>

    </section>

  `;

  showDetailView();

}


/* ========================================
   VIEW SWITCHING
======================================== */

function showDetailView(): void {

  headingSection?.setAttribute('hidden', '');
  completionSection?.setAttribute('hidden', '');
  listSection?.setAttribute('hidden', '');
  assistanceSection?.setAttribute('hidden', '');

  if (detailSection) {
    detailSection.hidden = false;
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}


function showListView(): void {

  if (headingSection) {
    headingSection.hidden = false;
  }

  if (completionSection) {
    completionSection.hidden = false;
  }

  if (listSection) {
    listSection.hidden = false;
  }

  if (assistanceSection) {
    assistanceSection.hidden = false;
  }

  if (detailSection) {
    detailSection.hidden = true;
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}


/* ========================================
   REQUIREMENT DETAIL EVENT HANDLING
======================================== */

function initializeRequirementActions(): void {

  listSection?.addEventListener('click', event => {

    const target = event.target as HTMLElement;

    const button = target.closest<HTMLButtonElement>(
      '[data-view-requirement]'
    );

    if (!button) return;

    const requirementId =
      button.dataset.viewRequirement;

    if (!requirementId) return;

    const requirement = mockRequirements.find(
      item => item.id === requirementId
    );

    if (!requirement) return;

    renderRequirementDetail(requirement);

  });


  detailSection?.addEventListener('click', event => {

    const target = event.target as HTMLElement;

    const backButton = target.closest<HTMLButtonElement>(
      '#back-to-requirements'
    );

    if (!backButton) return;

    showListView();

  });

}


/* ========================================
   INITIALIZE PAGE
======================================== */

function initializeOjtRequirements(): void {

  if (
    !headingSection ||
    !completionSection ||
    !listSection ||
    !assistanceSection ||
    !detailSection
  ) {
    console.error(
      'OJT Requirements page: One or more required page sections are missing.'
    );

    return;
  }

  renderHeading();

  renderCompletionCard();

  renderRequirementList();

  renderAssistanceCard();

  // The detail view is hidden by default.
  detailSection.hidden = true;

  initializeRequirementActions();

}


initializeOjtRequirements();
