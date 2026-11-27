import { getCoordinatorPublishedCompanies } from './company.service';
import { getCoordinatorStudents, getStudentProfile } from './student.service';
import { getCoordinatorApplications, getStudentApplications } from './application.service';
import { getEligibilityPage } from './eligibility.service';
import { getStudentRequirements, getCoordinatorStudentRequirementRecords } from './requirement.service';
import { getMyDeployment, getStoredDeployments } from './deployment.service';
import { ENV } from '../core/env';
import { mockCoordinatorDashboard } from '../mocks/coordinator-dashboard.mock';
import type { StudentDashboardData } from '../types/student.types';
import type { CoordinatorDashboardMock, DashboardBarItem } from '../types/analytics.types';

interface DashboardApplicationRecord {
  id: string;
  studentId: string;
  companyId: string;
  academicProgram?: string;
  status: string;
  supervisorDecision?: string;
  deploymentStatus?: string;
  dateApplied?: string;
  deploymentRequestedAt?: string;
  supervisorDecisionAt?: string;
  createdAt?: string;
}

interface DashboardDeploymentRecord {
  id: string;
  createdAt?: string;
  studentId: string;
  applicationId?: string;
  companyId?: string;
  program?: string;
  status: string;
  deploymentStartDate?: string;
  deploymentDate?: string;
  undeployedAt?: string;
}

function readStoredArray<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    return [];
  }
}

function safeCount(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function latest<T extends { createdAt?: string; dateApplied?: string; deploymentRequestedAt?: string; supervisorDecisionAt?: string; deploymentStartDate?: string; deploymentDate?: string; undeployedAt?: string }>(items: T[]): T | undefined {
  const eventTime = (item: T): number => {
    const values = [item.createdAt, item.dateApplied, item.deploymentRequestedAt, item.supervisorDecisionAt, item.deploymentStartDate, item.deploymentDate, item.undeployedAt];
    return Math.max(0, ...values.filter((value): value is string => Boolean(value)).map(value => Date.parse(value)).filter(Number.isFinite));
  };
  return [...items].sort((a, b) => eventTime(b) - eventTime(a))[0];
}

export async function getStudentDashboard(): Promise<StudentDashboardData> {
  if (!ENV.useMocks) throw new Error('Dashboard API integration is not available yet.');
  const { getSession } = await import('../core/session');
  const user = getSession()?.user;
  const [student, appData, requirementData, deployment] = await Promise.all([
    getStudentProfile(), getStudentApplications(), getStudentRequirements(), getMyDeployment(),
  ]);
  const studentApps = appData.records;
  const uploaded = requirementData.records.filter(item => item.status === 'Passed').length;
  const eligibilityMap = (() => {
    try { return JSON.parse(localStorage.getItem('ojtflow_student_eligibility') || '{}') as Record<string, { status?: string }>; }
    catch { return {}; }
  })();
  const studentEligibility = user?.id ? eligibilityMap[user.id]?.status || 'For Review' : 'For Review';

  return {
    student,
    eligibility: studentEligibility,
    deploymentStatus: deployment.placement?.status.status || 'Not Yet Requested',
    applications: {
      total: studentApps.length,
      underReview: studentApps.filter(item => item.status === 'Under Review').length,
      accepted: studentApps.filter(item => item.status === 'Accepted').length,
      rejected: studentApps.filter(item => item.status === 'Rejected').length,
      pending: studentApps.filter(item => item.status === 'Pending Decision').length,
      cancelled: studentApps.filter(item => item.status === 'Cancelled').length,
    },
    requirements: {
      total: requirementData.records.length,
      completed: uploaded,
      pendingVerification: requirementData.records.filter(item => item.status === 'Pending').length,
      forRevision: requirementData.records.filter(item => item.status === 'Missing').length,
    },
  };
}

export async function getCoordinatorDashboard(selectedProgram = 'All Programs (CICS)'): Promise<CoordinatorDashboardMock> {
  if (!ENV.useMocks) throw new Error('Dashboard API integration is not available yet.');

  const [students, apps, eligibility, companies] = await Promise.all([
    getCoordinatorStudents(),
    getCoordinatorApplications(),
    getEligibilityPage(),
    getCoordinatorPublishedCompanies(),
  ]);

  const isAll = !selectedProgram || selectedProgram.toLocaleLowerCase() === 'all programs (cics)';
  const selected = selectedProgram.trim().toLocaleLowerCase();
  const matchesProgram = (value: string) => isAll || value.trim().toLocaleLowerCase() === selected;

  const filteredStudents = students.records.filter(record => matchesProgram(record.program));
  const filteredEligibility = eligibility.records.filter(record => matchesProgram(record.program));
  const filteredApps = apps.records.filter(record => matchesProgram(record.academicProgram));
  const filteredCompanies = companies.records.filter(record => (record.acceptedPrograms || [record.program]).some(matchesProgram));
  const rawApplications = readStoredArray<DashboardApplicationRecord>('ojtflow_applications')
    .filter(item => matchesProgram(String(item.academicProgram || '')));
  const deployments = getStoredDeployments()
    .filter(item => isAll || matchesProgram(String(item.program || ''))) as DashboardDeploymentRecord[];

  const eligibleCount = filteredEligibility.filter(item => item.status === 'Eligible').length;
  const pendingApplicationCount = filteredApps.filter(item => item.status === 'Pending' || item.status === 'Under Review').length;
  const activeCompanies = filteredCompanies.filter(item => item.status === 'Active');
  const availableSlots = activeCompanies.reduce((sum, company) => sum + safeCount(company.availableSlots), 0);
  const placementConfirmedCount = new Set(deployments.filter(item => item.status === 'Placement Confirmed').map(item => item.studentId)).size;

  const dashboard = JSON.parse(JSON.stringify(mockCoordinatorDashboard)) as CoordinatorDashboardMock;
  const kpiValues: Record<string, number> = {
    'Total OJT Students': filteredStudents.length,
    'Eligible Students': eligibleCount,
    'Pending Applications': pendingApplicationCount,
    'Available Company Slots': availableSlots,
    'Placement Confirmed': placementConfirmedCount,
    'Total Companies': filteredCompanies.length,
  };
  dashboard.kpis = dashboard.kpis.slice(0, 6).map(kpi => ({ ...kpi, value: safeCount(kpiValues[kpi.label]) }));

  // Chart 1: Application lifecycle and deployment lifecycle are separate
  // categories. Application totals are counted from application records;
  // deployment totals are counted from current request/deployment records.
  const activeApplications = rawApplications.filter(item => item.status !== 'Cancelled');
  const acceptedApplications = activeApplications.filter(item => item.status === 'Accepted' && (!item.supervisorDecision || item.supervisorDecision === 'Accepted'));
  const pendingApplications = activeApplications.filter(item => ['Pending Decision', 'Pending', 'Under Review'].includes(item.status));
  const rejectedApplications = activeApplications.filter(item => item.status === 'Rejected' || item.supervisorDecision === 'Rejected');
  const pendingDeploymentCount = new Set(acceptedApplications.filter(item => item.deploymentStatus === 'Requested').map(item => item.studentId)).size;
  const deployedCount = new Set(deployments.filter(item => item.status === 'Deployed').map(item => item.studentId)).size;

  const overview: DashboardBarItem[] = [
    { label: 'Pending Applications', value: pendingApplications.length, color: '#D99A21' },
    { label: 'Accepted Applications', value: acceptedApplications.length, color: '#2A9D8F' },
    { label: 'Rejected Applications', value: rejectedApplications.length, color: '#D95D5D' },
    { label: 'Pending Deployment Requests', value: pendingDeploymentCount, color: '#5476B8' },
    { label: 'Deployed Students', value: deployedCount, color: '#1E3A8A' },
  ];
  dashboard.applicationDeploymentOverview = overview;

  // Chart 2: classify each student once, using the latest accepted application
  // and deployment record. Active deployment always takes precedence.
  const studentIds = new Set<string>([
    ...acceptedApplications.map(item => item.studentId),
    ...deployments.map(item => item.studentId),
  ]);
  const progressCounts: Record<string, number> = {
    'Not Yet Requested': 0,
    'Pending': 0,
    'Approved': 0,
    'Deployed': 0,
    'Undeployed': 0,
  };

  for (const studentId of studentIds) {
    const studentApps = acceptedApplications.filter(item => item.studentId === studentId);
    const studentDeployments = deployments.filter(item => item.studentId === studentId);
    const accepted = latest(studentApps);
    const activeDeployment = studentDeployments.find(item => item.status === 'Deployed');
    const latestDeployment = latest(studentDeployments);

    let status: keyof typeof progressCounts;
    if (activeDeployment) status = 'Deployed';
    else if (accepted?.deploymentStatus === 'Requested') status = 'Pending';
    else if (latestDeployment?.status === 'Placement Confirmed' || latestDeployment?.status === 'Not Yet Deployed') status = 'Approved';
    else if (latestDeployment?.status === 'Undeployed') status = 'Undeployed';
    else if (accepted) status = 'Not Yet Requested';
    else continue;

    progressCounts[status] += 1;
  }

  const progressColors: Record<string, string> = {
    'Not Yet Requested': '#94A3B8',
    'Pending': '#D99A21',
    'Approved': '#5476B8',
    'Deployed': '#2A9D8F',
    'Undeployed': '#D95D5D',
  };
  dashboard.statusDistribution = Object.entries(progressCounts)
    .map(([label, value]) => ({ label, value, color: progressColors[label] }));

  // Chart 3: the company service maintains occupiedSlots/availableSlots from
  // an application-scoped reservation ledger. Deployment status is not used
  // to infer capacity: undeployment therefore leaves an accepted reservation
  // occupied until the application itself releases it.
  const totalCapacity = activeCompanies.reduce((sum, company) => {
    const occupied = safeCount(company.occupiedSlots);
    const total = safeCount(company.totalSlots) || safeCount(company.availableSlots) + occupied;
    return sum + total;
  }, 0);
  const occupiedSlots = activeCompanies.reduce((sum, company) => sum + safeCount(company.occupiedSlots), 0);
  const availableSlotTotal = activeCompanies.reduce((sum, company) => sum + safeCount(company.availableSlots), 0);
  dashboard.companySlotUtilization = [
    { label: 'Occupied Slots', value: occupiedSlots, color: '#B00D26' },
    { label: 'Available Slots', value: availableSlotTotal, color: '#2A9D8F' },
  ];
  // The total is carried as the sum of both chart segments and displayed in
  // the doughnut center. Keep the KPI and chart sourced from the same records.
  dashboard.companySlotTotalSlots = totalCapacity || (occupiedSlots + availableSlotTotal);

  // Chart 4: classify every registered student exactly once. Eligibility is
  // the coordinator's saved decision; readiness additionally requires every
  // canonical pre-deployment checklist item to be physically verified Passed.
  const readinessCounts: Record<string, number> = {
    'Awaiting Eligibility Review': 0,
    'Not Eligible': 0,
    'Eligibility Incomplete': 0,
    'Eligible — Requirements Pending': 0,
    'Cleared for Pre-Deployment': 0,
  };
  for (const student of filteredStudents) {
    const eligibilityRecord = filteredEligibility.find(item => item.id === student.id);
    const status = eligibilityRecord?.status || 'For Review';
    if (status === 'Not Eligible') {
      readinessCounts['Not Eligible'] += 1;
      continue;
    }
    if (status === 'Incomplete') {
      readinessCounts['Eligibility Incomplete'] += 1;
      continue;
    }
    if (status !== 'Eligible') {
      readinessCounts['Awaiting Eligibility Review'] += 1;
      continue;
    }
    const requirementRecords = getCoordinatorStudentRequirementRecords(student.id);
    const allRequirementsPassed = requirementRecords.length > 0 && requirementRecords.every(item => item.status === 'Passed');
    if (allRequirementsPassed) readinessCounts['Cleared for Pre-Deployment'] += 1;
    else readinessCounts['Eligible — Requirements Pending'] += 1;
  }
  const readinessColors: Record<string, string> = {
    'Awaiting Eligibility Review': '#94A3B8',
    'Not Eligible': '#D95D5D',
    'Eligibility Incomplete': '#D99A21',
    'Eligible — Requirements Pending': '#5476B8',
    'Cleared for Pre-Deployment': '#2A9D8F',
  };
  dashboard.eligibilityReadiness = Object.entries(readinessCounts)
    .map(([label, value]) => ({ label, value, color: readinessColors[label] }));

  dashboard.velocityLabel = 'Live system records';
  dashboard.chartSubtitle = 'Charts reflect current student, application, requirement, deployment, and company records.';
  dashboard.chartFootnote = 'Students are counted once per distribution. Company capacity follows accepted-application slot reservations, not deployment status.';
  dashboard.deploymentTarget = 'Deployment stages are derived from accepted offers and official deployment records.';
  return dashboard;
}
