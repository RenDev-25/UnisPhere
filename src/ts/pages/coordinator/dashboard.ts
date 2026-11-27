import { initAppShell } from '../../core/app-shell';
import { qs } from '../../utils/dom';
import { renderKpiCard } from '../../components/kpi-card';
import { createDonutChart, type DonutSegment } from '../../charts/donut-chart';
import { createCategoryBarChart } from '../../charts/category-bar-chart';
import { initCountUp } from '../../components/count-up';
import { getCoordinatorDashboard } from '../../services/dashboard.service';
import { mockCoordinatorDashboard } from '../../mocks/coordinator-dashboard.mock';
import type { CoordinatorDashboardMock, DashboardBarItem } from '../../types/analytics.types';

initAppShell();

let data: CoordinatorDashboardMock;
let selectedDashboardProgram = 'All Programs (CICS)';
let statusChart: ReturnType<typeof createDonutChart> | null = null;
let overviewChart: ReturnType<typeof createCategoryBarChart> | null = null;
let companySlotChart: ReturnType<typeof createDonutChart> | null = null;
let readinessChart: ReturnType<typeof createCategoryBarChart> | null = null;
let dashboardLoaded = false;
let dashboardRefreshing = false;

function renderDashboardHeading(): void {
  const heading = data.heading;
  qs('#page-heading').innerHTML = `
    <div class="coordinator-dashboard__heading-main">
      <div class="coordinator-dashboard__identity">
        <span>${heading.college}</span>
        <span class="coordinator-dashboard__identity-divider">|</span>
        <span>${heading.portalLabel}</span>
      </div>
      <h1>${heading.title}</h1>
      <p class="coordinator-dashboard__subtitle">${heading.subtitle}</p>
    </div>
    <div class="coordinator-dashboard__filters">
      <div class="dashboard-filter">
        <label for="academic-cycle">Academic Cycle</label>
        <select id="academic-cycle" aria-label="Academic Cycle" disabled title="Only the current academic cycle is configured">
          <option value="${heading.academicCycle}">${heading.academicCycle}</option>
        </select>
      </div>
      <div class="dashboard-filter">
        <label for="program-filter">Program</label>
        <select id="program-filter" aria-label="Program">
          ${heading.programs.map(program => `<option value="${program}" ${program === selectedDashboardProgram ? 'selected' : ''}>${program}</option>`).join('')}
        </select>
      </div>
      <button class="dashboard-refresh" id="dashboard-refresh" type="button" aria-label="Refresh dashboard" title="Refresh dashboard">
        <span class="icon" aria-hidden="true">refresh</span>
      </button>
    </div>
  `;
}

function renderDashboardKpis(): void {
  const container = qs<HTMLElement>('#dashboard-kpis');
  // The dashboard contract is exactly six KPI cards.
  container.innerHTML = data.kpis.slice(0, 6).map(kpi => renderKpiCard({
    label: kpi.label,
    value: Number.isFinite(kpi.value) ? kpi.value : 0,
    chip: kpi.chip,
    caption: kpi.caption,
    accent: kpi.accent,
  })).join('');
}

function showChartEmptyState(canvas: HTMLCanvasElement, message: string): void {
  // Keep the real canvas mounted and visible. Empty data changes only the
  // explanatory message; it must never remove or collapse a chart component.
  canvas.hidden = false;
  canvas.style.display = 'block';
  const parent = canvas.parentElement;
  if (!parent) return;
  // Put doughnut empty-state text beside (not on top of) the centered total.
  const target = parent.classList.contains('dashboard-donut__canvas')
    ? parent.parentElement || parent
    : parent;
  let empty = target.querySelector<HTMLElement>(':scope > [data-dashboard-chart-empty]');
  if (!empty) {
    empty = document.createElement('p');
    empty.dataset.dashboardChartEmpty = 'true';
    empty.className = 'chart-empty-state';
    target.appendChild(empty);
  }
  empty.textContent = message;
}

function clearChartEmptyState(canvas: HTMLCanvasElement): void {
  canvas.hidden = false;
  canvas.style.display = 'block';
  const parent = canvas.parentElement;
  if (!parent) return;
  const target = parent.classList.contains('dashboard-donut__canvas')
    ? parent.parentElement || parent
    : parent;
  target.querySelector(':scope > [data-dashboard-chart-empty]')?.remove();
}

function drawCategoryChart(
  canvasId: string,
  items: DashboardBarItem[],
  emptyMessage: string,
  chart: ReturnType<typeof createCategoryBarChart> | null,
): ReturnType<typeof createCategoryBarChart> | null {
  const canvas = qs<HTMLCanvasElement>(`#${canvasId}`);
  // Destroy the previous instance before creating its replacement. This keeps
  // Chart.js from attaching duplicate listeners/canvases during refreshes.
  chart?.destroy();
  const emptyItems: Record<string, DashboardBarItem[]> = {
    'application-deployment-chart': [
      { label: 'Pending Applications', value: 0, color: '#D99A21' },
      { label: 'Accepted Applications', value: 0, color: '#2A9D8F' },
      { label: 'Rejected Applications', value: 0, color: '#D95D5D' },
      { label: 'Pending Deployment Requests', value: 0, color: '#5476B8' },
      { label: 'Deployed Students', value: 0, color: '#1E3A8A' },
    ],
    'eligibility-readiness-chart': [
      { label: 'Awaiting Eligibility Review', value: 0, color: '#94A3B8' },
      { label: 'Not Eligible', value: 0, color: '#D95D5D' },
      { label: 'Eligibility Incomplete', value: 0, color: '#D99A21' },
      { label: 'Eligible — Requirements Pending', value: 0, color: '#5476B8' },
      { label: 'Cleared for Pre-Deployment', value: 0, color: '#2A9D8F' },
    ],
  };
  const sourceItems = items.length ? items : (emptyItems[canvasId] || []);
  const safeItems = sourceItems.map(item => ({
    ...item,
    value: Number.isFinite(item.value) && item.value >= 0 ? item.value : 0,
  }));
  const hasData = safeItems.some(item => item.value > 0);
  if (hasData) clearChartEmptyState(canvas);
  else showChartEmptyState(canvas, emptyMessage);
  return createCategoryBarChart(canvas, safeItems);
}

function drawDonutDistribution(
  canvasId: string,
  centerId: string,
  legendId: string,
  segments: DonutSegment[],
  centerLabel: string,
  emptyMessage: string,
  chart: ReturnType<typeof createDonutChart> | null,
  totalOverride?: number,
): ReturnType<typeof createDonutChart> | null {
  const center = qs<HTMLElement>(`#${centerId}`);
  const canvas = qs<HTMLCanvasElement>(`#${canvasId}`);
  const legend = qs<HTMLElement>(`#${legendId}`);
  chart?.destroy();
  const emptySegments: Record<string, DonutSegment[]> = {
    'status-donut': [
      { label: 'Not Yet Requested', value: 0, color: '#94A3B8' },
      { label: 'Pending', value: 0, color: '#D99A21' },
      { label: 'Approved', value: 0, color: '#5476B8' },
      { label: 'Deployed', value: 0, color: '#2A9D8F' },
      { label: 'Undeployed', value: 0, color: '#D95D5D' },
    ],
    'company-slot-chart': [
      { label: 'Occupied Slots', value: 0, color: '#B00D26' },
      { label: 'Available Slots', value: 0, color: '#2A9D8F' },
    ],
  };
  const sourceSegments = segments.length ? segments : (emptySegments[canvasId] || []);
  const safeSegments = sourceSegments.map(segment => ({
    ...segment,
    value: Number.isFinite(segment.value) && segment.value >= 0 ? segment.value : 0,
  }));
  const total = totalOverride ?? safeSegments.reduce((sum, segment) => sum + segment.value, 0);
  center.innerHTML = `<strong>${total.toLocaleString()}</strong><span>${centerLabel}</span>`;

  const hasData = safeSegments.some(segment => segment.value > 0);
  if (hasData) clearChartEmptyState(canvas);
  else showChartEmptyState(canvas, emptyMessage);

  const nextChart = createDonutChart(canvas, safeSegments, index => {
    if (index === null) {
      center.innerHTML = `<strong>${total.toLocaleString()}</strong><span>${centerLabel}</span>`;
      return;
    }
    const selected = safeSegments[index];
    if (selected) center.innerHTML = `<strong>${selected.value.toLocaleString()}</strong><span>${selected.label}</span>`;
  });

  const segmentTotal = safeSegments.reduce((sum, segment) => sum + segment.value, 0);
  legend.innerHTML = safeSegments.map(segment => {
    const percentage = segmentTotal > 0 ? ((segment.value / segmentTotal) * 100).toFixed(1) : '0.0';
    return `<li><span class="legend__dot" style="background:${segment.color}"></span><span>${segment.label}</span><b>${segment.value.toLocaleString()}</b><small>(${percentage}%)</small></li>`;
  }).join('');
  return nextChart;
}

function renderCoordinatorDashboard(): void {
  renderDashboardHeading();
  renderDashboardKpis();
  statusChart = drawDonutDistribution(
    'status-donut', 'donut-center', 'status-legend', data.statusDistribution,
    'Students', 'No accepted offers or deployment records are available for this program yet.', statusChart,
  );
  overviewChart = drawCategoryChart(
    'application-deployment-chart',
    data.applicationDeploymentOverview,
    'No application or deployment activity is available yet.',
    overviewChart,
  );
  companySlotChart = drawDonutDistribution(
    'company-slot-chart', 'company-slot-center', 'company-slot-legend', data.companySlotUtilization,
    'Total Slots', 'No published active company slot records are available for this program.', companySlotChart,
    data.companySlotTotalSlots,
  );
  readinessChart = drawCategoryChart(
    'eligibility-readiness-chart',
    data.eligibilityReadiness,
    'No registered student eligibility or requirement records are available for this program.',
    readinessChart,
  );

  const programFilter = qs<HTMLSelectElement>('#program-filter');
  programFilter.value = selectedDashboardProgram;
  programFilter.addEventListener('change', () => {
    selectedDashboardProgram = programFilter.value;
    void refreshDashboard();
  });
  qs<HTMLButtonElement>('#dashboard-refresh').addEventListener('click', () => void refreshDashboard());
}

async function loadCoordinatorDashboard(): Promise<void> {
  data = await getCoordinatorDashboard(selectedDashboardProgram);
  renderCoordinatorDashboard();
  initCountUp(650, !dashboardLoaded);
  dashboardLoaded = true;
}

async function refreshDashboard(): Promise<void> {
  if (dashboardRefreshing) return;
  dashboardRefreshing = true;
  const refreshButton = document.querySelector<HTMLButtonElement>('#dashboard-refresh');
  if (refreshButton) {
    refreshButton.disabled = true;
    refreshButton.classList.add('is-loading');
  }
  try {
    await loadCoordinatorDashboard();
  } catch (error: unknown) {
    console.error('Failed to refresh coordinator dashboard:', error);
  } finally {
    dashboardRefreshing = false;
    const updatedButton = document.querySelector<HTMLButtonElement>('#dashboard-refresh');
    if (updatedButton) {
      updatedButton.disabled = false;
      updatedButton.classList.remove('is-loading');
    }
  }
}

async function initCoordinatorDashboard(): Promise<void> {
  try {
    await loadCoordinatorDashboard();
  } catch (error: unknown) {
    console.error('Failed to load coordinator dashboard:', error);
    // Keep the complete dashboard structure visible during storage/API errors.
    // These are zero-value display categories only, never fabricated records.
    data = JSON.parse(JSON.stringify(mockCoordinatorDashboard)) as CoordinatorDashboardMock;
    data.applicationDeploymentOverview = [
      { label: 'Pending Applications', value: 0, color: '#D99A21' },
      { label: 'Accepted Applications', value: 0, color: '#2A9D8F' },
      { label: 'Rejected Applications', value: 0, color: '#D95D5D' },
      { label: 'Pending Deployment Requests', value: 0, color: '#5476B8' },
      { label: 'Deployed Students', value: 0, color: '#1E3A8A' },
    ];
    data.statusDistribution = [
      { label: 'Not Yet Requested', value: 0, color: '#94A3B8' },
      { label: 'Pending', value: 0, color: '#D99A21' },
      { label: 'Approved', value: 0, color: '#5476B8' },
      { label: 'Deployed', value: 0, color: '#2A9D8F' },
      { label: 'Undeployed', value: 0, color: '#D95D5D' },
    ];
    data.companySlotUtilization = [
      { label: 'Occupied Slots', value: 0, color: '#B00D26' },
      { label: 'Available Slots', value: 0, color: '#2A9D8F' },
    ];
    data.eligibilityReadiness = [
      { label: 'Awaiting Eligibility Review', value: 0, color: '#94A3B8' },
      { label: 'Not Eligible', value: 0, color: '#D95D5D' },
      { label: 'Eligibility Incomplete', value: 0, color: '#D99A21' },
      { label: 'Eligible — Requirements Pending', value: 0, color: '#5476B8' },
      { label: 'Cleared for Pre-Deployment', value: 0, color: '#2A9D8F' },
    ];
    data.companySlotTotalSlots = 0;
    renderCoordinatorDashboard();
    dashboardLoaded = true;
  }
}

void initCoordinatorDashboard();
window.addEventListener('focus', () => void refreshDashboard());
window.addEventListener('storage', event => {
  if ([
    'ojtflow_student_accounts',
    'ojtflow_applications',
    'ojtflow_student_requirements',
    'ojtflow_requirements_updated',
    'ojtflow_student_eligibility',
    'ojtflow_deployments',
    'ojtflow_company_records',
    'ojtflow_company_records_updated',
  ].includes(event.key || '')) void refreshDashboard();
});
// Keep the dashboard current even when a portal writes to IndexedDB in another tab.
window.setInterval(() => void refreshDashboard(), 15000);
