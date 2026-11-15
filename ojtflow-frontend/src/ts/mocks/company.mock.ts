// src/ts/mocks/company.mock.ts

import type {
  CompanyDirectoryHeading,
  CompanyDirectoryFilters
} from '../types/company.types';

// TEMP MOCK
export const mockCompanyDirectoryHeading: CompanyDirectoryHeading = {
  directoryName: 'Batangas Directory',
  breadcrumb: [
    'OJT Placement Office',
    'Host Training Establishments',
    'Batangas Directory'
  ],
  title: 'Accredited Partner Establishments',
  subtitle: '',
  displayedRange: 'Showing 1-6 of 12 Companies',
  totalCompanies: 12
};

// TEMP MOCK
export const mockCompanyDirectoryFilters: CompanyDirectoryFilters = {
  searchPlaceholder: 'Search company name...',
  defaultProgram: 'All Programs',
  defaultLocation: 'All Batangas Locations',
  defaultAvailability: 'All Statuses',
  helperText: 'Showing all accredited Batangas establishments'
};


// TEMP MOCK
export const mockCompanyProgramSection: CompanyProgramSection = {
  sectionLabel: 'Section A',
  programName: 'BS Computer Science',
  partnerCount: 6,
  focusTags: []
};