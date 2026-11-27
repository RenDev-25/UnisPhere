import { initAppShell } from '../../core/app-shell';
import { getStudentRequirements } from '../../services/requirement.service';
import type { RequirementRecord, RequirementStatus } from '../../types/requirement.types';
import { escapeHtml, icon } from '../../utils/dom';

initAppShell();

async function loadOjtRequirements(): Promise<void> {
  try {
    const { heading, completion, records } = await getStudentRequirements();
    const headingSection = document.querySelector<HTMLElement>('.ojt-requirements-header');
    const completionSection = document.querySelector<HTMLElement>('.requirements-completion-section');
    const listSection = document.querySelector<HTMLElement>('.requirements-list-section');
    const detailSection = document.querySelector<HTMLElement>('#requirement-detail-view');
    if (!headingSection || !completionSection || !listSection || !detailSection) throw new Error('OJT Requirements page sections are missing.');

    const statusClass = (status: RequirementStatus): string => status === 'Passed' || status === 'Approved' || status === 'Verified' ? 'badge--approved' : status === 'Pending' || status === 'Pending Review' ? 'badge--pending' : 'badge--rejected';
    const badge = (status: RequirementStatus): string => `<span class="badge ${statusClass(status)}"><span class="badge__dot"></span>${escapeHtml(status === 'Passed' ? 'Passed / Completed' : status === 'Missing' || status === 'Not Submitted' ? 'Missing / Incomplete' : status === 'Pending' ? 'Pending Verification' : status)}</span>`;
    headingSection.innerHTML = `<div class="page-header"><div class="page-heading"><h1 class="page-title">${escapeHtml(heading.title)}</h1><p class="page-subtitle">Monitor the status of your pre-deployment requirements. Actual submission and verification are conducted face-to-face at the OJT Office.</p></div></div>`;

    const passed = completion.completed;
    const pending = completion.pending || 0;
    const missing = completion.missing ?? Math.max(0, completion.total - passed - pending);
    completionSection.innerHTML = `
      <section class="section-card requirements-completion-card">
        <div class="requirements-completion-header"><h2 class="requirements-completion-title">Physical Submission &amp; Verification Status</h2></div>
        <p class="requirements-list-subtitle">Your Coordinator updates this checklist after checking your documents at the OJT Office. This page does not accept online submissions.</p>
        <div class="requirements-stat-grid">
          <div class="requirements-stat-tile"><span class="requirements-stat-label">Total Requirements</span><strong class="requirements-stat-value">${completion.total}</strong></div>
          <div class="requirements-stat-tile"><span class="requirements-stat-label">Passed</span><strong class="requirements-stat-value">${passed}</strong></div>
          <div class="requirements-stat-tile"><span class="requirements-stat-label">Pending</span><strong class="requirements-stat-value">${pending}</strong></div>
          <div class="requirements-stat-tile"><span class="requirements-stat-label">Missing / Incomplete</span><strong class="requirements-stat-value requirements-stat-value--critical">${missing}</strong></div>
        </div>
        <p class="requirements-progress-helper"><strong>${escapeHtml(completion.status)}</strong> · ${passed} of ${completion.total} requirements passed.</p>
      </section>`;

    const renderRow = (item: RequirementRecord): string => `
      <article class="requirement-row" data-requirement-id="${escapeHtml(item.id)}">
        <div class="requirement-row__icon">${icon(item.icon || 'description')}</div>
        <div class="requirement-row__main">
          <div class="requirement-row__title-line"><span class="requirement-row__number">${item.number}.</span><h3 class="requirement-row__title">${escapeHtml(item.title)}</h3><span class="requirement-category">${escapeHtml(item.category || 'General Requirement')}</span></div>
          <p class="requirement-row__description">${escapeHtml(item.description || 'Refer to the OJT Office for the applicable document details.')}</p>
          <p class="requirement-row__submission">${escapeHtml(item.submissionNote || 'Physical submission and verification must be completed at the OJT Office.')}</p>
          ${item.actionRequired ? `<div class="requirement-row__action-required">${icon('info')}<span>${escapeHtml(item.actionRequired)}</span></div>` : ''}
        </div>
        <div class="requirement-row__side">${item.status === 'Passed' || item.status === 'Approved' || item.status === 'Verified' ? '<span class="requirement-verified-indicator" aria-label="Verified by Coordinator" title="Verified by Coordinator">✓</span>' : '<span class="requirement-unverified-indicator" aria-label="Not yet verified" title="Not yet verified">○</span>'}${badge(item.status)}<button class="btn btn--ghost requirement-row__details" type="button" data-view-requirement="${escapeHtml(item.id)}">View Details ${icon('arrow_forward')}</button></div>
      </article>`;
    listSection.innerHTML = `<section class="section-card requirements-list-card"><div class="requirements-list-heading"><div><h2 class="requirements-list-title">Required Pre-Deployment Documents</h2><p class="requirements-list-subtitle">Bring the required physical documents to the OJT Office for submission and checking.</p></div><span class="requirements-checklist-label">BATSTATEU CICS INTERNSHIP CHECKLIST</span></div><div class="requirements-list">${records.length ? records.map(renderRow).join('') : '<p>No requirements are currently available.</p>'}</div></section>`;

    const showList = () => { headingSection.hidden = false; completionSection.hidden = false; listSection.hidden = false; detailSection.hidden = true; window.scrollTo({ top:0, behavior:'smooth' }); };
    const showDetail = (item: RequirementRecord) => {
      headingSection.hidden = true; completionSection.hidden = true; listSection.hidden = true; detailSection.hidden = false;
      detailSection.innerHTML = `<button class="btn btn--ghost requirement-detail-back" type="button" id="back-to-requirements">${icon('arrow_back')} Back to Requirements List</button><section class="section-card requirement-detail-card"><div class="requirement-detail-topline"><span class="requirement-detail-item-label">Item ${item.number} of ${records.length}</span>${badge(item.status)}</div><div class="requirement-detail-heading"><div class="requirement-detail-icon">${icon(item.icon || 'description')}</div><div><h1 class="requirement-detail-title">${escapeHtml(item.title)}</h1><span class="requirement-category">${escapeHtml(item.category || 'General Requirement')}</span></div></div><section class="requirement-detail-block"><h3>Requirement Description</h3><p>${escapeHtml(item.description || 'Refer to the OJT Office for the applicable document details.')}</p></section><section class="requirement-detail-block"><h3>Physical Submission &amp; Verification</h3><p>${escapeHtml(item.submissionNote || 'Physical submission and verification must be completed at the OJT Office.')}</p><p>Requirements must be submitted and checked face-to-face at the OJT Office. Online submission is not available.</p></section><section class="requirement-detail-block"><h3>Coordinator Remarks &amp; Follow-up</h3><p>${escapeHtml(item.actionRequired || 'Please coordinate with the OJT Office if you have questions about this requirement.')}</p></section></section>`;
      window.scrollTo({ top:0, behavior:'smooth' });
    };
    listSection.onclick = event => { const target = event.target; if (!(target instanceof Element)) return; const button = target.closest<HTMLButtonElement>('[data-view-requirement]'); const id = button?.dataset.viewRequirement; const item = records.find(record => record.id === id); if (item) showDetail(item); };
    detailSection.onclick = event => { const target = event.target; if (target instanceof Element && target.closest('#back-to-requirements')) showList(); };
    detailSection.hidden = true;
  } catch (error) {
    console.error('Failed to load OJT requirements:', error);
    const page = document.querySelector<HTMLElement>('.ojt-requirements-page');
    if (page) page.innerHTML = `<section class="section-card"><h2>Unable to Load Requirements</h2><p>${escapeHtml(error instanceof Error ? error.message : 'Please refresh and try again.')}</p></section>`;
  }
}
void loadOjtRequirements();
window.addEventListener('storage', event => { if (['ojtflow_student_requirements','ojtflow_eligibility_remarks','ojtflow_student_eligibility','ojtflow_requirements_updated'].includes(event.key || '')) void loadOjtRequirements(); });
