
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
