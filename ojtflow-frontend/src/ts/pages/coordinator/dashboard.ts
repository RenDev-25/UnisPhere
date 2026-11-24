
import { initAppShell } from '../../core/app-shell';
import { qs } from '../../utils/dom';
import { renderKpiCard } from '../../components/kpi-card';

import {
  createDonutChart,
  type DonutSegment,
} from '../../charts/donut-chart';

import { createGroupedBarChart } from '../../charts/grouped-bar-chart';
import { initCountUp } from '../../components/count-up';

import { getCoordinatorDashboard } from '../../services/dashboard.service';

import type { CoordinatorDashboardMock } from '../../types/analytics.types';

// ==========================================
// 1. INITIALIZE COORDINATOR APP SHELL
// ==========================================

initAppShell();

// ==========================================
// 2. DASHBOARD DATA
// ==========================================

let data: CoordinatorDashboardMock;

let statusChart: ReturnType<typeof createDonutChart> | null = null;

let monthlyChart: ReturnType<typeof createGroupedBarChart> | null = null;

// ==========================================
// 3. RENDER PAGE HEADING AND FILTERS
// ==========================================

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

      <p class="coordinator-dashboard__subtitle">
        ${heading.subtitle}
      </p>
    </div>

    <div class="coordinator-dashboard__filters">
      <div class="dashboard-filter">
        <label for="academic-cycle">Academic Cycle</label>
        <select id="academic-cycle" aria-label="Academic Cycle">
          <option value="${heading.academicCycle}">
            ${heading.academicCycle}
          </option>
        </select>
      </div>

      <div class="dashboard-filter">
        <label for="program-filter">Program</label>
        <select id="program-filter" aria-label="Program">
          ${heading.programs.map((program) => `
            <option value="${program}">${program}</option>
          `).join('')}
        </select>
      </div>

      <button
        class="dashboard-refresh"
        id="dashboard-refresh"
        data-js-refresh
        type="button"
        aria-label="Refresh dashboard"
        title="Refresh dashboard"
      >
        <span class="icon" aria-hidden="true">refresh</span>
      </button>
    </div>
  `;
}

// ==========================================
// 4. RENDER SIX KPI CARDS
// ==========================================

function renderDashboardKpis(): void {
  const kpiContainer = qs('#dashboard-kpis');

  kpiContainer.innerHTML = data.kpis.map((kpi) => {
    return renderKpiCard({
      label: kpi.label,
      value: kpi.value,
      chip: kpi.chip,
      caption: kpi.caption,
      accent: kpi.accent,
    });
  }).join('');
}

// ==========================================
// 5. RENDER STUDENT OJT STATUS DISTRIBUTION
// ==========================================

function drawStatusDistribution(
  segments: DonutSegment[],
): void {
  const totalStudents = segments.reduce(
    (total, segment) => total + segment.value,
    0,
  );

  const center = qs<HTMLElement>('#donut-center');
  const canvas = qs<HTMLCanvasElement>('#status-donut');
  const legend = qs<HTMLElement>('#status-legend');

  // Destroy an existing chart before drawing another one.
  statusChart?.destroy();

  // Display the actual total in the center.
  center.innerHTML = `
    <strong>${totalStudents}</strong>
    <span>CICS Cohort</span>
  `;

  // Create the doughnut chart.
  statusChart = createDonutChart(
    canvas,
    segments,
    (index) => {
      if (index === null) {
        center.innerHTML = `
          <strong>${totalStudents}</strong>
          <span>CICS Cohort</span>
        `;
        return;
      }

      const selected = segments[index];

      if (!selected) return;

      center.innerHTML = `
        <strong style="color: ${selected.color}">
          ${selected.value}
        </strong>
        <span>${selected.label}</span>
      `;
    },
  );

  // Render the legend with dynamically calculated percentages.
  legend.innerHTML = segments.map((segment) => {
    const percentage = totalStudents > 0
      ? ((segment.value / totalStudents) * 100).toFixed(1)
      : '0.0';

    return `
      <li>
        <span
          class="legend__dot"
          style="background: ${segment.color}"
        ></span>

        <span>${segment.label}</span>

        <b>${segment.value}</b>

        <small>(${percentage}%)</small>
      </li>
    `;
  }).join('');
}

// ==========================================
// 6. RENDER APPLICATIONS AND PLACEMENT ANALYTICS
// ==========================================

function drawMonthlyAnalytics(): void {
  const canvas = qs<HTMLCanvasElement>(
    '#monthly-analytics-chart',
  );

  // Destroy the previous chart if the dashboard is refreshed.
  monthlyChart?.destroy();

  monthlyChart = createGroupedBarChart(
    canvas,
    data.monthlyAnalytics,
  );
}

// ==========================================
// 7. RENDER THE COMPLETE DASHBOARD
// ==========================================

function renderCoordinatorDashboard(): void {
  renderDashboardHeading();
  renderDashboardKpis();

  drawStatusDistribution(data.statusDistribution);
  drawMonthlyAnalytics();

  // Refresh button.
  const refreshButton = qs<HTMLButtonElement>(
    '#dashboard-refresh',
  );

  refreshButton.addEventListener('click', () => {
    void refreshDashboard();
  });
}

// ==========================================
// 8. LOAD COORDINATOR DASHBOARD
// ==========================================

async function loadCoordinatorDashboard(): Promise<void> {
  data = await getCoordinatorDashboard();

  renderCoordinatorDashboard();

  // Initialize count-up animation after KPI cards are rendered.
  initCountUp();
}

// ==========================================
// 9. REFRESH DASHBOARD DATA
// ==========================================

async function refreshDashboard(): Promise<void> {
  const refreshButton = qs<HTMLButtonElement>(
    '#dashboard-refresh',
  );

  refreshButton.disabled = true;
  refreshButton.classList.add('is-loading');

  try {
    // Retrieve fresh data through the dashboard service.
    await loadCoordinatorDashboard();
  } catch (error: unknown) {
    console.error('Failed to refresh coordinator dashboard:', error);
  } finally {
    const updatedRefreshButton = qs<HTMLButtonElement>(
      '#dashboard-refresh',
    );

    updatedRefreshButton.disabled = false;
    updatedRefreshButton.classList.remove('is-loading');
  }
}

// ==========================================
// 10. START DASHBOARD
// ==========================================

async function initCoordinatorDashboard(): Promise<void> {
  try {
    await loadCoordinatorDashboard();
  } catch (error: unknown) {
    console.error('Failed to load coordinator dashboard:', error);

    const heading = document.querySelector<HTMLElement>(
      '#page-heading',
    );

    if (heading) {
      heading.innerHTML = `
        <div class="section-card">
          <h1>Unable to Load Dashboard</h1>
          <p>
            Dashboard data could not be loaded.
            Please refresh the page and try again.
          </p>
        </div>
      `;
    }
  }
}

void initCoordinatorDashboard();
