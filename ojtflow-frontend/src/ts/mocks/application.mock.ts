
/* =========================================================
   OJTFlow — Application Mock Data
   File: src/ts/mocks/application.mock.ts

   Stage 6.3 — Student Applications Mockup
   Stage 7.11 — Coordinator Applications Management Mockup
   ========================================================= */

import type {
  ApplicationRecord,
  ApplicationPageHeading,
  ApplicationFilters,
  ApplicationPlacementNotice,
  ApplicationEmptyState,
  CoordinatorApplicationManagementData,
  CoordinatorApplicationRecord,
} from '../types/application.types';

/* =========================================================
   STAGE 6.3 — STUDENT APPLICATIONS
========================================================= */

/* ========================================
   6.3.2 PAGE HEADING
======================================== */

// TEMP MOCK
export const mockApplicationHeading: ApplicationPageHeading = {
  title: 'My Applications',

  totalLabel: 'TOTAL APPLICATIONS: 04',

  subtitle:
    'Track and manage your submitted OJT applications across verified Host Training Establishments.',
};

/* ========================================
   6.3.3 APPLICATION FILTERS
======================================== */

// TEMP MOCK
export const mockApplicationFilters: ApplicationFilters = {
  searchPlaceholder: 'Search company or location...',

  statusOptions: [
    'Pending Decision',
    'Under Review',
    'Accepted',
    'Rejected',
  ],

  sortOptions: [
    {
      label: 'Newest First',
      value: 'newest',
    },
    {
      label: 'Oldest First',
      value: 'oldest',
    },
  ],

  defaultSort: 'newest',
};

/* ========================================
   6.3.4 APPLICATION RECORDS
======================================== */

// TEMP MOCK
// Company names and locations reuse Stage 6.2 data.
// Dates and remarks are illustrative temporary values.

export const mockApplications: ApplicationRecord[] = [
  {
    id: 'application-001',
    companyId: 'company-001',
    initials: 'CTI',
    companyName: 'Central Tech Innovations',
    location: 'Batangas City, Batangas',
    dateApplied: '2026-11-12',
    academicProgram: 'BS Computer Science',
    status: 'Under Review',
    remarks:
      'Your application has been received and is currently being reviewed by the HTE Coordinator. Please wait for further updates regarding your application.',
  },

  {
    id: 'application-002',
    companyId: 'company-002',
    initials: 'SR',
    companyName: 'Southern Ridge Digital Services',
    location: 'Lipa City, Batangas',
    dateApplied: '2026-11-10',
    academicProgram: 'BS Computer Science',
    status: 'Accepted',
    remarks:
      'Your application has been accepted by the Host Training Establishment. Please coordinate with your OJT Coordinator regarding the next steps for institutional placement processing.',
    nextAction:
      'Monitor My Deployment for official placement confirmation and deployment instructions.',
  },

  {
    id: 'application-003',
    companyId: 'company-004',
    initials: 'BPC',
    companyName: 'Batangas Precision Computing',
    location: 'Santo Tomas, Batangas',
    dateApplied: '2026-11-08',
    academicProgram: 'BS Computer Science',
    status: 'Pending Decision',
    remarks:
      'Your application has been submitted successfully. The establishment has not yet provided a final decision.',
  },

  {
    id: 'application-004',
    companyId: 'company-003',
    initials: 'LTC',
    companyName: 'Lakeside Technology Center',
    location: 'Tanauan City, Batangas',
    dateApplied: '2026-11-05',
    academicProgram: 'BS Computer Science',
    status: 'Rejected',
    remarks:
      'The establishment has decided not to proceed with your application at this time. You may explore other verified Host Training Establishments.',
  },
];

/* ========================================
   6.3.5 EMPTY STATE
======================================== */

// TEMP MOCK
export const mockApplicationEmptyState: ApplicationEmptyState = {
  title: "You haven't submitted any applications yet.",

  description:
    'Explore verified Host Training Establishments and submit your first OJT application to get started.',

  buttonLabel: 'Browse Companies',

  buttonHref: '/pages/student/browse-companies.html',
};

/* ========================================
   6.3.6 INSTITUTIONAL PLACEMENT NOTICE
======================================== */

// TEMP MOCK
export const mockApplicationPlacementNotice: ApplicationPlacementNotice = {
  title: 'Institutional Placement Notice',

  message:
    'An Accepted application does not constitute a confirmed OJT placement. Final placement confirmation is subject to institutional processing and official deployment approval.',

  linkLabel: 'My Deployment',

  linkHref: '/pages/student/my-deployment.html',
};

/* =========================================================
   STAGE 7.11 — COORDINATOR APPLICATIONS MANAGEMENT
========================================================= */

/* ========================================
   7.11.1 COORDINATOR APPLICATION RECORDS
======================================== */

// TEMP MOCK
// These records are illustrative.
// Academic programs and application statuses follow
// application.types.ts.

const coordinatorApplicationRecords: CoordinatorApplicationRecord[] = [
  {
    id: 'coord-app-001',
    studentName: 'Juan Santos',
    studentNumber: '22-12345',
    academicProgram: 'BSIT',
    companyName: 'Central Tech Innovations',
    applicationDate: '2026-11-12',
    status: 'Under Review',
  },

  {
    id: 'coord-app-002',
    studentName: 'Maria Reyes',
    studentNumber: '22-12346',
    academicProgram: 'BSCS',
    companyName: 'Southern Ridge Digital Services',
    applicationDate: '2026-11-11',
    status: 'Accepted',
  },

  {
    id: 'coord-app-003',
    studentName: 'Pedro Garcia',
    studentNumber: '22-12347',
    academicProgram: 'BSIT',
    companyName: 'Batangas Precision Computing',
    applicationDate: '2026-11-10',
    status: 'Pending',
  },

  {
    id: 'coord-app-004',
    studentName: 'Ana Cruz',
    studentNumber: '22-12348',
    academicProgram: 'BSCS',
    companyName: 'Lakeside Technology Center',
    applicationDate: '2026-11-09',
    status: 'Rejected',
  },

  {
    id: 'coord-app-005',
    studentName: 'Mark Dela Cruz',
    studentNumber: '22-12349',
    academicProgram: 'BSIT',
    companyName: 'Central Tech Innovations',
    applicationDate: '2026-11-08',
    status: 'Pending',
  },

  {
    id: 'coord-app-006',
    studentName: 'Sofia Mendoza',
    studentNumber: '22-12350',
    academicProgram: 'BSCS',
    companyName: 'Southern Ridge Digital Services',
    applicationDate: '2026-11-07',
    status: 'Under Review',
  },
];

/* ========================================
   7.11.2 COORDINATOR APPLICATIONS DATA
======================================== */

// TEMP MOCK
export const mockCoordinatorApplications: CoordinatorApplicationManagementData = {
  summary: {
    total: coordinatorApplicationRecords.length,

    pending: coordinatorApplicationRecords.filter(
      (record) => record.status === 'Pending',
    ).length,

    underReview: coordinatorApplicationRecords.filter(
      (record) => record.status === 'Under Review',
    ).length,

    accepted: coordinatorApplicationRecords.filter(
      (record) => record.status === 'Accepted',
    ).length,

    rejected: coordinatorApplicationRecords.filter(
      (record) => record.status === 'Rejected',
    ).length,
  },

  records: coordinatorApplicationRecords,

  totalRecords: coordinatorApplicationRecords.length,

  pageSize: 5,
};
