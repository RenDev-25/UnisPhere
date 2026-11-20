// src/ts/mocks/company-management.mock.ts

export type CompanyManagementStatus = 'Active' | 'Inactive';

export interface CompanyManagementRecord {
  id: string;
  partnerId: string;
  name: string;
  initials: string;
  subtitle: string;
  location: string;
  program: string;
  availableSlots: number;
  status: CompanyManagementStatus;
}

export interface CompanyManagementSummary {
  totalCompanies: number;
  activeCompanies: number;
  availableSlots: number;
}

// TEMP MOCK
export const mockCompanyManagementSummary: CompanyManagementSummary = {
  totalCompanies: 24,
  activeCompanies: 18,
  availableSlots: 74,
};

// TEMP MOCK — illustrative placeholder records
export const mockCompanyRecords: CompanyManagementRecord[] = [
  {
    id: 'company-001',
    partnerId: 'HTE-2026-0012',
    name: 'Sample Technology Solutions',
    initials: 'STS',
    subtitle: 'Partnership MOA Active',
    location: 'Batangas City',
    program: 'BSIT',
    availableSlots: 7,
    status: 'Active',
  },
  {
    id: 'company-002',
    partnerId: 'HTE-2026-0013',
    name: 'Sample Government Agency',
    initials: 'SGA',
    subtitle: 'Government Agency MOU',
    location: 'Lipa City',
    program: 'BSIT',
    availableSlots: 12,
    status: 'Active',
  },
  {
    id: 'company-003',
    partnerId: 'HTE-2026-0014',
    name: 'Sample Digital Services',
    initials: 'SDS',
    subtitle: 'Renewal in Progress',
    location: 'Santo Tomas',
    program: 'BSCS',
    availableSlots: 18,
    status: 'Inactive',
  },
  {
    id: 'company-004',
    partnerId: 'HTE-2026-0015',
    name: 'Sample Business Systems',
    initials: 'SBS',
    subtitle: 'Partnership MOA Active',
    location: 'Tanauan City',
    program: 'BSIT',
    availableSlots: 15,
    status: 'Active',
  },
  {
    id: 'company-005',
    partnerId: 'HTE-2026-0016',
    name: 'Sample Information Systems',
    initials: 'SIS',
    subtitle: 'Government Agency MOU',
    location: 'Batangas City',
    program: 'BSCS',
    availableSlots: 22,
    status: 'Active',
  },
];

// TEMP MOCK
export const mockCompanyPrograms: string[] = [
  'BSIT',
  'BSCS',
];

// TEMP MOCK
export const mockCompanyStatuses: CompanyManagementStatus[] = [
  'Active',
  'Inactive',
];