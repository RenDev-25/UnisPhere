
// src/ts/pages/student/my-deployment.ts

import { initAppShell } from '../../core/app-shell';

import { getMyDeployment } from '../../services/deployment.service';

import { qs, escapeHtml, icon } from '../../utils/dom';

import { renderInfoField } from '../../components/info-field';

import { renderStepper } from '../../components/stepper';

import { renderEmptyState } from '../../components/empty-state';

import type {
  DeploymentProgress
} from '../../types/deployment.types';


// =============================================
// 1. INITIALIZE APPLICATION SHELL
// =============================================

initAppShell();

async function loadMyDeployment(): Promise<void> {
  const data = await getMyDeployment();

  // =============================================
  // 2. PAGE HEADING
  // =============================================

  const content = qs<HTMLElement>('#deployment-content');

  const heading = qs<HTMLElement>('#deployment-heading');

  heading.innerHTML = `
    <section class="page-header">

      <div class="page-heading">

        <h1 class="page-title">
          ${escapeHtml(data.heading.title)}
        </h1>

        <p class="page-subtitle">
          ${escapeHtml(data.heading.subtitle)}
        </p>

      </div>

    </section>
  `;

  // =============================================
  // 3. NO-PLACEMENT STATE
  // =============================================

  if (!data.placement) {

    content.innerHTML = `
      <div class="deployment-content">

        ${renderEmptyState({
          iconName: 'work_outline',
          title: 'No placement yet'
        })}

      </div>
    `;

  } else {

    const placement = data.placement;

    // =============================================
    // 4. DEPLOYMENT STATUS CARD
    // =============================================

    const statusCard = `

      <section class="section-card deployment-status-card">

        <div class="section-card__header">

          <div class="section-card__heading">

            <h2 class="section-card__title">
              ${escapeHtml(placement.status.title)}
            </h2>

          </div>

        </div>

        <div class="deployment-status__body">

          <div class="deployment-status__heading">

            <h3 class="deployment-status__value">
              ${escapeHtml(placement.status.status)}
            </h3>

            <span class="badge ${placement.progress === 'undeployed' ? 'badge--inactive' : 'badge--approved'}">
              <span class="badge__dot"></span>
              ${escapeHtml(placement.status.status)}
            </span>

          </div>

          <p class="deployment-status__message">
            ${escapeHtml(placement.status.message)}
          </p>
          ${placement.progress === 'undeployed' ? `<p class="deployment-stepper-message"><strong>Placement Status:</strong> ${escapeHtml(placement.placementStatus || 'Previous Deployment Ended')}</p>${placement.undeploymentRemarks ? `<p class="deployment-stepper-message"><strong>Coordinator's Remarks:</strong> ${escapeHtml(placement.undeploymentRemarks)}</p>` : ''}` : ''}

        </div>

      </section>

    `;

    // =============================================
    // 5. COMPANY ASSIGNMENT CARD
    // =============================================

    const companyCard = `

      <section class="section-card deployment-company-card">

        <div class="section-card__header">

          <div class="section-card__heading">

            <h2 class="section-card__title">
              ${placement.progress === 'undeployed' ? 'Company Assignment — Historical' : 'Company Assignment'}
            </h2>

          </div>

        </div>

        ${placement.progress === 'undeployed' ? `
          <p class="deployment-status__message">Previous Deployment Ended. Your former company assignment is shown only in deployment history and is not an active placement.</p>
        ` : ''}

        <div class="deployment-company">

          <span class="deployment-company__icon">
            ${icon('business')}
          </span>

          <div class="deployment-company__details">

            <h3 class="deployment-company__name">
              ${escapeHtml(placement.company.companyName)}
            </h3>

            ${placement.progress !== 'undeployed' ? `<div class="deployment-company__location">${icon('location_on')}<span>${escapeHtml(placement.company.location?.trim() || 'Not provided')}</span></div>` : ''}

          </div>

        </div>

      </section>

    `;


    // =============================================
    // 6. DEPLOYMENT INFORMATION CARD
    // =============================================

    const information = placement.information;

    const informationCard = `

      <section class="section-card deployment-information-card">

        <div class="section-card__header">

          <div class="section-card__heading">

            <h2 class="section-card__title">
              Deployment Information
            </h2>

          </div>

        </div>

        <div class="info-grid">

          ${renderInfoField({
            label: 'Academic Program',
            value: information.academicProgram
          })}

          ${placement.progress !== 'undeployed' ? `
            ${renderInfoField({ label: 'Company Supervisor', value: information.companySupervisor })}
            ${renderInfoField({ label: 'Deployment Start Date', value: information.deploymentDate })}
            ${renderInfoField({ label: 'Deployment End Date', value: information.deploymentEndDate || null })}
            ${renderInfoField({ label: 'Total Deployment Duration', value: information.deploymentDuration || null })}
          ` : `<p class="deployment-stepper-message">There is no active deployment. Previous company details and dates are available in Previous Deployment History.</p>`}

          ${renderInfoField({
            label: 'OJT Coordinator',
            value: information.ojtCoordinator
          })}

          ${renderInfoField({
            label: 'Required OJT Hours',
            value: `${information.requiredOjtHours || 500} HOURS`
          })}

          ${renderInfoField({
            label: placement.progress === 'undeployed' ? 'Previously Accumulated OJT Hours' : 'Accumulated OJT Hours',
            value: `${information.accumulatedOjtHours || 0} HOURS`
          })}

        </div>

      </section>

    `;


    // =============================================
    // 7. PLACEMENT STATUS STEPPER
    // =============================================

    function getStepperSteps(progress: DeploymentProgress) {

      if (progress === 'placement-confirmed') {
        return [
          { label: 'Application Accepted', state: 'done' as const },
          { label: 'Placement Confirmed', state: 'done' as const },
          { label: 'Deployed', state: 'pending' as const }
        ];
      }

      if (progress === 'undeployed') {
        return [
          { label: 'Previous Deployment Ended', state: 'done' as const },
          { label: 'Submit New Company Application', state: 'active' as const },
          { label: 'Await Company Offer', state: 'pending' as const },
          { label: 'Coordinator Review', state: 'pending' as const },
          { label: 'Official Deployment', state: 'pending' as const }
        ];
      }

      if (progress === 'application-accepted') {
        return [
          { label: 'Application Accepted', state: 'active' as const },
          { label: 'Placement Confirmed', state: 'pending' as const },
          { label: 'Deployed', state: 'pending' as const }
        ];
      }

      return [
        { label: 'Application Accepted', state: 'done' as const },
        { label: 'Placement Confirmed', state: 'done' as const },
        { label: 'Deployed', state: 'done' as const }
      ];
    }


    const stepperCard = `

      <section class="section-card deployment-progress-card">

        <div class="section-card__header">

          <div class="section-card__heading">

            <h2 class="section-card__title">
              Placement Status
            </h2>

          </div>

        </div>

        ${renderStepper({
          steps: getStepperSteps(placement.progress)
        })}

        ${placement.progress === 'undeployed'
          ? `<p class="deployment-stepper-message">Your previous deployment has ended. Submit a new company application and complete the offer and coordinator review process before being deployed again.</p>`
          : placement.progress !== 'deployed'
            ? `<p class="deployment-stepper-message">Your actual OJT deployment is pending.</p>`
            : ''}

      </section>

    `;


    // =============================================
    // 8. RENDER DEPLOYMENT PAGE
    // =============================================

    content.innerHTML = `

      <div class="deployment-content">

        ${statusCard}

        ${companyCard}

        ${informationCard}

        ${stepperCard}

        ${data.history?.some(item => item.status !== 'Deployed') ? `
          <section class="section-card deployment-information-card">
            <div class="section-card__header"><div class="section-card__heading"><h2 class="section-card__title">Previous Deployment History</h2></div></div>
            <p class="deployment-stepper-message">These records are retained for tracking only and are not current company assignments.</p>
            <div class="info-grid">
              ${data.history.filter(item => item.status !== 'Deployed').map(item => `
                <div class="deployment-additional-assignment">
                  <h3>${escapeHtml(item.companyName)}</h3>
                  <p>Status: ${escapeHtml(item.status)}</p>
                  <p>Start: ${escapeHtml(item.deploymentStartDate || 'Not provided')}</p>
                  <p>Undeployed At: ${escapeHtml(item.undeployedAt || 'Not recorded')}</p><p>Scheduled End Date: ${escapeHtml(item.deploymentEndDate || 'Not provided')}</p>
                  <p>Accumulated OJT Hours: ${item.accumulatedOjtHours} HOURS</p>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${data.deployments && data.deployments.length > 1 ? `
          <section class="section-card deployment-information-card">
            <div class="section-card__header"><div class="section-card__heading"><h2 class="section-card__title">Other Active Company Deployments</h2></div></div>
            <div class="info-grid">
              ${data.deployments.slice(1).map(item => `
                <div class="deployment-additional-assignment">
                  <h3>${escapeHtml(item.companyName)}</h3>
                  <p>${escapeHtml(item.location || 'Location not provided')}</p>
                  <p>Start: ${escapeHtml(item.deploymentStartDate || 'Not provided')}</p>
                  <p>End: ${escapeHtml(item.deploymentEndDate || 'Not provided')}</p>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

      </div>

    `;

  }
}

void loadMyDeployment();
window.addEventListener('storage', event => { if (event.key === 'ojtflow_deployments') void loadMyDeployment(); });
window.addEventListener('focus', () => void loadMyDeployment());
window.setInterval(() => void loadMyDeployment(), 5000);
