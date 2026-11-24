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
  renderProgressBar,
  percentOf
} from '../../components/progress-bar';

import {
  renderStatusBadge
} from '../../components/status-badge';

import {
  mockStudentDashboard as data
} from '../../mocks/student.mock';


// =============================================
// 1. INITIALIZE APPLICATION SHELL
// =============================================

initAppShell();


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
// 3. CALCULATE REQUIREMENTS PROGRESS
// =============================================

const percent = percentOf(
  requirements.completed,
  requirements.total
);

const incompleteRequirements =
  requirements.total - requirements.completed;


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
    chip: 'Qualified',
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
    chip: `${percent}%`,
    caption: 'Completed requirements',
    iconName: 'description',
    accent: 'red'
  }),

  // Deployment Status
  renderKpiCard({
    label: 'Deployment Status',
    value: 'Not Yet',
    chip: 'Pending',
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
    label: 'Pending Decision',
    value: applications.pending,
    color: 'pending'
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


// =============================================
// 7. OJT REQUIREMENTS COMPLETION
// =============================================

// Percentage heading
qs('#requirements-percentage').textContent =
  `${percent}%`;


// Progress bar
qs('#requirements-progress').innerHTML =
  renderProgressBar(
    requirements.completed,
    requirements.total
  );


// Four requirement summary tiles
qs('#requirements-summary').innerHTML = [

  renderInfoTile({
    label: 'Total',
    value: requirements.total
  }),

  renderInfoTile({
    label: 'Completed',
    value: requirements.completed
  }),

  renderInfoTile({
    label: 'Incomplete',
    value: incompleteRequirements
  }),

  renderInfoTile({
    label: 'Rate',
    value: `${percent}%`
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

initCountUp();