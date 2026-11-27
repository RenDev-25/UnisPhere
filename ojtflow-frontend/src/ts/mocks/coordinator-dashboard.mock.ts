import type { CoordinatorDashboardMock } from '../types/analytics.types';
// Static presentation labels only. Dashboard values and chart series are populated from records.
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
    { label: 'Eligible Students', value: 0, chip: 'Eligible', accent: 'red' },
    { label: 'Pending Applications', value: 0, chip: 'In Queue', accent: 'amber' },
    { label: 'Available Company Slots', value: 0, chip: 'Open Capacity', accent: 'grey' },
    { label: 'Placement Confirmed', value: 0, chip: 'Confirmed', accent: 'navy' },
    { label: 'Total Companies', value: 0, chip: 'Registered', accent: 'grey' },
  ],
  statusDistribution: [],
  monthlyAnalytics: [],
  slotUtilization: [],
  slotTotals: { occupied: 0, available: 0, total: 0 },
  readinessDistribution: [],
  readinessTotal: 0,
  velocityLabel: 'No trend data yet',
  chartSubtitle: 'Application and placement activity will appear when dated records exist.',
  chartFootnote: 'No projected or sample figures are displayed.',
  deploymentTarget: 'Deployment targets will be shown when configured.',
};
