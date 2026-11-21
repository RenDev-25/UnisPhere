/* =========================================================
   OJTFlow — Eligibility Mock Data
   Stage 7.9: Eligibility & Requirements
   ========================================================= */

import type {
  EligibilityPageData,
  EligibilityRecord,
} from '../types/eligibility.types';

import type {
  EligibilityDetailsData,
} from '../types/eligibility.types';

// TEMP MOCK
export const mockEligibilityPage: EligibilityPageData = {
  summary: {
    totalStudents: 248,
    forReview: 32,
    eligible: 186,
    incompleteRequirements: 30,
  },

  programs: [
    'BSIT',
    'BSCS',
  ],

  statuses: [
    'Eligible',
    'For Review',
    'Incomplete',
  ],

  // TEMP MOCK
  // The roadmap specifies four rows but does not provide
  // their exact names, student numbers, or individual values.
  // Replace these placeholders when approved sample records
  // are available.
  records: [
    {
      id: 'eligibility-001',
      studentName: 'Student name not provided',
      studentNumber: 'Not provided',
      program: 'BSIT',
      requirements: '8/8',
      status: 'Eligible',
    },
    {
      id: 'eligibility-002',
      studentName: 'Student name not provided',
      studentNumber: 'Not provided',
      program: 'BSCS',
      requirements: '8/8',
      status: 'For Review',
    },
    {
      id: 'eligibility-003',
      studentName: 'Student name not provided',
      studentNumber: 'Not provided',
      program: 'BSIT',
      requirements: '8/8',
      status: 'Eligible',
    },
    {
      id: 'eligibility-004',
      studentName: 'Student name not provided',
      studentNumber: 'Not provided',
      program: 'BSCS',
      requirements: '8/8',
      status: 'Incomplete',
    },
  ],
};

// TEMP MOCK
// Used only to verify the no-results rendering.
// Do not add a Preview Empty State button to the page.
export const mockEmptyEligibilityRecords: EligibilityRecord[] = [];


/* =========================================================
   OJTFlow — Eligibility Details Mock Data
   Stage 7.10: Student Eligibility Details
   ========================================================= */

// TEMP MOCK
export const mockEligibilityDetails: EligibilityDetailsData = {

  // TEMP MOCK
  // The roadmap does not provide an exact student name or number.
  student: {
    studentName: 'Juan Dela Cruz',
    studentNumber: '22-12345',
    program: 'BSIT',
    yearLevel: '3rd Year',
    section: '3-A',
    studentType: 'Regular Student',
    eligibilityStatus: 'Eligible',
  },

  // TEMP MOCK
  overview: {
    completedRequirements: 8,
    totalRequirements: 8,
    completionPercentage: 100,
    standardLabel: 'BatStateU OJT Curriculum Standard',
    completionMessage: 'All requirements approved',
  },

  // TEMP MOCK
  // This is the coordinator checklist from Stage 7.10.
  // It intentionally differs from the student requirement list.
  requirements: [
    {
      id: 'coordinator-req-001',
      number: 1,
      title: 'Student Information Sheet',
      description: 'Physical document submitted for coordinator verification.',
      status: 'Approved',
    },
    {
      id: 'coordinator-req-002',
      number: 2,
      title: 'Certificate of Registration',
      description: 'Physical document submitted for coordinator verification.',
      status: 'Approved',
    },
    {
      id: 'coordinator-req-003',
      number: 3,
      title: 'Copy of Grades',
      description: 'Physical document submitted for coordinator verification.',
      status: 'Approved',
    },
    {
      id: 'coordinator-req-004',
      number: 4,
      title: 'Medical Certificate',
      description: 'Physical document submitted for coordinator verification.',
      status: 'Approved',
    },
    {
      id: 'coordinator-req-005',
      number: 5,
      title: "Parent's Consent",
      description: 'Physical document submitted for coordinator verification.',
      status: 'Approved',
    },
    {
      id: 'coordinator-req-006',
      number: 6,
      title: 'Resume',
      description: 'Physical document submitted for coordinator verification.',
      status: 'Approved',
    },
    {
      id: 'coordinator-req-007',
      number: 7,
      title: 'Barangay Clearance',
      description: 'Physical document submitted for coordinator verification.',
      status: 'Approved',
    },
    {
      id: 'coordinator-req-008',
      number: 8,
      title: 'Other Required Documents',
      description: 'Physical document submitted for coordinator verification.',
      status: 'Approved',
    },
  ],

  // TEMP MOCK
  coordinatorRemarks: {
    remarks:
      'All eight required physical documents have been reviewed and approved.',
  },
};