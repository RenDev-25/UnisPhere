import { initAppShell } from '../../core/app-shell';
import { getSupervisorApplications, getSupervisorDeployedInterns } from '../../services/application.service';
import { getSupervisorCompany } from '../../services/company.service';
import { escapeHtml } from '../../utils/dom';

initAppShell();

let rendering = false;

const dashboardIcons: Record<string, string> = {
  applications: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.75h7l4 4v12.5H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z"/><path d="M14 3.75v4h4M8.5 12h7M8.5 15.5h7"/></svg>',
  students: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17 14a4.5 4.5 0 0 1 3.5 4.4"/></svg>',
  deployed: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="6" width="17" height="14" rx="2"/><path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6M3.5 11h17M10 11v2h4v-2"/></svg>',
  slots: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M17 8v6M14 11h6"/></svg>',
};

function statusClass(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes('accept') || normalized.includes('deploy')) return 'sup-pill--success';
  if (normalized.includes('reject') || normalized.includes('cancel')) return 'sup-pill--rejected';
  return '';
}

async function render(): Promise<void> {
  if (rendering) return;
  rendering = true;

  try {
    const [company, apps, interns] = await Promise.all([
      getSupervisorCompany(),
      getSupervisorApplications(),
      getSupervisorDeployedInterns(),
    ]);

    const accepted = apps.filter(application => application.status === 'Accepted').length;
    const available = Math.max(0, Number(company?.availableSlots ?? 0));
    const totalSlots = Math.max(0, Number(company?.totalSlots ?? company?.availableSlots ?? 0));
    const occupied = Math.max(0, Number(company?.occupiedSlots ?? 0));

    const kpis = document.querySelector<HTMLElement>('#sup-kpis');
    if (kpis) {
      const metrics = [
        { label: 'Total Applications', value: apps.length, icon: 'applications', tone: 'red' },
        { label: 'Accepted Students', value: accepted, icon: 'students', tone: 'blue' },
        { label: 'Currently Deployed', value: interns.length, icon: 'deployed', tone: 'teal' },
        { label: 'Available Slots', value: available, icon: 'slots', tone: 'amber' },
      ];

      kpis.innerHTML = metrics.map(metric => `
        <article class="card sup-kpi">
          <span class="sup-kpi__icon sup-kpi__icon--${metric.tone}">${dashboardIcons[metric.icon]}</span>
          <span class="sup-kpi__label">${metric.label}</span>
          <strong class="sup-kpi__value">${metric.value}</strong>
        </article>
      `).join('');
    }

    const companyStatus = document.querySelector<HTMLElement>('#sup-company-status');
    if (companyStatus) {
      companyStatus.innerHTML = company ? `
        <div class="sup-company-summary__top">
          <div class="sup-company-summary__identity">
            <span class="sup-company-summary__eyebrow">COMPANY PROFILE</span>
            <h3>${escapeHtml(company.name)}</h3>
          </div>
          <span class="sup-publication-badge ${company.published ? 'is-published' : 'is-unpublished'}">
            <span aria-hidden="true"></span>${company.published ? 'Published' : 'Unpublished'}
          </span>
        </div>
        <p class="sup-company-summary__description">${company.published ? 'Your company profile is published and visible to eligible students.' : 'Your company profile is not currently visible to students.'}</p>
        <div class="sup-company-metrics" aria-label="Company slot summary">
          <div class="sup-company-metric"><span>Total capacity</span><strong>${totalSlots}</strong></div>
          <div class="sup-company-metric"><span>Occupied slots</span><strong>${occupied}</strong></div>
          <div class="sup-company-metric"><span>Available slots</span><strong>${available}</strong></div>
        </div>
      ` : `
        <div class="sup-empty sup-company-empty">
          <span class="sup-empty__icon" aria-hidden="true">＋</span>
          <strong>No company profile yet</strong>
          <p>Create your company profile to publish opportunities and receive student applications.</p>
        </div>
      `;
    }

    const recent = document.querySelector<HTMLElement>('#sup-recent-applications');
    if (recent) {
      const recentApplications = apps.slice(0, 5);
      recent.innerHTML = recentApplications.length ? `
        <div class="sup-recent-list">
          ${recentApplications.map(application => `
            <article class="sup-recent-item">
              <span class="sup-recent-avatar" aria-hidden="true">${escapeHtml(application.studentName.trim().slice(0, 1).toUpperCase() || 'S')}</span>
              <div class="sup-recent-item__details">
                <strong>${escapeHtml(application.studentName)}</strong>
                <span>${escapeHtml(application.companyName)}</span>
                <small>${escapeHtml(application.dateApplied || 'Application date unavailable')}</small>
              </div>
              <span class="sup-pill ${statusClass(application.status)}">${escapeHtml(application.status)}</span>
            </article>
          `).join('')}
        </div>
      ` : `
        <div class="sup-empty">
          <span class="sup-empty__icon" aria-hidden="true">▤</span>
          <strong>No applications yet</strong>
          <p>Student applications submitted to your published company will appear here.</p>
        </div>
      `;
    }
  } finally {
    rendering = false;
  }
}

void render().catch(error => {
  const companyStatus = document.querySelector<HTMLElement>('#sup-company-status');
  if (companyStatus) {
    companyStatus.innerHTML = `<p class="sup-dashboard-error">${escapeHtml(error instanceof Error ? error.message : 'Unable to load dashboard.')}</p>`;
  }
});

window.addEventListener('focus', () => void render());
window.addEventListener('storage', event => {
  if (['ojtflow_applications', 'ojtflow_deployments', 'ojtflow_company_records', 'ojtflow_company_records_updated'].includes(event.key || '')) {
    void render();
  }
});
