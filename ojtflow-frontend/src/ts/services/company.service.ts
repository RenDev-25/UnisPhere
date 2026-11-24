import { ENV } from '../core/env';

import {
  mockCompanyManagementSummary,
  mockCompanyRecords,
  mockCompanyPrograms,
  mockCompanyStatuses,
  mockCompanyDetails,
  mockAddCompanyForm,
  mockEditCompanyForm,
  mockCompanyProvinces,
  mockCompanyDirectoryHeading,
  mockCompanyDirectoryFilters,
  mockCompanyProgramSection,
  mockCompanies,
} from '../mocks/company.mock';

const delay = (ms = 250): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

async function getMockData<T>(data: T): Promise<T> {
  if (!ENV.useMocks) {
    throw new Error(
      'Company API integration is not available yet.',
    );
  }

  await delay();
  return clone(data);
}

export async function getCompanyDirectory() {
  return getMockData({
    heading: mockCompanyDirectoryHeading,
    filters: mockCompanyDirectoryFilters,
    programSection: mockCompanyProgramSection,
    companies: mockCompanies,
  });
}

export async function getCompanyManagement() {
  return getMockData({
    summary: mockCompanyManagementSummary,
    records: mockCompanyRecords,
    programs: mockCompanyPrograms,
    statuses: mockCompanyStatuses,
  });
}

export async function getCompanyDetails() {
  return getMockData(mockCompanyDetails);
}

export async function getAddCompanyForm() {
  return getMockData({
    form: mockAddCompanyForm,
    provinces: mockCompanyProvinces,
  });
}

export async function getEditCompanyForm() {
  return getMockData({
    form: mockEditCompanyForm,
    provinces: mockCompanyProvinces,
  });
}