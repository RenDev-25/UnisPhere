
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
// Values not specified in the Stage 7.4 example are left as placeholders.
export const coordinatorStudentDetailsMock: CoordinatorStudentDetails = {
  studentNumber: '22-00125',
  fullName: 'Student name not provided',
  section: 'BSIT-3A',
  program: 'BSIT',
  yearLevel: 'Not provided',
  institutionalEmail: 'Not provided',
  contactNumber: '09XX XXX XXXX',
  eligibilityStatus: 'Eligible',
  academicYear: '2026-2027',
  approvedRequirements: 6,
  totalRequirements: 8,
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

  summary: {
    totalStudents: 5,
    eligibleStudents: 3,
    notYetEligibleStudents: 2,
  },

  recordsCard: {
    title: 'Student Records',
    totalChip: '5 Students',
    syncNote: 'Mock data',
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

  records: [
    {
      id: 'STU-001',
      fullName: 'Juan Dela Cruz',
      email: 'juan.delacruz@batstate-u.edu.ph',
      studentNumber: '22-12345',
      program: 'BS Information Technology',
      eligibilityStatus: 'Eligible',
      ojtStatus: 'In Progress',
    },
    {
      id: 'STU-002',
      fullName: 'Maria Santos',
      email: 'maria.santos@batstate-u.edu.ph',
      studentNumber: '22-12346',
      program: 'BS Information Technology',
      eligibilityStatus: 'Eligible',
      ojtStatus: 'Not Started',
    },
    {
      id: 'STU-003',
      fullName: 'Pedro Reyes',
      email: 'pedro.reyes@batstate-u.edu.ph',
      studentNumber: '22-12347',
      program: 'BS Computer Science',
      eligibilityStatus: 'Not Yet Eligible',
      ojtStatus: 'Not Started',
    },
    {
      id: 'STU-004',
      fullName: 'Ana Garcia',
      email: 'ana.garcia@batstate-u.edu.ph',
      studentNumber: '22-12348',
      program: 'BS Information Technology',
      eligibilityStatus: 'Eligible',
      ojtStatus: 'Completed',
    },
    {
      id: 'STU-005',
      fullName: 'Mark Ramos',
      email: 'mark.ramos@batstate-u.edu.ph',
      studentNumber: '22-12349',
      program: 'BS Computer Science',
      eligibilityStatus: 'Not Yet Eligible',
      ojtStatus: 'Not Started',
    },
  ],
};
