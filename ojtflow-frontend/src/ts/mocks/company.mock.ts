
/* =========================================================
   OJTFlow — Company Management Mock Data
   ========================================================= */

// =========================================================
// COMPANY MANAGEMENT
// =========================================================
import type {
  CompanyDirectoryHeading,
  CompanyDirectoryFilters,
  CompanyProgramSection,
  CompanyRecord
} from '../types/company.types';


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
  logoDataUrl?: string;
}

export interface CompanyManagementSummary {
  totalCompanies: number;
  activeCompanies: number;
  availableSlots: number;
}

// TEMP MOCK
export const mockCompanyManagementSummary: CompanyManagementSummary = {
  totalCompanies: 0,
  activeCompanies: 0,
  availableSlots: 0,
};

// TEMP MOCK — illustrative placeholder records
export const mockCompanyRecords: CompanyManagementRecord[] = [];

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

// =========================================================
// STAGE 7.6 — COMPANY DETAILS
// =========================================================

export interface CompanyDetailsProgram {
  code: string;
  requiredHours: number;
}

export interface CompanyDetailsInformation {
  companyName: string;
  address: string;
  cityMunicipality: string;
  province: string;
  email: string;
  contactNumber: string;
  website: string;
}

export interface CompanyRepresentative {
  contactPerson: string;
  position: string;
  email: string;
  contactNumber: string;
}

export interface CompanyPartnershipDetails {
  acceptedPrograms: CompanyDetailsProgram[];
  availableSlots: number;
  allocationNote: string;
  companyStatus: string;
  partnershipRemarks: string;
}

export interface CompanyDetailsRecord {
  companyId: string;
  partnerId: string;
  companyName: string;
  initials: string;
  location: string;
  academicYear: string;
  establishmentType: string;
  availableSlots: number;

  information: CompanyDetailsInformation;
  representative: CompanyRepresentative;
  partnership: CompanyPartnershipDetails;

  verificationText: string;
  lastUpdated: string;
}

// TEMP MOCK
export const mockCompanyDetails: CompanyDetailsRecord = {
  companyId: '', partnerId: '', companyName: '', initials: '', location: '',
  academicYear: '', establishmentType: 'Host Training Establishment (HTE)', availableSlots: 0,
  information: { companyName: '', address: '', cityMunicipality: '', province: '', email: '', contactNumber: '', website: '' },
  representative: { contactPerson: '', position: '', email: '', contactNumber: '' },
  partnership: { acceptedPrograms: [], availableSlots: 0, allocationNote: '', companyStatus: '', partnershipRemarks: '' },
  verificationText: '', lastUpdated: '',
};


/* =========================================================
   STAGE 7.7 — ADD COMPANY
   ========================================================= */

export type AddCompanyStatus = 'Active' | 'Inactive';

export interface AddCompanyFormData {
  academicYear: string;

  companyDetails: {
    companyName: string;
    address: string;
    cityMunicipality: string;
    province: string;
    email: string;
    contactNumber: string;
    website: string;
  };

  representative: {
    contactPerson: string;
    position: string;
    email: string;
    contactNumber: string;
  };

  partnership: {
    acceptedPrograms: {
      code: 'BSIT' | 'BSCS';
      requiredHours: number;
      selected: boolean;
    }[];

    availableSlots: number;
    status: AddCompanyStatus;
    remarks: string;
  };
}

// TEMP MOCK
export const mockAddCompanyForm: AddCompanyFormData = {
  academicYear: 'A.Y. 2026–2027',
  companyDetails: { companyName: '', address: '', cityMunicipality: '', province: '', email: '', contactNumber: '', website: '' },
  representative: { contactPerson: '', position: '', email: '', contactNumber: '' },
  partnership: {
    acceptedPrograms: [
      { code: 'BSIT', requiredHours: 486, selected: false },
      { code: 'BSCS', requiredHours: 500, selected: false },
    ],
    availableSlots: 0, status: 'Active', remarks: '',
  },
};

// TEMP MOCK
export const mockCompanyProvinces: string[] = [
  'Batangas',
  'Cavite',
  'Laguna',
  'Rizal',
  'Quezon',
  'Metro Manila (NCR)',
  'Other Region / International',
];
// =========================================================
// STAGE 7.8 — EDIT COMPANY
// =========================================================

export interface EditCompanyFormData {
  partnerId: string;
  companyName: string;
  initials: string;
  verificationStatus: string;
  recordStatus: string;

  logo: {
    fileName: string;
    fileSize: string;
    format: string;
  };

  companyDetails: {
    address: string;
    cityMunicipality: string;
    province: string;
    email: string;
    contactNumber: string;
    website: string;
  };

  representative: {
    contactPerson: string;
    position: string;
    email: string;
    contactNumber: string;
  };

  partnership: {
    acceptedPrograms: {
      code: 'BSIT' | 'BSCS';
      requiredHours: number;
      selected: boolean;
    }[];
    availableSlots: number;
    status: AddCompanyStatus;
    remarks: string;
  };

  lastModified: string;
}

export const mockEditCompanyForm: EditCompanyFormData = {
  partnerId: '', companyName: '', initials: '', verificationStatus: 'Company record', recordStatus: 'Active',
  logo: { fileName: 'No logo uploaded', fileSize: '—', format: '—' },
  companyDetails: { address: '', cityMunicipality: '', province: '', email: '', contactNumber: '', website: '' },
  representative: { contactPerson: '', position: '', email: '', contactNumber: '' },
  partnership: {
    acceptedPrograms: [
      { code: 'BSIT', requiredHours: 486, selected: false },
      { code: 'BSCS', requiredHours: 500, selected: false },
    ],
    availableSlots: 0, status: 'Active', remarks: '',
  },
  lastModified: '',
};



// ======================================================
// STUDENT PORTAL — BROWSE COMPANIES
// ======================================================

export const mockCompanyDirectoryHeading: CompanyDirectoryHeading = {
  directoryName: 'Host Company Directory',
  breadcrumb: ['Dashboard', 'Host Company Directory'],
  title: 'Explore OJT Partner Companies',
  subtitle:
    'Browse available partner companies and find an organization that matches your OJT program and career interests.',
  displayedRange: 'No companies available',
  totalCompanies: 0
};

export const mockCompanyDirectoryFilters: CompanyDirectoryFilters = {
  searchPlaceholder: 'Search company name or location...',
  defaultProgram: 'All Programs',
  defaultLocation: 'All Locations',
  defaultAvailability: 'All Availability',
  helperText:
    'Use the filters to find companies that accept your program and have available OJT slots.'
};

export const mockCompanyProgramSection: CompanyProgramSection = {
  sectionLabel: 'Your Program',
  programName: 'BS Information Technology',
  partnerCount: 0,
  focusTags: [
    'Web Development',
    'Software Development',
    'Database Management',
    'IT Support',
    'Networking'
  ]
};

export const mockCompanies: CompanyRecord[] = [];
