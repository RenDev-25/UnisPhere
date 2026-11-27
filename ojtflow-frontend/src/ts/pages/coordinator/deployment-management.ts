import { initAppShell } from '../../core/app-shell';
import {
  getCoordinatorDeploymentRequests,
  confirmStudentDeployment,
  getCoordinatorDeployedStudents,
  getCoordinatorDeploymentHistory,
  undeployStudent,
} from '../../services/application.service';
import { escapeHtml } from '../../utils/dom';

initAppShell();

const DATE_DRAFTS_KEY = 'ojtflow_deployment_date_drafts';
type DeploymentDateDraft = { start?: string; end?: string };

function readDateDrafts(): Record<string, DeploymentDateDraft> {
  try {
    return JSON.parse(localStorage.getItem(DATE_DRAFTS_KEY) || '{}') as Record<string, DeploymentDateDraft>;
  } catch {
    return {};
  }
}

function saveDateDraft(applicationId: string, field: 'start' | 'end', value: string): void {
  const drafts = readDateDrafts();
  drafts[applicationId] = { ...drafts[applicationId], [field]: value };
  localStorage.setItem(DATE_DRAFTS_KEY, JSON.stringify(drafts));
}

function emptyState(title: string, message: string): string {
  return `
    <div class="deployment-empty" role="status">
      <span class="deployment-empty__icon" aria-hidden="true">▤</span>
      <p class="deployment-empty__title">${escapeHtml(title)}</p>
      <p class="deployment-empty__text">${escapeHtml(message)}</p>
    </div>`;
}

const page = document.querySelector<HTMLElement>('#page-content');

async function render(): Promise<void> {
  if (!page) return;

  page.setAttribute('aria-busy', 'true');

  try {
    const [requests, deployed, history] = await Promise.all([
      getCoordinatorDeploymentRequests(),
      getCoordinatorDeployedStudents(),
      getCoordinatorDeploymentHistory(),
    ]);
    const dateDrafts = readDateDrafts();

    const requestContent = requests.length
      ? `<div class="deployment-requests">
          ${requests.map(item => `
            <article class="deployment-card">
              <div class="deployment-card__student">
                <h3 class="deployment-card__student-name">${escapeHtml(item.studentName)}</h3>
                <p class="deployment-card__meta">${escapeHtml(item.studentNumber)} · ${escapeHtml(item.program)}</p>
                <p class="deployment-card__meta">Accepted by: <strong>${escapeHtml(item.companyName)}</strong></p>
                <p class="deployment-card__meta">Coordinator eligibility: <strong>${escapeHtml(item.eligibilityStatus)}</strong></p>
                <p class="deployment-card__meta">Requested: ${escapeHtml(item.requestedAt)}</p>
              </div>
              <label class="deployment-card__field">
                Deployment start date
                <input type="date" data-deployment-start="${escapeHtml(item.applicationId)}" value="${escapeHtml(dateDrafts[item.applicationId]?.start || '')}" />
              </label>
              <label class="deployment-card__field">
                Deployment end date
                <input type="date" data-deployment-end="${escapeHtml(item.applicationId)}" value="${escapeHtml(dateDrafts[item.applicationId]?.end || '')}" />
              </label>
              <div class="deployment-card__actions">
                <button class="btn btn--primary" type="button" data-deploy-student="${escapeHtml(item.applicationId)}" ${item.eligibilityStatus !== 'Eligible' ? 'disabled' : ''}>Confirm &amp; Deploy</button>
              </div>
              ${item.eligibilityStatus !== 'Eligible'
                ? '<p class="deployment-card__note">This student must be marked Eligible in Eligibility &amp; Requirements before deployment.</p>'
                : ''}
            </article>`).join('')}
        </div>`
      : emptyState('No deployment requests yet', 'Accepted students can request deployment from My Applications.');

    const deployedContent = deployed.length
      ? `<div class="deployment-table-panel">
          <div class="deployment-table-wrap" role="region" aria-label="Currently deployed students table" tabindex="0">
            <table class="deployment-table">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col">Student ID</th>
                  <th scope="col">Program</th>
                  <th scope="col">Company</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Required OJT Hours</th>
                  <th scope="col">Accumulated Hours</th>
                  <th scope="col">Status</th>
                  <th scope="col" class="deployment-table__action">Action</th>
                </tr>
              </thead>
              <tbody>
                ${deployed.map(item => `
                  <tr>
                    <td class="deployment-table__student">${escapeHtml(item.studentName)}</td>
                    <td>${escapeHtml(item.studentNumber)}</td>
                    <td class="deployment-table__program">${escapeHtml(item.program)}</td>
                    <td class="deployment-table__company">${escapeHtml(item.companyName)}</td>
                    <td class="deployment-table__date">${escapeHtml(item.deploymentStartDate)}</td>
                    <td class="deployment-table__date">${escapeHtml(item.deploymentEndDate)}</td>
                    <td class="deployment-table__hours">500 HOURS</td>
                    <td class="deployment-table__hours">${Number(item.accumulatedOjtHours || 0).toLocaleString()}</td>
                    <td class="deployment-table__status"><span class="deployment-status">${escapeHtml(item.status)}</span></td>
                    <td class="deployment-table__action">
                      <button class="btn btn--danger-soft btn--small" type="button" data-undeploy-student="${escapeHtml(item.id)}">Undeploy</button>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`
      : emptyState('No students are currently deployed', 'Students will appear here after their deployment has been confirmed.');

    const historyContent = history.length
      ? `<div class="deployment-table-panel">
          <div class="deployment-table-wrap" role="region" aria-label="Deployment history table" tabindex="0">
            <table class="deployment-table deployment-table--history">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col">Student ID</th>
                  <th scope="col">Company</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Required Hours</th>
                  <th scope="col">Accumulated Hours</th>
                  <th scope="col">Status</th>
                  <th scope="col">Undeployed At</th>
                  <th scope="col">Coordinator Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${history.map(item => `
                  <tr>
                    <td class="deployment-table__student">${escapeHtml(item.studentName)}</td>
                    <td>${escapeHtml(item.studentNumber)}</td>
                    <td class="deployment-table__company">${escapeHtml(item.companyName)}</td>
                    <td class="deployment-table__date">${escapeHtml(item.deploymentStartDate)}</td>
                    <td class="deployment-table__date">${escapeHtml(item.deploymentEndDate)}</td>
                    <td class="deployment-table__hours">500 HOURS</td>
                    <td class="deployment-table__hours">${Number(item.accumulatedOjtHours || 0).toLocaleString()}</td>
                    <td class="deployment-table__status"><span class="deployment-status">${escapeHtml(item.status)}</span></td>
                    <td>${escapeHtml(item.undeployedAt || '—')}</td>
                    <td class="deployment-table__remarks">${escapeHtml(item.undeploymentRemarks || '—')}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`
      : emptyState('No deployment history available', 'Previous deployment records will appear here when a deployment is ended.');

    page.innerHTML = `
      <div class="deployment-page">
        <header class="deployment-page__header">
          <h1 class="deployment-page__title">Deployment Management</h1>
          <p class="deployment-page__subtitle">Assign and monitor the official OJT deployment period of students accepted by their company.</p>
        </header>

        <section class="deployment-section" aria-labelledby="deployment-requests-title">
          <div class="deployment-section__header">
            <div class="deployment-section__title-group">
              <h2 class="deployment-section__title" id="deployment-requests-title">Deployment Requests</h2>
              <p class="deployment-section__description">Review accepted students who have requested official deployment.</p>
            </div>
            <span class="deployment-section__count">${requests.length} ${requests.length === 1 ? 'Request' : 'Requests'}</span>
          </div>
          ${requestContent}
        </section>

        <section class="deployment-section" aria-labelledby="currently-deployed-title">
          <div class="deployment-section__header">
            <div class="deployment-section__title-group">
              <h2 class="deployment-section__title" id="currently-deployed-title">Currently Deployed Students</h2>
              <p class="deployment-section__description">Students with an officially confirmed OJT deployment.</p>
            </div>
            <span class="deployment-section__count">${deployed.length} ${deployed.length === 1 ? 'Student' : 'Students'}</span>
          </div>
          ${deployedContent}
        </section>

        <section class="deployment-section" aria-labelledby="deployment-history-title">
          <div class="deployment-section__header">
            <div class="deployment-section__title-group">
              <h2 class="deployment-section__title" id="deployment-history-title">Deployment History</h2>
              <p class="deployment-section__description">Review previous deployment records and coordinator remarks.</p>
            </div>
            <span class="deployment-section__count">${history.length} ${history.length === 1 ? 'Record' : 'Records'}</span>
          </div>
          ${historyContent}
        </section>
      </div>

      <dialog id="undeploy-dialog" class="deployment-dialog" aria-labelledby="undeploy-dialog-title">
        <div class="deployment-dialog__content">
          <h2 class="deployment-dialog__title" id="undeploy-dialog-title">Undeploy Student</h2>
          <p class="deployment-dialog__description">Provide the reason for ending this deployment. This reason will be saved in the deployment history and shared with the student and company supervisor. The company's reserved slot will remain occupied.</p>
          <label class="deployment-dialog__label" for="undeploy-remarks">
            Coordinator Remarks <span aria-hidden="true">*</span>
            <textarea id="undeploy-remarks" class="deployment-dialog__textarea" rows="5" required maxlength="1000" placeholder="Enter the reason for undeployment..."></textarea>
          </label>
          <p id="undeploy-error" class="deployment-dialog__error" role="alert"></p>
          <div class="deployment-dialog__actions">
            <button class="btn btn--secondary" type="button" id="undeploy-cancel">Cancel</button>
            <button class="btn btn--danger" type="button" id="undeploy-confirm">Confirm Undeployment</button>
          </div>
        </div>
      </dialog>`;

    page.querySelectorAll<HTMLInputElement>('[data-deployment-start]').forEach(input => {
      const id = input.dataset.deploymentStart || '';
      input.addEventListener('input', () => saveDateDraft(id, 'start', input.value));
      input.addEventListener('change', () => saveDateDraft(id, 'start', input.value));
    });

    page.querySelectorAll<HTMLInputElement>('[data-deployment-end]').forEach(input => {
      const id = input.dataset.deploymentEnd || '';
      input.addEventListener('input', () => saveDateDraft(id, 'end', input.value));
      input.addEventListener('change', () => saveDateDraft(id, 'end', input.value));
    });

    page.querySelectorAll<HTMLInputElement>('[data-deployment-start]').forEach(input => {
      const id = input.dataset.deploymentStart || '';
      const end = page.querySelector<HTMLInputElement>(`[data-deployment-end="${CSS.escape(id)}"]`);
      if (end) {
        end.min = input.value;
        input.addEventListener('change', () => { end.min = input.value; });
      }
    });

    page.querySelectorAll<HTMLButtonElement>('[data-deploy-student]').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.deployStudent || '';
        const start = page.querySelector<HTMLInputElement>(`[data-deployment-start="${CSS.escape(id)}"]`)?.value || '';
        const end = page.querySelector<HTMLInputElement>(`[data-deployment-end="${CSS.escape(id)}"]`)?.value || '';

        if (!start || !end || end < start) {
          window.alert('Select a valid deployment start date and end date.');
          return;
        }

        button.disabled = true;
        try {
          await confirmStudentDeployment(id, start, end);
          const drafts = readDateDrafts();
          delete drafts[id];
          localStorage.setItem(DATE_DRAFTS_KEY, JSON.stringify(drafts));
          window.alert('Student officially deployed. The company slot remains reserved from supervisor acceptance.');
          await render();
        } catch (error) {
          window.alert(error instanceof Error ? error.message : 'Unable to deploy student.');
          button.disabled = false;
        }
      });
    });

    const undeployDialog = page.querySelector<HTMLDialogElement>('#undeploy-dialog');
    const remarksField = page.querySelector<HTMLTextAreaElement>('#undeploy-remarks');
    const undeployError = page.querySelector<HTMLElement>('#undeploy-error');
    const confirmUndeploy = page.querySelector<HTMLButtonElement>('#undeploy-confirm');
    let pendingUndeployButton: HTMLButtonElement | null = null;

    page.querySelectorAll<HTMLButtonElement>('[data-undeploy-student]').forEach(button => {
      button.addEventListener('click', () => {
        if (!button.dataset.undeployStudent || !undeployDialog || !remarksField) return;
        pendingUndeployButton = button;
        remarksField.value = '';
        if (undeployError) undeployError.textContent = '';
        undeployDialog.showModal();
        remarksField.focus();
      });
    });

    page.querySelector<HTMLButtonElement>('#undeploy-cancel')?.addEventListener('click', () => undeployDialog?.close());

    confirmUndeploy?.addEventListener('click', async () => {
      const id = pendingUndeployButton?.dataset.undeployStudent || '';
      const remarks = remarksField?.value.trim() || '';
      if (!id || !pendingUndeployButton) return;

      if (!remarks) {
        if (undeployError) undeployError.textContent = 'Remarks are required before undeployment.';
        remarksField?.focus();
        return;
      }

      confirmUndeploy.disabled = true;
      pendingUndeployButton.disabled = true;
      try {
        await undeployStudent(id, remarks);
        undeployDialog?.close();
        await render();
      } catch (error) {
        if (undeployError) undeployError.textContent = error instanceof Error ? error.message : 'Unable to undeploy student.';
        pendingUndeployButton.disabled = false;
      } finally {
        confirmUndeploy.disabled = false;
      }
    });
  } finally {
    page.setAttribute('aria-busy', 'false');
  }
}

void render().catch(error => {
  if (page) {
    page.setAttribute('aria-busy', 'false');
    page.textContent = error instanceof Error ? error.message : 'Unable to load deployment requests.';
  }
});

window.addEventListener('focus', () => void render());
window.addEventListener('storage', event => {
  if (event.key === 'ojtflow_deployments' || event.key === 'ojtflow_applications' || event.key === 'ojtflow_student_eligibility') {
    void render();
  }
});
