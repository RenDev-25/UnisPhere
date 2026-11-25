
/* =========================================================
   OJTFlow — Coordinator Student Mock Data
   TEMP MOCK — Remove during API integration
========================================================= */

export interface CoordinatorStudentDetails {
  studentNumber: string;
  fullName: string;
  section: string;
  program: string;
  yearLevel: string;
  institutionalEmail: string;
  contactNumber: string;
  eligibilityStatus: string;
  academicYear: string;
  approvedRequirements: number;
  totalRequirements: number;
  applicationStatus: string;
  deploymentStatus: string;
}

// TEMP MOCK
// Neutral placeholder values.
// Actual student details should come from registered accounts.
export const coordinatorStudentDetailsMock: CoordinatorStudentDetails = {
  studentNumber: 'Not provided',
  fullName: 'Not provided',
  section: 'Not provided',
  program: 'Not provided',
  yearLevel: 'Not provided',
  institutionalEmail: 'Not provided',
  contactNumber: 'Not provided',
  eligibilityStatus: 'Not provided',
  academicYear: '2026-2027',
  approvedRequirements: 0,
  totalRequirements: 0,
  applicationStatus: 'Not provided',
  deploymentStatus: 'Not provided',
};


/* =========================================================
   STAGE 7.3 — COORDINATOR STUDENT MANAGEMENT MOCK
========================================================= */

export interface CoordinatorStudentListRecord {
  id: string;
  fullName: string;
  email: string;
  studentNumber: string;
  program: string;
  eligibilityStatus: string;
  ojtStatus: string;
}

export interface CoordinatorStudentsPageMock {
  heading: {
    title: string;
    subtitle: string;
    cohortPill: string;
  };

  summary: {
    totalStudents: number;
    eligibleStudents: number;
    notYetEligibleStudents: number;
  };

  recordsCard: {
    title: string;
    totalChip: string;
    syncNote: string;
  };

  programs: string[];
  eligibilityStatuses: string[];
  ojtStatuses: string[];

  records: CoordinatorStudentListRecord[];
}

export const mockCoordinatorStudentsPage: CoordinatorStudentsPageMock = {
  heading: {
    title: 'Student Management',
    subtitle: 'Manage student records and monitor OJT eligibility.',
    cohortPill: 'A.Y. 2026-2027',
  },

  // No hardcoded sample students.
  summary: {
    totalStudents: 0,
    eligibleStudents: 0,
    notYetEligibleStudents: 0,
  },

  recordsCard: {
    title: 'Student Records',
    totalChip: '0 Students',
    syncNote: 'Registered student accounts only',
  },

  programs: [
    'BS Information Technology',
    'BS Computer Science',
  ],

  eligibilityStatuses: [
    'Eligible',
    'Not Yet Eligible',
  ],

  ojtStatuses: [
    'Not Started',
    'In Progress',
    'Completed',
  ],

  // Student records must come from actual registrations.
  records: [],
};
