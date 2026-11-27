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
  /** Persisted logo data URL for the temporary browser-based store. */
  logoDataUrl?: string;
  companyStatus?: 'Active' | 'Inactive';
  province?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  website?: string;
  partnershipRemarks?: string;
  contactPersonEmail?: string;
  academicProgramHours?: Record<string, number>;
  /** Stable partner identifier used by coordinator records. */
  partnerId?: string;
  /** Partnership contact and record metadata persisted in IndexedDB. */
  updatedAt?: string;
  ownerId?: string;
  published?: boolean;
}
