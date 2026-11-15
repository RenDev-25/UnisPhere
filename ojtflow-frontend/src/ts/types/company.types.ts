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

