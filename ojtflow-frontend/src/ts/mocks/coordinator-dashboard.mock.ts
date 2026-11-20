
// src/ts/mocks/coordinator-dashboard.mock.ts

import type { CoordinatorDashboardMock } from '../types/analytics.types';

// TEMP MOCK
export const mockCoordinatorDashboard: CoordinatorDashboardMock = {
  heading: {
    college: 'College of Informatics and Computing Sciences',
    portalLabel: 'Academic Affairs Portal',
    title: 'Dashboard',
    subtitle:
      'Monitor student eligibility, applications, placements, and deployment across CICS.',
    academicCycle: 'A.Y. 2026-2027',
    programs: [
      'All Programs (CICS)',
      'BS Information Technology',
      'BS Computer Science',
    ],
  },

  kpis: [
    {
      label: 'Total OJT Students',
      value: 248,
      chip: '100% Cohort',
      accent: 'navy',
    },
    {
      label: 'Eligible Students',
      value: 186,
      chip: 'Cleared',
      caption: '75% of cohort cleared for placement',
      accent: 'red',
    },
    {
      label: 'Pending Applications',
      value: 32,
      chip: 'In Queue',
      accent: 'amber',
    },
    {
      label: 'Available Company Slots',
      value: 74,
      chip: 'Open Cap',
      accent: 'grey',
    },
    {
      label: 'Placement Confirmed',
      value: 68,
      chip: 'MoA Signed',
      accent: 'navy',
    },
    {
      label: 'Students Deployed',
      value: 98,
      chip: '39.5% Active',
      accent: 'red',
    },
  ],

  statusDistribution: [
    { label: 'Deployed', value: 98, color: '#860018' },
    { label: 'Placed', value: 68, color: '#1E3A8A' },
    { label: 'Awaiting Assignment', value: 32, color: '#E5A000' },
    { label: 'Applying', value: 22, color: '#2A9D8F' },
    { label: 'Review Queue', value: 32, color: '#8B95A5' },
    { label: 'Not Eligible', value: 18, color: '#D9DEE7' },
  ],

  monthlyAnalytics: [
    { month: 'Jul', applications: 20, placements: 10 },
    { month: 'Aug', applications: 45, placements: 25 },
    { month: 'Sep', applications: 85, placements: 55 },
    { month: 'Oct', applications: 120, placements: 68 },
    { month: 'Nov', applications: 90, placements: 80, projected: true },
    { month: 'Dec', applications: 40, placements: 98, projected: true },
  ],

  velocityLabel: '+18% MoM Velocity',

  chartSubtitle:
    'Monthly trend comparison (July - December 2026)',

  chartFootnote:
    'November & December denote anticipated contract executions based on active interviews.',

  deploymentTarget:
    'CICS Target: 100% Deployed by Dec 18',
};
