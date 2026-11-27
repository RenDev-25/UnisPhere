
import { getCoordinatorCompanyStats, getCoordinatorCompanySlotStats } from './company.service';
import { getCoordinatorStudents, getStudentProfile } from './student.service';
import { getCoordinatorApplications, getStudentApplications } from './application.service';
import { getEligibilityPage } from './eligibility.service';
import { getStudentRequirements, getCoordinatorStudentRequirementRecords } from './requirement.service';
import { getMyDeployment, getStoredDeployments } from './deployment.service';
import { ENV } from '../core/env';
import { mockCoordinatorDashboard } from '../mocks/coordinator-dashboard.mock';
import type { StudentDashboardData } from '../types/student.types';
import type { CoordinatorDashboardMock } from '../types/analytics.types';
import type { DonutChartItem } from '../charts/donut-chart';

function readArray<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    return [];
  }
}

function readRecord<T>(key: string): Record<string, T> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value)
      ? value as Record<string, T>
      : {};
  } catch {
    return {};
  }
}

function monthKey(dateValue: unknown): string | null {
  if (typeof dateValue !== 'string' || !dateValue.trim()) return null;

  const date = new Date(dateValue);

  if (!Number.isFinite(date.getTime())) return null;

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });
}

export async function getStudentDashboard(): Promise<StudentDashboardData> {
  if (!ENV.useMocks) {
    throw new Error('Dashboard API integration is not available yet.');
  }

  const { getSession } = await import('../core/session');
  const user = getSession()?.user;

  const [student, appData, requirementData, deployment] = await Promise.all([
    getStudentProfile(),
    getStudentApplications(),
    getStudentRequirements(),
    getMyDeployment(),
  ]);

  const studentApps = appData.records;
  const uploaded = requirementData.records.filter(x => x.status === 'Passed').length;

  const eligibilityMap = readRecord<{ status?: string }>('ojtflow_student_eligibility');
  const studentEligibility = user?.id
    ? eligibilityMap[user.id]?.status || 'For Review'
    : 'For Review';

  const deployed = Boolean(
    deployment.placement &&
    deployment.placement.status.status === 'Deployed'
  );

  return {
    student,
    eligibility: studentEligibility,
    deploymentStatus: deployed ? 'Deployed' : 'Not Yet Deployed',

    applications: {
      total: studentApps.length,
      underReview: studentApps.filter(x => x.status === 'Under Review').length,
      accepted: studentApps.filter(x => x.status === 'Accepted').length,
      rejected: studentApps.filter(x => x.status === 'Rejected').length,
      pending: studentApps.filter(x => x.status === 'Pending Decision').length,
      cancelled: studentApps.filter(x => x.status === 'Cancelled').length,
    },

    requirements: {
      total: requirementData.records.length,
      completed: uploaded,
      pendingVerification: requirementData.records.filter(x => x.status === 'Pending').length,
      forRevision: requirementData.records.filter(x => x.status === 'Missing').length,
    },
  };
}

export async function getCoordinatorDashboard(
  selectedProgram = 'All Programs (CICS)'
): Promise<CoordinatorDashboardMock> {
  if (!ENV.useMocks) {
    throw new Error('Dashboard API integration is not available yet.');
  }

  // Retrieve the records and statistics needed by the dashboard.
  const [students, apps, eligibility, companyStats, slotStats] =
    await Promise.all([
      getCoordinatorStudents(),
      getCoordinatorApplications(),
      getEligibilityPage(),
      getCoordinatorCompanyStats(selectedProgram),
      getCoordinatorCompanySlotStats(selectedProgram),
    ]);

  // Program filtering.
  const isAll =
    !selectedProgram ||
    selectedProgram.toLocaleLowerCase() === 'all programs (cics)';

  const selected = selectedProgram.trim().toLocaleLowerCase();

  const matchesProgram = (value: string) =>
    isAll || value.trim().toLocaleLowerCase() === selected;

  const filteredStudents = students.records.filter(
    record => matchesProgram(record.program)
  );

  const filteredEligibility = eligibility.records.filter(
    record => matchesProgram(record.program)
  );

  const filteredApps = apps.records.filter(
    record => matchesProgram(record.academicProgram)
  );

  const deployments = getStoredDeployments().filter(
    item => isAll || matchesProgram(String(item.program || ''))
  );

  // Student eligibility distribution.
  const eligibleCount = filteredEligibility.filter(
    item => item.status === 'Eligible'
  ).length;

  const reviewCount = filteredEligibility.filter(
    item => item.status === 'For Review'
  ).length;

  const incompleteCount = filteredEligibility.filter(
    item => item.status === 'Incomplete'
  ).length;

  const statusDistribution: DonutChartItem[] = [
    { label: 'Eligible', value: eligibleCount, color: '#2A9D8F' },
    { label: 'For Review', value: reviewCount, color: '#E5A000' },
    { label: 'Incomplete', value: incompleteCount, color: '#D95D5D' },
    {
      label: 'Other Students',
      value: Math.max(0, filteredStudents.length - filteredEligibility.length),
      color: '#8B95A5',
    },
  ].filter(item => item.value > 0);

  // Mutually exclusive eligibility and pre-deployment readiness stages.
  const readinessCounts = {
    review: 0,
    notEligible: 0,
    incomplete: 0,
    eligiblePending: 0,
    cleared: 0,
  };

  for (const student of filteredStudents) {
    const eligibilityRecord = filteredEligibility.find(
      item => item.id === student.id
    );

    const state = String(eligibilityRecord?.status || 'For Review');

    if (state === 'For Review') {
      readinessCounts.review++;
      continue;
    }

    if (state === 'Not Eligible') {
      readinessCounts.notEligible++;
      continue;
    }

    if (state === 'Incomplete') {
      readinessCounts.incomplete++;
      continue;
    }

    if (state === 'Eligible') {
      const requirements = getCoordinatorStudentRequirementRecords(student.id);

      if (
        requirements.length > 0 &&
        requirements.every(item => item.status === 'Passed')
      ) {
        readinessCounts.cleared++;
      } else {
        readinessCounts.eligiblePending++;
      }

      continue;
    }

    readinessCounts.review++;
  }

  const readinessDistribution: DonutChartItem[] = [
    {
      label: 'Awaiting Eligibility Review',
      value: readinessCounts.review,
      color: '#8B95A5',
    },
    {
      label: 'Not Eligible',
      value: readinessCounts.notEligible,
      color: '#D95D5D',
    },
    {
      label: 'Eligibility Incomplete',
      value: readinessCounts.incomplete,
      color: '#E5A000',
    },
    {
      label: 'Eligible – Requirements Pending',
      value: readinessCounts.eligiblePending,
      color: '#3976B9',
    },
    {
      label: 'Cleared for Pre-Deployment',
      value: readinessCounts.cleared,
      color: '#2A9D8F',
    },
  ].filter(item => item.value > 0);

  // Applications and placement analytics: last six calendar months.
  const now = new Date();

  const monthBuckets = new Map<
    string,
    { month: string; applications: number; placements: number }
  >();

  for (let offset = 5; offset >= 0; offset--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - offset,
      1
    );

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`;

    monthBuckets.set(key, {
      month: monthLabel(date.getFullYear(), date.getMonth()),
      applications: 0,
      placements: 0,
    });
  }

  const rawApplications = readArray<Record<string, unknown>>(
    'ojtflow_applications'
  );

  for (const application of rawApplications) {
    if (!matchesProgram(String(application.academicProgram || ''))) {
      continue;
    }

    const key = monthKey(application.dateApplied);
    const bucket = key ? monthBuckets.get(key) : undefined;

    if (bucket) {
      bucket.applications++;
    }
  }

  const seenPlacementIds = new Set<string>();

  for (const deployment of deployments) {
    if (
      deployment.status !== 'Deployed' &&
      deployment.status !== 'Placement Confirmed'
    ) {
      continue;
    }

    const key = monthKey(
      deployment.deploymentStartDate || deployment.deploymentDate
    );

    const bucket = key ? monthBuckets.get(key) : undefined;

    const uniqueId = String(
      deployment.applicationId ||
      deployment.studentId ||
      deployment.id
    );

    if (bucket && !seenPlacementIds.has(uniqueId)) {
      bucket.placements++;
      seenPlacementIds.add(uniqueId);
    }
  }

  const monthlyAnalytics = [...monthBuckets.values()];

  // KPI calculations.
  const pendingApplications = filteredApps.filter(
    item =>
      item.status === 'Pending' ||
      item.status === 'Under Review'
  ).length;

  const placementConfirmed = new Set(
    deployments
      .filter(
        item =>
          item.status === 'Placement Confirmed' ||
          item.status === 'Deployed'
      )
      .map(item => item.studentId)
  ).size;

  // Populate dashboard data.
  const dashboard = JSON.parse(
    JSON.stringify(mockCoordinatorDashboard)
  ) as CoordinatorDashboardMock;

  const values: Record<string, number> = {
    'Total OJT Students': filteredStudents.length,
    'Eligible Students': eligibleCount,
    'Pending Applications': pendingApplications,
    'Available Company Slots': slotStats.available,
    'Placement Confirmed': placementConfirmed,
    'Total Companies': companyStats.totalCompanies,
  };

  dashboard.kpis = dashboard.kpis.map(kpi => ({
    ...kpi,
    value: values[kpi.label] ?? 0,
  }));

  dashboard.statusDistribution = statusDistribution;

  dashboard.monthlyAnalytics = monthlyAnalytics.some(
    point => point.applications > 0 || point.placements > 0
  )
    ? monthlyAnalytics
    : [];

  // Company slot utilization.
  dashboard.slotTotals = {
    occupied: slotStats.occupied,
    available: slotStats.available,
    total: slotStats.total,
  };

  dashboard.slotUtilization = [
    {
      label: 'Occupied Slots',
      value: slotStats.occupied,
      color: '#B00D26',
    },
    {
      label: 'Available Slots',
      value: slotStats.available,
      color: '#2A9D8F',
    },
  ].filter(item => item.value > 0);

  // Student eligibility and pre-deployment readiness.
  dashboard.readinessDistribution = readinessDistribution;
  dashboard.readinessTotal = filteredStudents.length;

  dashboard.velocityLabel = dashboard.monthlyAnalytics.length
    ? 'Last 6 months'
    : 'Trend unavailable';

  dashboard.chartSubtitle =
    'Monthly totals from dated application and official placement records.';

  dashboard.chartFootnote =
    'Only recorded applications and confirmed deployment records are included.';

  return dashboard;
}
