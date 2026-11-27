import { initAppShell } from '../../core/app-shell';
import { getSupervisorDeployedInterns } from '../../services/application.service';

type DeployedIntern = {
  studentName?: string;
  studentNumber?: string;
  program?: string;
  deploymentStartDate?: string;
  deploymentEndDate?: string;
  accumulatedOjtHours?: number | string | null;
  status?: string;
};

initAppShell();

const root = document.querySelector<HTMLElement>('#sup-interns-list');
const totalElement = document.querySelector<HTMLElement>('#sup-interns-total');
const countElement = document.querySelector<HTMLElement>('#sup-interns-count');
const searchInput = document.querySelector<HTMLInputElement>('#sup-interns-search');

let deployedInterns: DeployedIntern[] = [];
let searchTerm = '';

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, character => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[character];
  });
}

function formatDate(value: unknown): string {
  if (!value) return '—';
  const raw = String(value);
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) return escapeHtml(raw);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

function getFilteredInterns(): DeployedIntern[] {
  const query = searchTerm.trim().toLowerCase();
  if (!query) return deployedInterns;

  return deployedInterns.filter(intern => [
    intern.studentName,
    intern.studentNumber,
    intern.program
  ].some(value => String(value ?? '').toLowerCase().includes(query)));
}

function renderRows(): void {
  if (!root) return;

  const rows = getFilteredInterns();

  if (countElement) {
    countElement.textContent = searchTerm
      ? `${rows.length} of ${deployedInterns.length} interns`
      : `${deployedInterns.length} ${deployedInterns.length === 1 ? 'Intern' : 'Interns'}`;
  }

  if (!rows.length) {
    const isSearching = Boolean(searchTerm.trim());
    root.innerHTML = `
      <div class="sup-interns-empty">
        <div class="sup-interns-empty__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <strong>${isSearching ? 'No matching students found' : 'No deployed interns yet'}</strong>
        <p>${isSearching
          ? 'Try another student name, student number, or academic program.'
          : 'Students officially deployed by the OJT Coordinator to your company will appear here.'}</p>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="sup-interns-table-wrap" role="region" aria-label="Deployed student records" tabindex="0">
      <table class="sup-interns-table">
        <colgroup>
          <col style="width: 15%">
          <col style="width: 11%">
          <col style="width: 17%">
          <col style="width: 11%">
          <col style="width: 11%">
          <col style="width: 12%">
          <col style="width: 13%">
          <col style="width: 10%">
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Student Name</th>
            <th scope="col">Student ID</th>
            <th scope="col">Academic Program</th>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            <th scope="col">Required OJT Hours</th>
            <th scope="col">Accumulated Hours</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(intern => `
            <tr>
              <td class="sup-interns-student">${escapeHtml(intern.studentName || '—')}</td>
              <td class="sup-interns-id">${escapeHtml(intern.studentNumber || '—')}</td>
              <td>${escapeHtml(intern.program || '—')}</td>
              <td class="sup-interns-date">${formatDate(intern.deploymentStartDate)}</td>
              <td class="sup-interns-date">${formatDate(intern.deploymentEndDate)}</td>
              <td class="sup-interns-hours">500 HOURS</td>
              <td class="sup-interns-hours">${escapeHtml(intern.accumulatedOjtHours ?? 0)} HOURS</td>
              <td class="sup-interns-status-cell"><span class="sup-pill sup-pill--success">${escapeHtml(intern.status || 'Deployed')}</span></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="sup-interns-footer">
      <span>Showing ${rows.length} ${rows.length === 1 ? 'deployed student' : 'deployed students'}</span>
      <span>Required OJT duration: 500 hours</span>
    </div>`;
}

async function render(): Promise<void> {
  if (!root) return;

  try {
    const result = await getSupervisorDeployedInterns();
    deployedInterns = result as DeployedIntern[];

    if (totalElement) totalElement.textContent = String(deployedInterns.length);
    renderRows();
  } catch (error) {
    if (root) {
      root.innerHTML = `
        <div class="sup-interns-message sup-interns-message--error">
          ${escapeHtml(error instanceof Error ? error.message : 'Unable to load deployed interns.')}
        </div>`;
    }
    if (countElement) countElement.textContent = 'Unavailable';
    if (totalElement) totalElement.textContent = '—';
  }
}

searchInput?.addEventListener('input', () => {
  searchTerm = searchInput.value;
  renderRows();
});

void render();

window.addEventListener('storage', event => {
  if (event.key === 'ojtflow_deployments') void render();
});

window.addEventListener('focus', () => void render());
window.setInterval(() => void render(), 5000);
