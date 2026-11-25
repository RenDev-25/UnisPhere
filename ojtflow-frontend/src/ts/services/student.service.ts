
import { ENV } from '../core/env';

import { mockStudentDashboard } from '../mocks/student.mock';

import {
  mockCoordinatorStudentsPage,
  coordinatorStudentDetailsMock,
} from '../mocks/coordinator-students.mock';

import type { StudentDashboardData } from '../types/student.types';
import type { User } from '../types/user.types';

const STUDENT_ACCOUNTS_KEY = 'ojtflow_student_accounts';

const delay = (ms = 250): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

async function getMockData<T>(data: T): Promise<T> {
  if (!ENV.useMocks) {
    throw new Error(
      'Student API integration is not available yet.',
    );
  }

  await delay();

  return clone(data);
}

interface StoredStudentAccount {
  user: User;
  passwordHash: string;
}

function getRegisteredStudents(): User[] {
  try {
    const raw = localStorage.getItem(STUDENT_ACCOUNTS_KEY);

    if (!raw) return [];

    const accounts = JSON.parse(raw) as StoredStudentAccount[];

    if (!Array.isArray(accounts)) return [];

    return accounts
      .filter(
        (account) =>
          account?.user?.portal === 'student' &&
          typeof account.user.email === 'string',
      )
      .map((account) => account.user);

  } catch (error) {
    console.error(
      'Unable to read registered student accounts:',
      error,
    );

    return [];
  }
}

// =====================================================
// STUDENT DASHBOARD
// =====================================================

export async function getStudentProfile():
  Promise<StudentDashboardData['student']> {

  const dashboard = await getMockData(mockStudentDashboard);

  return dashboard.student;
}

// =====================================================
// COORDINATOR STUDENT RECORDS
// =====================================================

export async function getCoordinatorStudents() {

  const data = await getMockData(
    mockCoordinatorStudentsPage,
  );

  const registeredStudents = getRegisteredStudents();

  const recordsByEmail = new Map(
    data.records.map((student) => [
      student.email.trim().toLowerCase(),
      student,
    ]),
  );

  for (const user of registeredStudents) {

    const email = user.email.trim().toLowerCase();

    // Prevent duplicate records.
    if (recordsByEmail.has(email)) {
      continue;
    }

    recordsByEmail.set(email, {
      id: user.id,

      fullName: user.name,

      email: user.email,

      studentNumber: user.identifier || 'Not provided',

      program: user.program || 'Not provided',

      eligibilityStatus: 'Not Yet Eligible',

      ojtStatus: 'Not Started',
    });
  }

  const records = Array.from(recordsByEmail.values());

  const eligibleStudents = records.filter(
    (student) =>
      student.eligibilityStatus === 'Eligible',
  ).length;

  const notYetEligibleStudents = records.filter(
    (student) =>
      student.eligibilityStatus === 'Not Yet Eligible',
  ).length;

  const programs = [
    ...new Set(
      records.map((student) => student.program),
    ),
  ];

  return {
    ...data,

    summary: {
      totalStudents: records.length,
      eligibleStudents,
      notYetEligibleStudents,
    },

    recordsCard: {
      ...data.recordsCard,
      totalChip: `${records.length} Students`,
      syncNote: 'Registered student accounts synchronized',
    },

    programs,

    records,
  };
}

// =====================================================
// COORDINATOR STUDENT DETAILS
// =====================================================

export async function getCoordinatorStudentDetails() {
  return getMockData(coordinatorStudentDetailsMock);
}
