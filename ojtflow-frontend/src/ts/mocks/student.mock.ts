// src/ts/mocks/student.mock.ts

// TEMP MOCK

import type { StudentDashboardData } from '../types/student.types';

export const mockStudentDashboard: StudentDashboardData = {

  student: {
    name: 'Juan Dela Cruz',
    firstName: 'Juan',
    studentNumber: '22-12345',
    college: 'College of Informatics and Computing Sciences',
    program: 'BS Information Technology',
    academicYear: '2026-2027'
  },

  eligibility: 'Eligible',

  deploymentStatus: 'Not Yet Deployed',

  applications: {
    total: 4,
    underReview: 2,
    accepted: 1,
    rejected: 0,
    pending: 1
  },

  requirements: {
    total: 8,
    completed: 6,
    pendingVerification: 1,
    forRevision: 1
  }

};