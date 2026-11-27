import { initAppShell } from '../../core/app-shell';
import {
  getSupervisorApplications,
  getSupervisorApplicationDetails,
  updateSupervisorApplicationDecision,
} from '../../services/application.service';

initAppShell();

const root = document.querySelector<HTMLElement>('#sup-applications-list');
const detailsDialog = document.querySelector<HTMLDialogElement>('#sup-applicant-dialog');
const resumeDialog = document.querySelector<HTMLDialogElement>('#sup-resume-dialog');
const details = document.querySelector<HTMLElement>('#sup-applicant-details');
const preview = document.querySelector<HTMLIFrameElement>('#sup-resume-preview');
const download = document.querySelector<HTMLAnchorElement>('#sup-resume-download');
const resumeFilename = document.querySelector<HTMLElement>('#sup-resume-filename');
const closeDetails = document.querySelector<HTMLButtonElement>('#sup-dialog-close');
const closeResume = document.querySelector<HTMLButtonElement>('#sup-resume-close');
const remarksInput = document.querySelector<HTMLTextAreaElement>('#sup-review-remarks');
const message = document.querySelector<HTMLElement>('#sup-review-message');
const acceptButton = document.querySelector<HTMLButtonElement>('#sup-review-accept');
const rejectButton = document.querySelector<HTMLButtonElement>('#sup-review-reject');

let activeApplicationId = '';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] || char);
}

async function render(): Promise<void> {
  if (!root) return;
  const rows = await getSupervisorApplications();
  root.innerHTML = rows.map(application => `
    <article class="sup-application">
      <div class="sup-application__student">
        <strong>${escapeHtml(application.studentName)}</strong>
        <p>${escapeHtml(application.studentNumber)} · ${escapeHtml(application.academicProgram)}</p>
        <small>Applied ${escapeHtml(application.dateApplied)}</small>
      </div>
      <span class="sup-pill ${application.status === 'Accepted' ? 'sup-pill--success' : application.status === 'Rejected' ? 'sup-pill--rejected' : ''}">${escapeHtml(application.coordinatorUndeployed ? 'Deployment Cancelled by Coordinator' : application.status === 'Accepted' ? 'Accepted by Supervisor' : application.status)}</span>
      ${application.coordinatorUndeployed ? `<p class="sup-muted">Coordinator's reason: ${escapeHtml(application.coordinatorUndeploymentRemarks || 'No reason recorded.')}</p>` : application.status === 'Accepted' ? `<p class="sup-muted">Status: ${escapeHtml((application as typeof application & {officialDeploymentStatus?:string}).officialDeploymentStatus || 'Awaiting Student Response to Offer')}</p>` : ''}
      <div class="sup-actions">
        <button class="button button--primary" type="button" data-view-details="${escapeHtml(application.id)}">View Details</button>
        <button class="button button--secondary" type="button" data-view-resume="${escapeHtml(application.id)}">View Resume</button>
      </div>
    </article>`).join('') || '<div class="sup-empty"><strong>No applications yet</strong><p>Student applications submitted to your company will appear here.</p></div>';

  root.querySelectorAll<HTMLButtonElement>('[data-view-details]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.viewDetails;
      if (id) void openApplicantDetails(id);
    });
  });
  root.querySelectorAll<HTMLButtonElement>('[data-view-resume]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.viewResume;
      if (id) void openApplicantResume(id);
    });
  });
}

async function loadApplicant(id: string) {
  const application = await getSupervisorApplicationDetails(id);
  activeApplicationId = application.id;
  return application;
}

async function openApplicantDetails(id: string): Promise<void> {
  if (!detailsDialog || !details) return;
  try {
    const application = await loadApplicant(id);
    details.innerHTML = `
      <section class="sup-applicant-grid">
        <div><span>Full Name</span><strong>${escapeHtml(application.studentName)}</strong></div>
        <div><span>Student Number</span><strong>${escapeHtml(application.studentNumber)}</strong></div>
        <div><span>Email Address</span><strong>${escapeHtml(application.studentEmail)}</strong></div>
        <div><span>Contact Number</span><strong>Not provided</strong></div>
        <div><span>Academic Program</span><strong>${escapeHtml(application.academicProgram)}</strong></div>
        <div><span>Year Level</span><strong>${escapeHtml(application.yearLevel)}</strong></div>
        <div><span>Company Applied To</span><strong>${escapeHtml(application.companyName)}</strong></div>
        <div><span>Application Date</span><strong>${escapeHtml(application.dateApplied)}</strong></div>
        <div><span>Supervisor Decision</span><strong>${escapeHtml(application.status === 'Accepted' ? 'Accepted' : application.status)}</strong></div>
        <div><span>Status</span><strong>${escapeHtml((application as typeof application & {officialDeploymentStatus?:string}).officialDeploymentStatus || (application.status === 'Accepted' ? 'Awaiting Student Response to Offer' : application.status))}</strong></div>
        <div><span>OJT Eligibility (Coordinator)</span><strong>${escapeHtml((application as typeof application & {eligibilityStatus?:string}).eligibilityStatus || 'Not Eligible Yet')}</strong><small>Read-only status determined by the OJT Coordinator</small></div>
        <div><span>Official Deployment Status</span><strong>${escapeHtml((application as typeof application & {officialDeploymentStatus?:string}).officialDeploymentStatus || 'Not yet accepted')}</strong></div>
        ${application.coordinatorUndeployed ? `<div><span>Coordinator Undeployment Date</span><strong>${escapeHtml(application.coordinatorUndeployedAt || 'Not recorded')}</strong></div><div><span>Coordinator's Reason</span><strong>${escapeHtml(application.coordinatorUndeploymentRemarks || 'No reason recorded.')}</strong></div>` : ''}
      </section>`;
    if (remarksInput) {
      remarksInput.value = application.supervisorRemarks || '';
      remarksInput.required = application.status === 'Pending Decision' || application.status === 'Under Review';
      remarksInput.disabled = !remarksInput.required;
    }
    if (message) message.textContent = application.supervisorRemarks ? `Previous company feedback: ${application.supervisorRemarks}` : '';
    const canDecide = application.status === 'Pending Decision' || application.status === 'Under Review';
    if (acceptButton) acceptButton.disabled = !canDecide;
    if (rejectButton) rejectButton.disabled = !canDecide;
    detailsDialog.showModal();
  } catch (error) {
    window.alert(error instanceof Error ? error.message : 'Unable to load applicant details.');
  }
}

async function openApplicantResume(id: string): Promise<void> {
  if (!resumeDialog || !preview || !download) return;
  try {
    const application = await loadApplicant(id);
    if (!application.resumeDataUrl) throw new Error('No resume was attached to this application.');
    preview.src = application.resumeDataUrl;
    download.href = application.resumeDataUrl;
    download.download = application.resumeFileName || 'applicant-resume.pdf';
    if (resumeFilename) resumeFilename.textContent = application.resumeFileName || 'Applicant PDF resume';
    resumeDialog.showModal();
  } catch (error) {
    window.alert(error instanceof Error ? error.message : 'Unable to open applicant resume.');
  }
}

async function decide(decision: 'Accepted' | 'Rejected'): Promise<void> {
  if (!activeApplicationId || !remarksInput) return;
  const feedback = remarksInput.value.trim();
  if (!feedback) {
    remarksInput.focus();
    if (message) message.textContent = 'Please provide feedback before accepting or rejecting this student.';
    return;
  }
  if (acceptButton) acceptButton.disabled = true;
  if (rejectButton) rejectButton.disabled = true;
  try {
    await updateSupervisorApplicationDecision(activeApplicationId, decision, feedback);
    if (message) message.textContent = `Student ${decision.toLowerCase()}. Feedback saved successfully.`;
    await render();
    window.setTimeout(() => detailsDialog?.close(), 700);
  } catch (error) {
    if (message) message.textContent = error instanceof Error ? error.message : 'Unable to update application.';
    if (acceptButton) acceptButton.disabled = false;
    if (rejectButton) rejectButton.disabled = false;
  }
}

acceptButton?.addEventListener('click', () => void decide('Accepted'));
rejectButton?.addEventListener('click', () => void decide('Rejected'));
closeDetails?.addEventListener('click', () => detailsDialog?.close());
closeResume?.addEventListener('click', () => {
  if (preview) preview.src = 'about:blank';
  resumeDialog?.close();
});
detailsDialog?.addEventListener('click', event => { if (event.target === detailsDialog) detailsDialog.close(); });
resumeDialog?.addEventListener('click', event => {
  if (event.target === resumeDialog) {
    if (preview) preview.src = 'about:blank';
    resumeDialog.close();
  }
});

render().catch(error => {
  if (root) root.textContent = error instanceof Error ? error.message : 'Unable to load applications.';
});

window.addEventListener('storage', event => { if (event.key === 'ojtflow_deployments') void render(); });
window.addEventListener('focus', () => void render());
window.setInterval(() => void render(), 5000);
