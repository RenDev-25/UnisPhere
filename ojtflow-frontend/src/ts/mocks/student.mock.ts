// Empty presentation defaults. Live student identity and activity come from the signed-in account and stored records.
import type { StudentDashboardData } from '../types/student.types';

export const mockStudentDashboard: StudentDashboardData = {
  student: {
    name: '',
    firstName: '',
    studentNumber: '',
    college: '',
    program: '',
    academicYear: '',
  },
  eligibility: 'For Review',
  deploymentStatus: 'Not Yet Deployed',
  applications: { total: 0, underReview: 0, accepted: 0, rejected: 0, pending: 0, cancelled: 0 },
  requirements: { total: 0, completed: 0, pendingVerification: 0, forRevision: 0 },
};
