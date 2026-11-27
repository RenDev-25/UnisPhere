// src/ts/pages/student/dashboard.ts

import { initAppShell } from '../../core/app-shell';

import { qs, escapeHtml } from '../../utils/dom';
import { initCountUp } from '../../components/count-up';
import { formatNumber } from '../../utils/format';

import {
  renderKpiCard,
  renderInfoTile
} from '../../components/kpi-card';


import {
  renderStatusBadge
} from '../../components/status-badge';

import { getStudentDashboard } from '../../services/dashboard.service';
import { createDonutChart } from '../../charts/donut-chart';

let applicationStatusChart: ReturnType<typeof createDonutChart> | null = null;


// =============================================
// 1. INITIALIZE APPLICATION SHELL
// =============================================

initAppShell();

let dashboardLoaded = false;
let dashboardLoading = false;
async function loadStudentDashboard(): Promise<void> {
  if (dashboardLoading) return;
  dashboardLoading = true;
  try {
  const data = await getStudentDashboard();
// =============================================
// 2. GET DASHBOARD DATA
// =============================================

const {
  student,
  eligibility,
  deploymentStatus,
  applications,
  requirements
} = data;


// =============================================
// 4. WELCOME CARD
// =============================================

qs('#welcome').innerHTML = `

  <h1 class="t-display-lg">
    Welcome back, ${escapeHtml(student.firstName)}!
  </h1>

  <p class="dashboard-welcome__subtitle">
    Here's an overview of your OJT journey and current progress.
  </p>

`;


// Student status badges
qs('#welcome-pills').innerHTML = `

  <div class="welcome__status welcome__status--eligibility">

    <span class="welcome__status-label">
      OJT Eligibility:
    </span>

    ${renderStatusBadge(eligibility)}

  </div>


  <div class="welcome__status welcome__status--deployment">

    <span class="welcome__status-label">
      Deployment Status:
    </span>

    ${renderStatusBadge(deploymentStatus)}

  </div>

`;


// Five student information tiles
qs('#student-info').innerHTML = [

  renderInfoTile({
    label: 'Student Name',
    value: student.name
  }),

  renderInfoTile({
    label: 'Student Number',
    value: student.studentNumber
  }),

  renderInfoTile({
    label: 'College',
    value: student.college
  }),

  renderInfoTile({
    label: 'Program',
    value: student.program
  }),

  renderInfoTile({
    label: 'Academic Year',
    value: student.academicYear
  })

].join('');


// =============================================
// 5. FOUR KPI CARDS
// =============================================

qs('#kpis').innerHTML = [

  // OJT Eligibility
  renderKpiCard({
    label: 'OJT Eligibility',
    value: eligibility,
    chip: eligibility === 'Eligible' ? 'Eligible' : eligibility === 'Not Eligible' ? 'Not Eligible' : 'For Review',
    caption: 'Current qualification status',
    iconName: 'school',
    accent: 'red'
  }),

  // Applications
  renderKpiCard({
    label: 'Applications',
    value: applications.total,
    caption: 'Total submitted company applications',
    iconName: 'folder_open',
    accent: 'navy'
  }),

  // Requirements
  renderKpiCard({
    label: 'Requirements',
    value: `${requirements.completed}/${requirements.total}`,
    chip: `${requirements.completed} passed`,
    caption: 'Requirements physically verified by the OJT Office',
    iconName: 'description',
    accent: 'red'
  }),

  // Deployment Status
  renderKpiCard({
    label: 'Deployment Status',
    value: deploymentStatus,
    chip: deploymentStatus === 'Deployed' ? 'Official' : 'Pending',
    caption: 'Current deployment status',
    iconName: 'work',
    accent: 'amber'
  })

].join('');


// =============================================
// 6. APPLICATION STATUS ANALYTICS
// =============================================

// Total application count
qs('#application-total-chip').textContent =
  `Total: ${formatNumber(applications.total)}`;

qs('#chart-total').textContent =
  formatNumber(applications.total);

qs('#application-total-footer').textContent =
  formatNumber(applications.total);


// Application status legend
const applicationLegend = [

  {
    label: 'Under Review',
    value: applications.underReview,
    color: 'review'
  },

  {
    label: 'Accepted',
    value: applications.accepted,
    color: 'accepted'
  },

  {
    label: 'Rejected',
    value: applications.rejected,
    color: 'rejected'
  },

  {
    label: 'Pending',
    value: applications.pending,
    color: 'pending'
  },
  {
    label: 'Cancelled',
    value: applications.cancelled,
    color: 'rejected'
  }

];

qs('#application-legend').innerHTML = applicationLegend
  .map((item) => `

    <div class="dashboard-legend__item">

      <span
        class="dashboard-legend__dot dashboard-legend__dot--${item.color}"
        aria-hidden="true"
      ></span>

      <span class="dashboard-legend__label">
        ${escapeHtml(item.label)}
      </span>

      <strong class="dashboard-legend__value">
        ${formatNumber(item.value)}
      </strong>

    </div>

  `)
  .join('');

// Render the real application-status distribution from the same records
// used by the summary and legend. Rebuild safely on dashboard refresh.
const applicationChartCanvas = qs<HTMLCanvasElement>('#application-status-chart');
applicationStatusChart?.destroy();
applicationStatusChart = createDonutChart(applicationChartCanvas, [
  { label: 'Under Review', value: applications.underReview, color: '#5476B8' },
  { label: 'Accepted', value: applications.accepted, color: '#2A9D8F' },
  { label: 'Rejected', value: applications.rejected, color: '#D95D5D' },
  { label: 'Pending', value: applications.pending, color: '#D99A21' },
  { label: 'Cancelled', value: applications.cancelled, color: '#B42332' },
]);


// =============================================
// 7. OJT REQUIREMENTS COMPLETION
// =============================================

// Four requirement summary tiles
qs('#requirements-summary').innerHTML = [

  renderInfoTile({
    label: 'Total',
    value: requirements.total
  }),

  renderInfoTile({
    label: 'Passed',
    value: requirements.completed
  }),

  renderInfoTile({
    label: 'Pending',
    value: requirements.pendingVerification
  }),

  renderInfoTile({
    label: 'Missing',
    value: requirements.forRevision
  })

].join('');


// Requirement status rows
qs('#requirements-completed').textContent =
  formatNumber(requirements.completed);

qs('#requirements-pending').textContent =
  formatNumber(requirements.pendingVerification);

qs('#requirements-revision').textContent =
  formatNumber(requirements.forRevision);



  // =============================================
// PHASE 9 — COUNT-UP ANIMATIONS
// =============================================

initCountUp(650, !dashboardLoaded);
  dashboardLoaded = true;
  } finally { dashboardLoading = false; }
}

void loadStudentDashboard();
window.addEventListener('focus', () => void loadStudentDashboard());
window.addEventListener('storage', event => {
  if (['ojtflow_applications', 'ojtflow_student_requirements', 'ojtflow_requirements_updated', 'ojtflow_student_eligibility', 'ojtflow_deployments', 'ojtflow_company_records_updated'].includes(event.key || '')) void loadStudentDashboard();
});
