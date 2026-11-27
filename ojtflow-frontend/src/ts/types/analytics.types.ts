import type { DonutChartItem } from '../charts/donut-chart';
import type { MonthPoint } from '../charts/grouped-bar-chart';

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
export interface CoordinatorDashboardMock {
  heading: DashboardHeading;
  kpis: DashboardKpi[];
  statusDistribution: DonutChartItem[];
  monthlyAnalytics: MonthPoint[];
  slotUtilization: DonutChartItem[];
  slotTotals: { occupied: number; available: number; total: number };
  readinessDistribution: DonutChartItem[];
  readinessTotal: number;
  velocityLabel: string;
  chartSubtitle: string;
  chartFootnote: string;
  deploymentTarget: string;
}
