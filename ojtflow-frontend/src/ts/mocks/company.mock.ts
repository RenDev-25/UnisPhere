// src/ts/mocks/company.mock.ts

import type {
  CompanyDirectoryHeading,
  CompanyDirectoryFilters,
  CompanyProgramSection,
  CompanyRecord
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
  subtitle: 'Explore temporary sample host establishments for your OJT placement.',
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
  focusTags: [
    'Web Development',
    'Software Development',
    'IT Support'
  ]
};

// TEMP MOCK — fictional establishments and contact information
export const mockCompanies: CompanyRecord[] = [
  {
    id: 'company-001',
    initials: 'CTI',
    name: 'Central Tech Innovations',
    location: 'Batangas City, Batangas',
    municipality: 'Batangas City',
    program: 'BS Computer Science',
    availability: 'accepting',
    slotsOpen: 8,
    description:
      'A fictional technology company sample focused on software solutions, web applications, and information technology services.',
    acceptedPrograms: [
      'BS Computer Science',
      'BS Information Technology'
    ],
    opportunityFocus: [
      'Web Development',
      'Software Development',
      'Database Management'
    ],
    requirements: [
      'Currently enrolled in an eligible academic program',
      'Endorsement from the OJT coordinator',
      'Updated resume'
    ],
    preferredSkills: [
      'HTML, CSS, and JavaScript',
      'Basic database knowledge',
      'Problem-solving'
    ],
    contactName: 'Jordan Sample',
    contactRole: 'Sample OJT Coordinator',
    contactPhone: '0900-000-0001',
    contactEmail: 'cti-contact@example.invalid'
  },
  {
    id: 'company-002',
    initials: 'SR',
    name: 'Southern Ridge Digital Services',
    location: 'Lipa City, Batangas',
    municipality: 'Lipa City',
    program: 'BS Computer Science',
    availability: 'accepting',
    slotsOpen: 5,
    description:
      'A fictional digital services establishment sample providing website development and technical support.',
    acceptedPrograms: [
      'BS Computer Science',
      'BS Information Technology'
    ],
    opportunityFocus: [
      'Frontend Development',
      'UI Implementation',
      'Technical Support'
    ],
    requirements: [
      'Endorsement letter',
      'Updated resume',
      'Completion of required prerequisite subjects'
    ],
    preferredSkills: [
      'Responsive web design',
      'JavaScript fundamentals',
      'Communication skills'
    ],
    contactName: 'Taylor Example',
    contactRole: 'Sample Training Supervisor',
    contactPhone: '0900-000-0002',
    contactEmail: 'sr-contact@example.invalid'
  },
  {
    id: 'company-003',
    initials: 'LTC',
    name: 'Lakeside Technology Center',
    location: 'Tanauan City, Batangas',
    municipality: 'Tanauan City',
    program: 'BS Computer Science',
    availability: 'not-accepting',
    slotsOpen: 0,
    description:
      'A fictional technology center sample used to demonstrate a partner with currently filled OJT slots.',
    acceptedPrograms: [
      'BS Computer Science',
      'BS Information Technology'
    ],
    opportunityFocus: [
      'Computer Systems',
      'Network Support',
      'IT Operations'
    ],
    requirements: [
      'Endorsement letter',
      'Updated resume',
      'School-approved training plan'
    ],
    preferredSkills: [
      'Computer troubleshooting',
      'Basic networking',
      'Documentation'
    ],
    contactName: 'Morgan Demo',
    contactRole: 'Sample HR Representative',
    contactPhone: '0900-000-0003',
    contactEmail: 'ltc-contact@example.invalid'
  },
  {
    id: 'company-004',
    initials: 'BPC',
    name: 'Batangas Precision Computing',
    location: 'Santo Tomas, Batangas',
    municipality: 'Santo Tomas',
    program: 'BS Computer Science',
    availability: 'accepting',
    slotsOpen: 8,
    description:
      'A fictional computing services company sample offering exposure to software testing and database-related tasks.',
    acceptedPrograms: [
      'BS Computer Science'
    ],
    opportunityFocus: [
      'Software Testing',
      'Database Management',
      'Quality Assurance'
    ],
    requirements: [
      'Endorsement from the school',
      'Updated resume',
      'Signed training agreement'
    ],
    preferredSkills: [
      'SQL fundamentals',
      'Attention to detail',
      'Analytical thinking'
    ],
    contactName: 'Casey Placeholder',
    contactRole: 'Sample OJT Focal Person',
    contactPhone: '0900-000-0004',
    contactEmail: 'bpc-contact@example.invalid'
  },
  {
    id: 'company-005',
    initials: 'FGC',
    name: 'First Gateway Computing',
    location: 'Bauan, Batangas',
    municipality: 'Bauan',
    program: 'BS Computer Science',
    availability: 'not-accepting',
    slotsOpen: 0,
    description:
      'A fictional computing company sample demonstrating a partner that is not currently accepting trainees.',
    acceptedPrograms: [
      'BS Computer Science',
      'BS Information Technology'
    ],
    opportunityFocus: [
      'Systems Development',
      'Technical Documentation',
      'IT Support'
    ],
    requirements: [
      'School endorsement',
      'Updated resume',
      'Required academic documents'
    ],
    preferredSkills: [
      'Programming fundamentals',
      'Technical writing',
      'Teamwork'
    ],
    contactName: 'Riley Mock',
    contactRole: 'Sample Department Contact',
    contactPhone: '0900-000-0005',
    contactEmail: 'fgc-contact@example.invalid'
  },
  {
    id: 'company-006',
    initials: 'MDS',
    name: 'Metro Digital Solutions',
    location: 'Nasugbu, Batangas',
    municipality: 'Nasugbu',
    program: 'BS Computer Science',
    availability: 'not-accepting',
    slotsOpen: 0,
    description:
      'A fictional digital solutions company sample included for the six-card directory mockup.',
    acceptedPrograms: [
      'BS Computer Science'
    ],
    opportunityFocus: [
      'Web Applications',
      'Software Documentation',
      'System Analysis'
    ],
    requirements: [
      'School endorsement',
      'Updated resume',
      'Approved OJT schedule'
    ],
    preferredSkills: [
      'Basic programming',
      'Documentation',
      'Critical thinking'
    ],
    contactName: 'Avery Test',
    contactRole: 'Sample Training Contact',
    contactPhone: '0900-000-0006',
    contactEmail: 'mds-contact@example.invalid'
  }
];