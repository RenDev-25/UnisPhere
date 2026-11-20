
/* =========================================================
   OJTFlow — Company Management Mock Data
   ========================================================= */

// =========================================================
// COMPANY MANAGEMENT
// =========================================================

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
  companyId: 'company-001',
  partnerId: 'HTE-2026-0012',

  // Reused from the existing Company Management mock record.
  companyName: 'Sample Technology Solutions',
  initials: 'STS',
  location: 'Batangas City',

  academicYear: 'A.Y. 2026–2027',
  establishmentType: 'Host Training Establishment (HTE)',
  availableSlots: 7,

  // TEMP MOCK — placeholder contact information.
  information: {
    companyName: 'Sample Technology Solutions',
    address: '—',
    cityMunicipality: 'Batangas City',
    province: '—',
    email: '—',
    contactNumber: '—',
    website: '—',
  },

  // TEMP MOCK — placeholder representative details.
  representative: {
    contactPerson: '—',
    position: '—',
    email: '—',
    contactNumber: '—',
  },

  // TEMP MOCK
  partnership: {
    acceptedPrograms: [
      {
        code: 'BSIT',
        requiredHours: 486,
      },
      {
        code: 'BSCS',
        requiredHours: 500,
      },
    ],

    availableSlots: 7,

    // TEMP MOCK — allocation note not specified.
    allocationNote: '—',

    companyStatus:
      'Active — Eligible for immediate student placement',

    // TEMP MOCK — partnership remarks not specified.
    partnershipRemarks: '—',
  },

  verificationText:
    'Record verified by CICS OJT Placement Office.',

  lastUpdated: 'Oct 14, 2026',
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

  companyDetails: {
    companyName: 'Sample Technology Solutions',
    address: '—',
    cityMunicipality: 'Batangas City',
    province: '',
    email: '—',
    contactNumber: '—',
    website: '—',
  },

  representative: {
    contactPerson: '',
    position: '—',
    email: '—',
    contactNumber: '—',
  },

  partnership: {
    acceptedPrograms: [
      {
        code: 'BSIT',
        requiredHours: 486,
        selected: true,
      },
      {
        code: 'BSCS',
        requiredHours: 500,
        selected: true,
      },
    ],

    availableSlots: 7,
    status: 'Active',
    remarks: '',
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
