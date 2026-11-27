import { initAppShell } from '../../core/app-shell';
import { qs } from '../../utils/dom';
import { renderKpiCard } from '../../components/kpi-card';
import { createDonutChart, type DonutSegment } from '../../charts/donut-chart';
import { createGroupedBarChart } from '../../charts/grouped-bar-chart';
import { initCountUp } from '../../components/count-up';
import { getCoordinatorDashboard } from '../../services/dashboard.service';
import type { CoordinatorDashboardMock } from '../../types/analytics.types';

initAppShell();
let data: CoordinatorDashboardMock;
let selectedDashboardProgram = 'All Programs (CICS)';
let statusChart: ReturnType<typeof createDonutChart> | null = null;
let monthlyChart: ReturnType<typeof createGroupedBarChart> | null = null;
let slotChart: ReturnType<typeof createDonutChart> | null = null;
let readinessChart: ReturnType<typeof createDonutChart> | null = null;
let dashboardLoaded = false;

function renderDashboardHeading(): void {
  const heading = data.heading;
  qs('#page-heading').innerHTML = `
    <div class="coordinator-dashboard__heading-main">
      <div class="coordinator-dashboard__identity"><span>${heading.college}</span><span class="coordinator-dashboard__identity-divider">|</span><span>${heading.portalLabel}</span></div>
      <h1>${heading.title}</h1><p class="coordinator-dashboard__subtitle">${heading.subtitle}</p>
    </div>
    <div class="coordinator-dashboard__filters">
      <div class="dashboard-filter"><label for="academic-cycle">Academic Cycle</label><select id="academic-cycle" aria-label="Academic Cycle" disabled title="Only the current academic cycle is configured"><option value="${heading.academicCycle}">${heading.academicCycle}</option></select></div>
      <div class="dashboard-filter"><label for="program-filter">Program</label><select id="program-filter" aria-label="Program">${heading.programs.map(program => `<option value="${program}" ${program === selectedDashboardProgram ? 'selected' : ''}>${program}</option>`).join('')}</select></div>
      <button class="dashboard-refresh" id="dashboard-refresh" data-js-refresh type="button" aria-label="Refresh dashboard" title="Refresh dashboard"><span class="icon" aria-hidden="true">refresh</span></button>
    </div>`;
}
function renderDashboardKpis(): void {
  qs('#dashboard-kpis').innerHTML = data.kpis.map(kpi => renderKpiCard({ label: kpi.label, value: kpi.value, chip: kpi.chip, caption: kpi.caption, accent: kpi.accent })).join('');
}
function setEmptyState(canvas: HTMLCanvasElement, message: string): void {
  const parent = canvas.parentElement;
  if (!parent) return;
  let empty = parent.querySelector<HTMLElement>('[data-dashboard-chart-empty]');
  if (!empty) { empty = document.createElement('p'); empty.dataset.dashboardChartEmpty = 'true'; empty.className = 'chart-empty-state'; parent.appendChild(empty); }
  empty.textContent = message;
  canvas.hidden = true;
}
function clearEmptyState(canvas: HTMLCanvasElement): void {
  canvas.hidden = false;
  canvas.parentElement?.querySelector('[data-dashboard-chart-empty]')?.remove();
}
function drawDonut(
  canvasSelector: string, centerSelector: string, legendSelector: string,
  segments: DonutSegment[], centerLabel: string, emptyMessage: string,
  existing: ReturnType<typeof createDonutChart> | null,
): ReturnType<typeof createDonutChart> | null {
  const canvas = qs<HTMLCanvasElement>(canvasSelector);
  const center = qs<HTMLElement>(centerSelector);
  const legend = qs<HTMLElement>(legendSelector);
  existing?.destroy();
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  center.innerHTML = `<strong>${total}</strong><span>${centerLabel}</span>`;
  if (total <= 0 || segments.length === 0) {
    legend.innerHTML = `<li class="legend__empty">${emptyMessage}</li>`;
    setEmptyState(canvas, emptyMessage);
    return null;
  }
  clearEmptyState(canvas);
  const chart = createDonutChart(canvas, segments, index => {
    if (index === null) center.innerHTML = `<strong>${total}</strong><span>${centerLabel}</span>`;
    else { const selected = segments[index]; if (selected) center.innerHTML = `<strong style="color:${selected.color}">${selected.value}</strong><span>${selected.label}</span>`; }
  });
  legend.innerHTML = segments.map(segment => {
    const percentage = ((segment.value / total) * 100).toFixed(1);
    return `<li><span class="legend__dot" style="background:${segment.color}"></span><span>${segment.label}</span><b>${segment.value}</b><small>(${percentage}%)</small></li>`;
  }).join('');
  return chart;
}
function drawStatusDistribution(): void {
  statusChart = drawDonut('#status-donut', '#donut-center', '#status-legend', data.statusDistribution, 'CICS Cohort', 'No student records available yet.', statusChart);
}
function drawMonthlyAnalytics(): void {
  const canvas = qs<HTMLCanvasElement>('#monthly-analytics-chart');
  monthlyChart?.destroy();
  if (!data.monthlyAnalytics.length) { setEmptyState(canvas, 'No dated application or placement records are available in the last six months.'); return; }
  clearEmptyState(canvas);
  monthlyChart = createGroupedBarChart(canvas, data.monthlyAnalytics);
}
function drawSlotUtilization(): void {
  slotChart = drawDonut('#slot-utilization-chart', '#slot-utilization-center', '#slot-utilization-legend', data.slotUtilization, 'Total Slots', 'No active partner-company slot records are available yet.', slotChart);
  const center = qs<HTMLElement>('#slot-utilization-center');
  if (data.slotTotals.total > 0) center.innerHTML = `<strong>${data.slotTotals.total}</strong><span>Total Slots</span>`;
}
function drawReadiness(): void {
  readinessChart = drawDonut('#readiness-chart', '#readiness-center', '#readiness-legend', data.readinessDistribution, 'Students', 'No registered student records are available yet.', readinessChart);
  const center = qs<HTMLElement>('#readiness-center');
  center.innerHTML = `<strong>${data.readinessTotal}</strong><span>Registered Students</span>`;
}
function renderCoordinatorDashboard(): void {
  renderDashboardHeading(); renderDashboardKpis();
  drawStatusDistribution(); drawMonthlyAnalytics(); drawSlotUtilization(); drawReadiness();
  qs<HTMLSelectElement>('#program-filter').addEventListener('change', event => {
    selectedDashboardProgram = (event.currentTarget as HTMLSelectElement).value;
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
let dashboardRefreshing = false;
async function refreshDashboard(): Promise<void> {
  if (dashboardRefreshing) return;
  dashboardRefreshing = true;
  const refreshButton = qs<HTMLButtonElement>('#dashboard-refresh');
  refreshButton.disabled = true; refreshButton.classList.add('is-loading');
  try { await loadCoordinatorDashboard(); }
  catch (error: unknown) { console.error('Failed to refresh coordinator dashboard:', error); }
  finally {
    dashboardRefreshing = false;
    const updatedButton = document.querySelector<HTMLButtonElement>('#dashboard-refresh');
    if (updatedButton) { updatedButton.disabled = false; updatedButton.classList.remove('is-loading'); }
  }
}
async function initCoordinatorDashboard(): Promise<void> {
  try { await loadCoordinatorDashboard(); }
  catch (error: unknown) {
    console.error('Failed to load coordinator dashboard:', error);
    const heading = document.querySelector<HTMLElement>('#page-heading');
    if (heading) heading.innerHTML = `<div class="section-card"><h1>Unable to Load Dashboard</h1><p>Dashboard data could not be loaded. Please refresh the page and try again.</p></div>`;
  }
}
void initCoordinatorDashboard();
window.addEventListener('focus', () => void refreshDashboard());
window.addEventListener('storage', event => {
  if (['ojtflow_student_accounts', 'ojtflow_applications', 'ojtflow_student_requirements', 'ojtflow_requirements_updated', 'ojtflow_student_eligibility', 'ojtflow_deployments', 'ojtflow_company_records', 'ojtflow_company_records_updated'].includes(event.key || '')) void refreshDashboard();
});
