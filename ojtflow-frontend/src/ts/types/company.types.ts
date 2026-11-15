// src/ts/types/company.types.ts

export interface CompanyDirectoryHeading {
  directoryName: string;
  breadcrumb: string[];
  title: string;
  subtitle: string;
  displayedRange: string;
  totalCompanies: number;
}

export interface CompanyDirectoryFilters {
  searchPlaceholder: string;
  defaultProgram: string;
  defaultLocation: string;
  defaultAvailability: string;
  helperText: string;
}

export interface CompanyProgramSection {
  sectionLabel: string;
  programName: string;
  partnerCount: number;
  focusTags: string[];
}

export type CompanyAvailability =
  | 'accepting'
  | 'not-accepting';

export interface CompanyRecord {
  id: string;
  initials: string;
  name: string;
  location: string;
  municipality: string;
  program: string;
  availability: CompanyAvailability;
  slotsOpen: number;
  description: string;
  acceptedPrograms: string[];
  opportunityFocus: string[];
  requirements: string[];
  preferredSkills: string[];
  contactName: string;
  contactRole: string;
  contactPhone: string;
  contactEmail: string;
}