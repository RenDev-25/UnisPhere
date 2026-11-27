import type { DonutChartItem } from '../charts/donut-chart';

export interface DashboardKpi {
  label: string;
  value: number;
  chip?: string;
  caption?: string;
  accent: 'red' | 'navy' | 'amber' | 'grey';
}

export interface DashboardHeading {
  college: string;
  portalLabel: string;
  title: string;
  subtitle: string;
  academicCycle: string;
  programs: string[];
}

export interface DashboardBarItem {
  label: string;
  value: number;
  color: string;
}

export interface CoordinatorDashboardMock {
  heading: DashboardHeading;
  kpis: DashboardKpi[];
  /** Application lifecycle and deployment lifecycle are separate chart categories. */
  applicationDeploymentOverview: DashboardBarItem[];
  /** One current deployment stage per student with an accepted offer or deployment history. */
  statusDistribution: DonutChartItem[];
  /** Occupied and available capacity from the company application slot ledger. */
  companySlotUtilization: DonutChartItem[];
  companySlotTotalSlots: number;
  /** Mutually exclusive eligibility and requirement-readiness groups. */
  eligibilityReadiness: DashboardBarItem[];
  velocityLabel: string;
  chartSubtitle: string;
  chartFootnote: string;
  deploymentTarget: string;
}
