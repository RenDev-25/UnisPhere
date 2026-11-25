
/* =========================================================
   OJTFlow — Coordinator Company Details
   Stage 7.6: Company Details Mockup
   Phase 11: Service Integration
   ========================================================= */

import { initAppShell } from '../../core/app-shell';
import { getCompanyDetails } from '../../services/company.service';
import type { CompanyDetailsRecord } from '../../mocks/company.mock';

// =========================================================
// INITIALIZE APPLICATION SHELL
// =========================================================

initAppShell();

// =========================================================
// DOM ELEMENT
// =========================================================

const pageContent = document.querySelector<HTMLElement>(
  '#page-content',
);

if (!pageContent) {
  throw new Error(
    'Company Details: #page-content element was not found.',
  );
}

// Explicitly narrowed HTMLElement reference
const companyDetailsPageContent: HTMLElement = pageContent;

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
// SHARED FIELD RENDERING
// =========================================================

function renderInfoField(
  label: string,
  value: string,
  options?: {
    copy?: boolean;
    link?: string;
  },
): string {
  const safeValue = escapeHtml(value);

  let valueMarkup = `
    <span class="info-field__value ${
      value === '—' ? 'info-field__value--empty' : ''
    }">
      ${safeValue}
    </span>
  `;

  if (options?.link && value !== '—') {
    valueMarkup = `
      <a
        class="info-field__value info-field__value--link"
        href="${escapeHtml(options.link)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${safeValue}
      </a>
    `;
  }

  const copyButton =
    options?.copy && value !== '—'
      ? `
        <button
          type="button"
          class="company-details-copy-button"
          data-copy-value="${safeValue}"
          aria-label="Copy ${escapeHtml(label)}"
          title="Copy ${escapeHtml(label)}"
        >
          <span aria-hidden="true">▢</span>
        </button>
      `
      : '';

  return `
    <div class="info-field">

      <span class="info-field__label">
        ${escapeHtml(label)}
      </span>

      <div class="info-field__content">
        ${valueMarkup}
        ${copyButton}
      </div>

    </div>
  `;
}

// =========================================================
// 7.6.2 BACK LINK, HEADING AND HEADER CARD
// =========================================================

function renderCompanyHeader(
  company: CompanyDetailsRecord,
): string {
  return `
    <section class="company-details-heading">

      <a
        href="company-management.html"
        class="company-details-back-link"
      >
        <span aria-hidden="true">←</span>
        Back to Company Management
      </a>

      <div class="company-details-title-row">

        <h1 class="company-details-title">
          Company Details
        </h1>

        <span class="chip">
          ${escapeHtml(company.academicYear)}
        </span>

      </div>

    </section>

    <section
      class="card company-details-hero"
      aria-label="Company summary"
    >

      <div class="company-details-logo" aria-hidden="true">
        ${escapeHtml(company.initials)}
      </div>

      <div class="company-details-hero-content">

        <div class="company-details-tags">

          <span class="company-details-partner-tag">
            Partner ID: ${escapeHtml(company.partnerId)}
          </span>

          <span class="company-details-partner-tag">
            ${escapeHtml(company.establishmentType)}
          </span>

        </div>

        <h2 class="company-details-company-name">
          ${escapeHtml(company.companyName)}
        </h2>

        <div class="company-details-hero-meta">

          <span class="company-details-location">
            <span aria-hidden="true">⌖</span>
            ${escapeHtml(company.location)}
          </span>

          <span class="badge badge--approved">
            <span class="badge__dot" aria-hidden="true"></span>
            ACTIVE
          </span>

          <span class="company-details-slots">
            ${company.availableSlots} Available Slots
          </span>

        </div>

      </div>

    </section>
  `;
}

// =========================================================
// 7.6.3 COMPANY INFORMATION
// =========================================================

function renderCompanyInformation(
  company: CompanyDetailsRecord,
): string {
  const information = company.information;

  return `
    <section class="section-card company-details-section">

      <div class="section-card__header">

        <div class="section-card__heading">
          <h2 class="section-card__title">
            Company Information
          </h2>
        </div>

      </div>

      <div class="info-grid">

        ${renderInfoField(
          'Company Name',
          information.companyName,
        )}

        ${renderInfoField(
          'Address',
          information.address,
        )}

        ${renderInfoField(
          'City / Municipality',
          information.cityMunicipality,
        )}

        ${renderInfoField(
          'Province',
          information.province,
        )}

        ${renderInfoField(
          'Email',
          information.email,
          { copy: true },
        )}

        ${renderInfoField(
          'Contact Number',
          information.contactNumber,
          { copy: true },
        )}

        ${renderInfoField(
          'Website',
          information.website,
          {
            link:
              information.website !== '—'
                ? information.website
                : undefined,
          },
        )}

      </div>

    </section>
  `;
}

// =========================================================
// 7.6.4 COMPANY REPRESENTATIVE
// =========================================================

function renderCompanyRepresentative(
  company: CompanyDetailsRecord,
): string {
  const representative = company.representative;

  return `
    <section class="section-card company-details-section">

      <div class="section-card__header">

        <div class="section-card__heading">
          <h2 class="section-card__title">
            Company Representative
          </h2>
        </div>

      </div>

      <div class="info-grid">

        ${renderInfoField(
          'Contact Person',
          representative.contactPerson,
        )}

        ${renderInfoField(
          'Position / Designation',
          representative.position,
        )}

        ${renderInfoField(
          'Contact Person Email',
          representative.email,
          { copy: true },
        )}

        ${renderInfoField(
          'Contact Person Contact Number',
          representative.contactNumber,
          { copy: true },
        )}

      </div>

    </section>
  `;
}

// =========================================================
// 7.6.5 OJT PARTNERSHIP DETAILS
// =========================================================

function renderAcceptedPrograms(
  company: CompanyDetailsRecord,
): string {
  return company.partnership.acceptedPrograms
    .map((program) => `
      <div class="company-details-program">

        <span class="company-details-program-code">
          ${escapeHtml(program.code)}
        </span>

        <span class="company-details-program-hours">
          ${program.requiredHours} hours
        </span>

      </div>
    `)
    .join('');
}

function renderPartnershipDetails(
  company: CompanyDetailsRecord,
): string {
  const partnership = company.partnership;

  return `
    <section class="section-card company-details-section">

      <div class="section-card__header">

        <div class="section-card__heading">
          <h2 class="section-card__title">
            OJT Partnership Details
          </h2>
        </div>

      </div>

      <div class="info-grid">

        <div class="info-field">

          <span class="info-field__label">
            Accepted Academic Programs
          </span>

          <div class="company-details-program-list">
            ${renderAcceptedPrograms(company)}
          </div>

        </div>

        <div class="info-field">

          <span class="info-field__label">
            Available OJT Slots
          </span>

          <div class="info-field__content">

            <strong class="info-field__value">
              ${partnership.availableSlots} Slots Available
            </strong>

          </div>

          <p class="company-details-allocation-note">
            ${escapeHtml(partnership.allocationNote)}
          </p>

        </div>

        <div class="info-field">

          <span class="info-field__label">
            Company Status
          </span>

          <div class="info-field__content">

            <span class="badge badge--approved">
              <span class="badge__dot" aria-hidden="true"></span>
              Active
            </span>

          </div>

          <p class="company-details-status-message">
            ${escapeHtml(partnership.companyStatus)}
          </p>

        </div>

        <div class="info-field">

          <span class="info-field__label">
            Partnership Remarks
          </span>

          <p class="company-details-remarks">
            ${escapeHtml(partnership.partnershipRemarks)}
          </p>

        </div>

      </div>

    </section>
  `;
}

// =========================================================
// 7.6.6 FOOTER BAR
// =========================================================

function renderCompanyDetailsFooter(
  company: CompanyDetailsRecord,
): string {
  return `
    <footer class="company-details-footer">

      <div class="company-details-verification">

        <p class="company-details-verification-text">
          ${escapeHtml(company.verificationText)}
        </p>

        <p class="company-details-updated">
          Last updated ${escapeHtml(company.lastUpdated)}.
        </p>

      </div>

      <div class="company-details-footer-actions">

        <a
          href="company-management.html"
          class="btn btn--secondary"
        >
          Back to Directory
        </a>

        <a
          href="company-edit.html?id=${encodeURIComponent(company.partnerId)}"
          class="btn btn--primary"
        >
          Edit Company
        </a>

      </div>

    </footer>
  `;
}

// =========================================================
// RENDER COMPLETE PAGE
// =========================================================

function renderCompanyDetails(
  company: CompanyDetailsRecord,
): void {
  companyDetailsPageContent.innerHTML = `
    <div class="company-details-page">

      ${renderCompanyHeader(company)}

      ${renderCompanyInformation(company)}

      ${renderCompanyRepresentative(company)}

      ${renderPartnershipDetails(company)}

      ${renderCompanyDetailsFooter(company)}

    </div>
  `;
}

// =========================================================
// COPY BUTTON INTERACTION
// =========================================================

function initializeCopyButtons(): void {
  const copyButtons =
    companyDetailsPageContent.querySelectorAll<HTMLButtonElement>(
      '[data-copy-value]',
    );

  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copyValue;

      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);

        const originalText = button.textContent;
        button.textContent = 'Copied!';

        window.setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    });
  });
}

// =========================================================
// PAGE INITIALIZATION — PHASE 11 SERVICE INTEGRATION
// =========================================================

async function initCompanyDetails(): Promise<void> {
  const companyId = new URLSearchParams(window.location.search).get('id') || undefined;
  const company = await getCompanyDetails(companyId);

  renderCompanyDetails(company as CompanyDetailsRecord);

  initializeCopyButtons();
}

void initCompanyDetails().catch((error: unknown) => {
  console.error('Failed to load company details:', error);
});
