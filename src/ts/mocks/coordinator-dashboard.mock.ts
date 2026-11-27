import type { CoordinatorDashboardMock } from '../types/analytics.types';

// Static dashboard labels only. KPI and visualization values are populated
// from the shared student, application, deployment, and company records.
export const mockCoordinatorDashboard: CoordinatorDashboardMock = {
  heading: {
    college: 'College of Informatics and Computing Sciences',
    portalLabel: 'OJT Coordinator Portal',
    title: 'Dashboard',
    subtitle: 'Monitor student eligibility, applications, placements, and deployment across CICS.',
    academicCycle: 'A.Y. 2026-2027',
    programs: ['All Programs (CICS)', 'BSIT', 'BSCS'],
  },
  kpis: [
    { label: 'Total OJT Students', value: 0, chip: 'Registered', accent: 'navy' },
    { label: 'Eligible Students', value: 0, chip: 'Eligibility Approved', accent: 'red' },
    { label: 'Pending Applications', value: 0, chip: 'In Queue', accent: 'amber' },
    { label: 'Available Company Slots', value: 0, chip: 'Open Capacity', accent: 'grey' },
    { label: 'Placement Confirmed', value: 0, chip: 'Confirmed', accent: 'navy' },
    { label: 'Total Companies', value: 0, chip: 'Registered Partners', accent: 'red' },
  ],
  applicationDeploymentOverview: [],
  statusDistribution: [],
  companySlotUtilization: [],
  companySlotTotalSlots: 0,
  eligibilityReadiness: [],
  velocityLabel: 'Current record totals',
  chartSubtitle: 'All values are calculated from current system records.',
  chartFootnote: 'Cancelled applications are excluded from active application stages.',
  deploymentTarget: 'Deployment progress is based on current deployment records.',
};
