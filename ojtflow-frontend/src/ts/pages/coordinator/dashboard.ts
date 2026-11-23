
// src/ts/pages/coordinator/dashboard.ts

import { initAppShell } from '../../core/app-shell';
import { qs } from '../../utils/dom';
import { renderKpiCard } from '../../components/kpi-card';

import {
  createDonutChart,
  type DonutSegment,
} from '../../charts/donut-chart';

import { createGroupedBarChart } from '../../charts/grouped-bar-chart';

import {
  mockCoordinatorDashboard as data,
} from '../../mocks/coordinator-dashboard.mock';

// ==========================================
// 1. INITIALIZE COORDINATOR APP SHELL
// ==========================================

initAppShell();

// ==========================================
// 2. RENDER PAGE HEADING AND FILTERS
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
// 3. RENDER SIX KPI CARDS
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
// 4. RENDER STUDENT OJT STATUS DISTRIBUTION
// ==========================================

let statusChart: ReturnType<typeof createDonutChart> | null = null;

function drawStatusDistribution(
  segments: DonutSegment[],
): void {
  const totalStudents = 248;

  const center = qs<HTMLElement>('#donut-center');
  const canvas = qs<HTMLCanvasElement>('#status-donut');
  const legend = qs<HTMLElement>('#status-legend');

  // Destroy an existing chart before drawing another one.
  statusChart?.destroy();

  // Default center label.
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

  // Create the two-column legend.
  // Percentages use the specified 248-student cohort.
  legend.innerHTML = segments.map((segment) => {
    const percentage = (
      (segment.value / totalStudents) * 100
    ).toFixed(1);

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
// 5. RENDER APPLICATIONS AND PLACEMENT ANALYTICS
// ==========================================

let monthlyChart: ReturnType<typeof createGroupedBarChart> | null = null;

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
// 6. RENDER THE COMPLETE DASHBOARD
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
    refreshButton.classList.remove('is-refreshing');

    // Restart the refresh animation.
    void refreshButton.offsetWidth;

    refreshButton.classList.add('is-refreshing');

    // Re-render the mock dashboard charts.
    drawStatusDistribution(data.statusDistribution);
    drawMonthlyAnalytics();
  });
}

// ==========================================
// 7. START DASHBOARD
// ==========================================

renderCoordinatorDashboard();
