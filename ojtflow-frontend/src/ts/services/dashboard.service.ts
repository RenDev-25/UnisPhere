import { getCompanyManagement } from './company.service';
import { ENV } from '../core/env';

import { mockStudentDashboard } from '../mocks/student.mock';
import { mockCoordinatorDashboard } from '../mocks/coordinator-dashboard.mock';

import type { StudentDashboardData } from '../types/student.types';
import type { CoordinatorDashboardMock } from '../types/analytics.types';

const delay = (ms = 250): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

async function getMockData<T>(data: T): Promise<T> {
  if (!ENV.useMocks) {
    throw new Error(
      'Dashboard API integration is not available yet.',
    );
  }

  await delay();
  return clone(data);
}

export async function getStudentDashboard(): Promise<StudentDashboardData> {
  return getMockData(mockStudentDashboard);
}

export async function getCoordinatorDashboard(): Promise<CoordinatorDashboardMock> {
  const dashboard = await getMockData(mockCoordinatorDashboard);
  const companies = await getCompanyManagement();
  const companySlots = dashboard.kpis.find(kpi => kpi.label === 'Available Company Slots');
  if (companySlots) companySlots.value = companies.summary.availableSlots;
  const totalCompanies = dashboard.kpis.find(kpi => kpi.label === 'Partner Companies');
  if (totalCompanies) totalCompanies.value = companies.summary.totalCompanies;
  return dashboard;
}