import { ENV } from '../core/env';

import { mockStudentDashboard } from '../mocks/student.mock';

import {
  mockCoordinatorStudentsPage,
  coordinatorStudentDetailsMock,
} from '../mocks/coordinator-students.mock';

import type { StudentDashboardData } from '../types/student.types';

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

export async function getStudentProfile(): Promise<StudentDashboardData['student']> {
  const dashboard = await getMockData(mockStudentDashboard);

  return dashboard.student;
}

export async function getCoordinatorStudents() {
  return getMockData(mockCoordinatorStudentsPage);
}

export async function getCoordinatorStudentDetails() {
  return getMockData(coordinatorStudentDetailsMock);
}