
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

            <span class="badge badge--approved">
              <span class="badge__dot"></span>
              Confirmed
            </span>

          </div>

          <p class="deployment-status__message">
            ${escapeHtml(placement.status.message)}
          </p>

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
              Company Assignment
            </h2>

          </div>

        </div>

        <div class="deployment-company">

          <span class="deployment-company__icon">
            ${icon('business')}
          </span>

          <div class="deployment-company__details">

            <h3 class="deployment-company__name">
              ${escapeHtml(placement.company.companyName)}
            </h3>

            <div class="deployment-company__location">

              ${icon('location_on')}

              <span>
                ${escapeHtml(
                  placement.company.location?.trim() || 'Not provided'
                )}
              </span>

            </div>

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

          ${renderInfoField({
            label: 'Company Supervisor',
            value: information.companySupervisor
          })}

          ${renderInfoField({
            label: 'Deployment Date',
            value: information.deploymentDate
          })}

          ${renderInfoField({
            label: 'OJT Coordinator',
            value: information.ojtCoordinator
          })}

          ${renderInfoField({
            label: 'Required OJT Hours',
            value: information.requiredOjtHours
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

        ${
          placement.progress !== 'deployed'
            ? `
              <p class="deployment-stepper-message">
                Your actual OJT deployment is pending.
              </p>
            `
            : ''
        }

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

      </div>

    `;

  }
}

void loadMyDeployment();
