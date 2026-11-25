
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

// Keep the displayed remarks at exactly 259 characters.
const mockEditRemarksText =
  'The company continues to support student internship placements and provides opportunities for practical training, professional development, and supervised workplace experience. Coordinators may contact the company representative for partnership updates and placement coordination.';

export const mockEditCompanyForm: EditCompanyFormData = {
  partnerId: 'HTE-2026-0012',
  companyName: 'Sample Technology Solutions',
  initials: 'STS',
  verificationStatus: 'BatStateU-CICS Verified',
  recordStatus: 'MOA COMPLIANT',

  logo: {
    fileName: 'sample-technology-solutions-logo.svg',
    fileSize: '18.4 KB',
    format: 'SVG',
  },

  companyDetails: {
    address: 'Batangas City, Batangas',
    cityMunicipality: 'Batangas City',
    province: 'Batangas',
    email: '—',
    contactNumber: '—',
    website: '',
  },

  representative: {
    contactPerson: 'Engr. Santos',
    position: 'Company Representative',
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
    remarks: mockEditRemarksText.slice(0, 259).padEnd(259, ' '),
  },

  lastModified: 'Oct 14, 2026 by Engr. Santos',
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
  displayedRange: 'Showing 1–5 of 5 companies',
  totalCompanies: 5
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
  partnerCount: 5,
  focusTags: [
    'Web Development',
    'Software Development',
    'Database Management',
    'IT Support',
    'Networking'
  ]
};

export const mockCompanies: CompanyRecord[] = [
  {
    id: 'COMP-001',
    initials: 'TC',
    name: 'TechCore Solutions',
    location: 'Batangas City, Batangas',
    municipality: 'Batangas City',
    program: 'BSIT',
    availability: 'accepting',
    slotsOpen: 5,
    description:
      'A technology-focused company offering practical experience in software development, web applications, and IT support.',
    acceptedPrograms: ['BSIT', 'BSCS'],
    opportunityFocus: [
      'Web Development',
      'Software Development',
      'Database Management'
    ],
    requirements: [
      'Updated Resume',
      'Endorsement Letter',
      'Certificate of Registration'
    ],
    preferredSkills: [
      'HTML',
      'CSS',
      'JavaScript',
      'TypeScript',
      'Database Management'
    ],
    contactName: 'Mark Reyes',
    contactRole: 'HR Coordinator',
    contactPhone: '09171234567',
    contactEmail: 'hr@techcoresolutions.example'
  },
  {
    id: 'COMP-002',
    initials: 'DI',
    name: 'Digital Innovations Inc.',
    location: 'Lipa City, Batangas',
    municipality: 'Lipa City',
    program: 'BSIT',
    availability: 'accepting',
    slotsOpen: 3,
    description:
      'A digital solutions company providing opportunities in website development, application testing, and technical support.',
    acceptedPrograms: ['BSIT', 'BSCS'],
    opportunityFocus: [
      'Web Development',
      'Quality Assurance',
      'Technical Support'
    ],
    requirements: [
      'Updated Resume',
      'Endorsement Letter',
      'School Registration Form'
    ],
    preferredSkills: [
      'HTML',
      'CSS',
      'JavaScript',
      'Problem Solving',
      'Communication'
    ],
    contactName: 'Angela Cruz',
    contactRole: 'Recruitment Officer',
    contactPhone: '09181234567',
    contactEmail: 'careers@digitalinnovations.example'
  },
  {
    id: 'COMP-003',
    initials: 'NS',
    name: 'NextGen Software Development',
    location: 'Tanauan City, Batangas',
    municipality: 'Tanauan City',
    program: 'BSIT',
    availability: 'not-accepting',
    slotsOpen: 0,
    description:
      'A software development organization focused on business applications, system development, and database solutions.',
    acceptedPrograms: ['BSIT', 'BSCS'],
    opportunityFocus: [
      'Software Development',
      'System Analysis',
      'Database Management'
    ],
    requirements: [
      'Updated Resume',
      'Endorsement Letter',
      'Certificate of Registration'
    ],
    preferredSkills: [
      'Java',
      'Python',
      'SQL',
      'System Analysis',
      'Programming Fundamentals'
    ],
    contactName: 'John Mendoza',
    contactRole: 'Company Representative',
    contactPhone: '09191234567',
    contactEmail: 'ojt@nextgensoftware.example'
  },
  {
    id: 'COMP-004',
    initials: 'BT',
    name: 'ByteWorks Technologies',
    location: 'Santo Tomas City, Batangas',
    municipality: 'Santo Tomas',
    program: 'BSIT',
    availability: 'accepting',
    slotsOpen: 4,
    description:
      'An IT services provider offering hands-on learning in computer systems, network administration, and technical assistance.',
    acceptedPrograms: ['BSIT'],
    opportunityFocus: [
      'IT Support',
      'Networking',
      'Computer Systems'
    ],
    requirements: [
      'Updated Resume',
      'Endorsement Letter',
      'School Registration Form'
    ],
    preferredSkills: [
      'Computer Troubleshooting',
      'Networking',
      'Hardware Maintenance',
      'Communication'
    ],
    contactName: 'Carlo Santos',
    contactRole: 'HR Assistant',
    contactPhone: '09201234567',
    contactEmail: 'hr@byteworks.example'
  },
  {
    id: 'COMP-005',
    initials: 'SI',
    name: 'Smart IT Solutions',
    location: 'Batangas City, Batangas',
    municipality: 'Batangas City',
    program: 'BSIT',
    availability: 'accepting',
    slotsOpen: 2,
    description:
      'An information technology services company providing exposure to business systems, technical support, and IT operations.',
    acceptedPrograms: ['BSIT', 'BSCS'],
    opportunityFocus: [
      'IT Operations',
      'Technical Support',
      'System Administration'
    ],
    requirements: [
      'Updated Resume',
      'Endorsement Letter',
      'Certificate of Registration'
    ],
    preferredSkills: [
      'Computer Troubleshooting',
      'Networking',
      'Operating Systems',
      'Documentation'
    ],
    contactName: 'Maria Garcia',
    contactRole: 'OJT Coordinator',
    contactPhone: '09211234567',
    contactEmail: 'ojt@smartitsolutions.example'
  }
];