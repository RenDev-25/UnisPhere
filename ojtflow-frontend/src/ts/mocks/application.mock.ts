
/* src/ts/mocks/application.mock.ts */

import type {
  ApplicationRecord,
  ApplicationPageHeading,
  ApplicationFilters,
  ApplicationPlacementNotice,
  ApplicationEmptyState
} from '../types/application.types';

/* ========================================
   6.3.2 PAGE HEADING
======================================== */

// TEMP MOCK
export const mockApplicationHeading: ApplicationPageHeading = {
  title: 'My Applications',
  totalLabel: 'TOTAL APPLICATIONS: 04',
  subtitle:
    'Track and manage your submitted OJT applications across verified Host Training Establishments.'
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
    'Rejected'
  ],

  sortOptions: [
    {
      label: 'Newest First',
      value: 'newest'
    },
    {
      label: 'Oldest First',
      value: 'oldest'
    }
  ],

  defaultSort: 'newest'
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
      'Monitor My Deployment for official placement confirmation and deployment instructions.'
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
      'Your application has been submitted successfully. The establishment has not yet provided a final decision.'
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
      'The establishment has decided not to proceed with your application at this time. You may explore other verified Host Training Establishments.'
  }

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

  buttonHref: '/pages/student/browse-companies.html'
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

  linkHref: '/pages/student/my-deployment.html'
};
