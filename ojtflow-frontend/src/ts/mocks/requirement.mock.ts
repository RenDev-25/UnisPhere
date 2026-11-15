
/* src/ts/mocks/requirement.mock.ts */

import type {
  RequirementHeading,
  RequirementCompletion,
  RequirementRecord,
  RequirementAssistance,
  RequirementDetail
} from '../types/requirement.types';

/* ========================================
   PAGE HEADING
======================================== */

// TEMP MOCK
export const mockRequirementHeading: RequirementHeading = {
  title: 'OJT Requirements',
  progressLabel: 'PROGRESS: 75% COMPLETED',
  progressPercent: 75,

  // TEMP MOCK: Replace if the complete specification
  // provides a different subtitle.
  subtitle: 'Monitor your required OJT documents and verification progress.',

  curriculum: 'BSCS Practicum 411',
  hoursTarget: 500
};


/* ========================================
   COMPLETION CARD
======================================== */

// TEMP MOCK
export const mockRequirementCompletion: RequirementCompletion = {
  academicYear: 'AY 2024-2025',
  completed: 6,
  total: 8,
  actionNeeded: 2,
  status: 'In Progress',
  minimumThreshold: 100,
  stage: 'Pre-Deployment Clearances'
};


/* ========================================
   REQUIREMENT LIST
======================================== */

// TEMP MOCK
// The dates, document IDs, descriptions and submission notes
// below are placeholders because the supplied Stage 6.4 excerpt
// does not include their exact example values.

export const mockRequirements: RequirementRecord[] = [
  {
    id: 'REQ-001',
    number: 1,
    title: 'Student Information Sheet',
    category: 'Student Information',
    description: 'Student information document for OJT record verification.',
    icon: 'assignment_ind',
    status: 'Verified',
    submittedDate: '—',
    submissionNote: 'Temporary sample entry',
    documentId: '—'
  },
  {
    id: 'REQ-002',
    number: 2,
    title: 'Medical Certificate',
    category: 'Mandatory Clearance',
    description: 'Medical certificate submitted for pre-deployment clearance.',
    icon: 'medical_services',
    status: 'Verified',
    submittedDate: '—',
    submissionNote: 'Temporary sample entry',
    documentId: '—'
  },
  {
    id: 'REQ-003',
    number: 3,
    title: "Parent's Consent Form",
    category: 'Mandatory Clearance',
    description: 'Parent or guardian consent document for OJT participation.',
    icon: 'family_restroom',
    status: 'Verified',
    submittedDate: '—',
    submissionNote: 'Temporary sample entry',
    documentId: '—'
  },
  {
    id: 'REQ-004',
    number: 4,
    title: 'Resume / Curriculum Vitae',
    category: 'Personal Document',
    description: 'Updated resume or curriculum vitae for internship records.',
    icon: 'description',
    status: 'Verified',
    submittedDate: '—',
    submissionNote: 'Temporary sample entry',
    documentId: '—'
  },
  {
    id: 'REQ-005',
    number: 5,
    title: 'Certificate of Registration',
    category: 'Academic Document',
    description: 'Certificate of Registration for the applicable academic term.',
    icon: 'school',
    status: 'Verified',
    submittedDate: '—',
    submissionNote: 'Temporary sample entry',
    documentId: '—'
  },
  {
    id: 'REQ-006',
    number: 6,
    title: 'Insurance Document',
    category: 'Mandatory Clearance',
    description: 'Insurance document required for OJT deployment processing.',
    icon: 'health_and_safety',
    status: 'Verified',
    submittedDate: '—',
    submissionNote: 'Temporary sample entry',
    documentId: '—'
  },
  {
    id: 'REQ-007',
    number: 7,
    title: 'Endorsement Letter',
    category: 'Institutional Document',
    description: 'Institutional endorsement letter required for the host training establishment.',
    icon: 'approval',
    status: 'Not Submitted',
    submittedDate: '—',
    submissionNote: 'No document submitted',
    documentId: '—',
    actionRequired: 'Action Required'
  },
  {
    id: 'REQ-008',
    number: 8,
    title: 'Company Acceptance Letter',
    category: 'Company Document',
    description: 'Acceptance letter issued by the selected host training establishment.',
    icon: 'business_center',
    status: 'Pending Review',
    submittedDate: '—',
    submissionNote: 'Awaiting coordinator review',
    documentId: '—'
  }
];


/* ========================================
   ASSISTANCE CARD
======================================== */

// TEMP MOCK
export const mockRequirementAssistance: RequirementAssistance = {
  title: 'Need Assistance with your Endorsement Letter?',
  description: 'The OJT office processes letters every Tuesday and Thursday.',
  schedule: 'processes letters every Tuesday and Thursday',
  buttonLabel: 'Submit Request'
};


/* ========================================
   REQUIREMENT DETAIL VIEW
======================================== */

// TEMP MOCK
// Item 2 is used as the example detail view.
// Coordinator name, date and remarks are placeholders.

export const mockRequirementDetail: RequirementDetail = {
  requirementId: 'REQ-002',
  itemLabel: 'Item 2 of 8',
  category: 'Mandatory Clearance',
  documentId: '—',
  title: 'Medical Certificate',
  icon: 'medical_services',
  status: 'Verified',
  description:
    'Medical certificate submitted for pre-deployment clearance.',
  evaluationStatus: 'Verified',
  evaluationNote:
    'Other possible evaluation states include Pending Review and Not Submitted.',
  dateChecked: '—',
  coordinatorName: '—',
  remarks:
    'No coordinator remarks supplied in the available Stage 6.4 excerpt.'
};
