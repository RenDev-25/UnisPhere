// src/ts/types/student.types.ts

export interface StudentDashboardData {
  student: {
    name: string;
    firstName: string;
    studentNumber: string;
    college: string;
    program: string;
    academicYear: string;
  };

  eligibility: string;

  deploymentStatus: string;

  applications: {
    total: number;
    underReview: number;
    accepted: number;
    rejected: number;
    pending: number;
  };

  requirements: {
    total: number;
    completed: number;
    pendingVerification: number;
    forRevision: number;
  };
}