import { initAppShell } from '../../core/app-shell';
import { getCoordinatorDeploymentRequests, confirmStudentDeployment, getCoordinatorDeployedStudents, getCoordinatorDeploymentHistory, undeployStudent } from '../../services/application.service';
import { escapeHtml } from '../../utils/dom';
initAppShell();
const DATE_DRAFTS_KEY = 'ojtflow_deployment_date_drafts';
type DeploymentDateDraft = { start?: string; end?: string };
function readDateDrafts(): Record<string, DeploymentDateDraft> {
  try { return JSON.parse(localStorage.getItem(DATE_DRAFTS_KEY) || '{}') as Record<string, DeploymentDateDraft>; }
  catch { return {}; }
}
function saveDateDraft(applicationId: string, field: 'start' | 'end', value: string): void {
  const drafts = readDateDrafts();
  drafts[applicationId] = { ...drafts[applicationId], [field]: value };
  localStorage.setItem(DATE_DRAFTS_KEY, JSON.stringify(drafts));
}
const page = document.querySelector<HTMLElement>('#page-content');
async function render(): Promise<void> {
  if (!page) return;
  const requests = await getCoordinatorDeploymentRequests();
  const deployed = await getCoordinatorDeployedStudents();
  const history = await getCoordinatorDeploymentHistory();
  const dateDrafts = readDateDrafts();
  page.innerHTML = `<section class="deployment-page">
    <h1>Deployment Management</h1><p class="subtitle">Assign the official OJT deployment period to students accepted by their company.</p>
    <h2>Deployment Requests</h2>
    ${requests.length ? requests.map(item => `<article class="deployment-card">
      <div><strong>${escapeHtml(item.studentName)}</strong><p>${escapeHtml(item.studentNumber)} · ${escapeHtml(item.program)}</p><p>Accepted by: ${escapeHtml(item.companyName)}</p><p>Coordinator eligibility: <strong>${escapeHtml(item.eligibilityStatus)}</strong></p><p>Requested: ${escapeHtml(item.requestedAt)}</p></div>
      <label>Deployment start date<input type="date" data-deployment-start="${escapeHtml(item.applicationId)}" value="${escapeHtml(dateDrafts[item.applicationId]?.start || '')}"></label>
      <label>Deployment end date<input type="date" data-deployment-end="${escapeHtml(item.applicationId)}" value="${escapeHtml(dateDrafts[item.applicationId]?.end || '')}"></label>
      <div class="deployment-actions"><button class="btn btn--primary" type="button" data-deploy-student="${escapeHtml(item.applicationId)}" ${item.eligibilityStatus !== 'Eligible' ? 'disabled' : ''}>Confirm &amp; Deploy</button></div>
      ${item.eligibilityStatus !== 'Eligible' ? '<p class="deployment-note">This student must be marked Eligible in Eligibility &amp; Requirements before deployment.</p>' : ''}
    </article>`).join('') : '<div class="deployment-empty"><strong>No deployment requests yet</strong><p>Accepted students can request deployment from My Applications.</p></div>'}
    <p class="deployment-note">Required OJT duration: <strong>500 HOURS</strong></p>
    <h2>Currently Deployed Students</h2>
    ${deployed.length ? `<div class="deployment-table-wrap"><table class="deployment-table"><thead><tr><th>Student</th><th>Student ID</th><th>Program</th><th>Company</th><th>Start Date</th><th>End Date</th><th>Required OJT Hours</th><th>Accumulated Hours</th><th>Status</th><th>Action</th></tr></thead><tbody>${deployed.map(item => `<tr><td>${escapeHtml(item.studentName)}</td><td>${escapeHtml(item.studentNumber)}</td><td>${escapeHtml(item.program)}</td><td>${escapeHtml(item.companyName)}</td><td>${escapeHtml(item.deploymentStartDate)}</td><td>${escapeHtml(item.deploymentEndDate)}</td><td>500 HOURS</td><td>${Number(item.accumulatedOjtHours || 0)}</td><td>${escapeHtml(item.status)}</td><td><button class="btn btn--secondary" type="button" data-undeploy-student="${escapeHtml(item.id)}">Undeploy</button></td></tr>`).join('')}</tbody></table></div>` : '<p class="deployment-note">No students are currently deployed.</p>'}
    <h2>Deployment History</h2>
    ${history.length ? `<div class="deployment-table-wrap"><table class="deployment-table"><thead><tr><th>Student</th><th>Student ID</th><th>Company</th><th>Start Date</th><th>End Date</th><th>Required Hours</th><th>Accumulated Hours</th><th>Status</th><th>Undeployed At</th><th>Coordinator Remarks</th></tr></thead><tbody>${history.map(item => `<tr><td>${escapeHtml(item.studentName)}</td><td>${escapeHtml(item.studentNumber)}</td><td>${escapeHtml(item.companyName)}</td><td>${escapeHtml(item.deploymentStartDate)}</td><td>${escapeHtml(item.deploymentEndDate)}</td><td>500 HOURS</td><td>${Number(item.accumulatedOjtHours || 0)}</td><td>${escapeHtml(item.status)}</td><td>${escapeHtml(item.undeployedAt || '—')}</td><td>${escapeHtml(item.undeploymentRemarks || '—')}</td></tr>`).join('')}</tbody></table></div>` : '<p class="deployment-note">No deployment history available.</p>'}
  </section>
  <dialog id="undeploy-dialog" style="max-width:560px;width:calc(100% - 32px);border:0;border-radius:14px;padding:24px;box-shadow:0 18px 60px rgba(0,0,0,.25)">
    <h2 style="margin-top:0">Undeploy Student</h2>
    <p>Provide the reason for ending this deployment. This reason will be saved in the deployment history and shared with the student and company supervisor. The company's reserved slot will remain occupied.</p>
    <label for="undeploy-remarks">Coordinator Remarks <span aria-hidden="true">*</span></label>
    <textarea id="undeploy-remarks" rows="5" required maxlength="1000" style="display:block;width:100%;box-sizing:border-box;margin:8px 0 12px;padding:10px;border:1px solid #cbd5e1;border-radius:8px" placeholder="Enter the reason for undeployment..."></textarea>
    <p id="undeploy-error" role="alert" style="color:#b91c1c"></p>
    <div style="display:flex;justify-content:flex-end;gap:8px"><button class="btn btn--secondary" type="button" id="undeploy-cancel">Cancel</button><button class="btn btn--primary" type="button" id="undeploy-confirm">Confirm Undeployment</button></div>
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
    if (end) { end.min = input.value; input.addEventListener('change', () => { end.min = input.value; }); }
  });
  page.querySelectorAll<HTMLButtonElement>('[data-deploy-student]').forEach(button => button.addEventListener('click', async () => {
    const id = button.dataset.deployStudent || '';
    const start = page.querySelector<HTMLInputElement>(`[data-deployment-start="${CSS.escape(id)}"]`)?.value || '';
    const end = page.querySelector<HTMLInputElement>(`[data-deployment-end="${CSS.escape(id)}"]`)?.value || '';
    if (!start || !end || end < start) { window.alert('Select a valid deployment start date and end date.'); return; }
    button.disabled = true;
    try {
      await confirmStudentDeployment(id, start, end);
      const drafts = readDateDrafts(); delete drafts[id]; localStorage.setItem(DATE_DRAFTS_KEY, JSON.stringify(drafts));
      window.alert('Student officially deployed. The company slot remains reserved from supervisor acceptance.');
      await render();
    }
    catch (error) { window.alert(error instanceof Error ? error.message : 'Unable to deploy student.'); button.disabled = false; }
  }));
  const undeployDialog = page.querySelector<HTMLDialogElement>('#undeploy-dialog');
  const remarksField = page.querySelector<HTMLTextAreaElement>('#undeploy-remarks');
  const undeployError = page.querySelector<HTMLElement>('#undeploy-error');
  const confirmUndeploy = page.querySelector<HTMLButtonElement>('#undeploy-confirm');
  let pendingUndeployButton: HTMLButtonElement | null = null;
  page.querySelectorAll<HTMLButtonElement>('[data-undeploy-student]').forEach(button => button.addEventListener('click', () => {
    if (!button.dataset.undeployStudent || !undeployDialog || !remarksField) return;
    pendingUndeployButton = button;
    remarksField.value = '';
    if (undeployError) undeployError.textContent = '';
    undeployDialog.showModal();
    remarksField.focus();
  }));
  page.querySelector<HTMLButtonElement>('#undeploy-cancel')?.addEventListener('click', () => undeployDialog?.close());
  confirmUndeploy?.addEventListener('click', async () => {
    const id = pendingUndeployButton?.dataset.undeployStudent || '';
    const remarks = remarksField?.value.trim() || '';
    if (!id || !pendingUndeployButton) return;
    if (!remarks) { if (undeployError) undeployError.textContent = 'Remarks are required before undeployment.'; remarksField?.focus(); return; }
    confirmUndeploy.disabled = true;
    pendingUndeployButton.disabled = true;
    try {
      await undeployStudent(id, remarks);
      undeployDialog?.close();
      await render();
    } catch (error) {
      if (undeployError) undeployError.textContent = error instanceof Error ? error.message : 'Unable to undeploy student.';
      pendingUndeployButton.disabled = false;
    } finally { confirmUndeploy.disabled = false; }
  });
}
void render().catch(error => { if(page) page.textContent = error instanceof Error ? error.message : 'Unable to load deployment requests.'; });

window.addEventListener('focus', () => void render());
window.addEventListener('storage', event => {
  if (event.key === 'ojtflow_deployments' || event.key === 'ojtflow_applications' || event.key === 'ojtflow_student_eligibility') void render();
});

