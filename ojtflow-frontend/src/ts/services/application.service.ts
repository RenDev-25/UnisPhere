import { ENV } from '../core/env';

import {
  mockApplicationHeading,
  mockApplicationFilters,
  mockApplications,
  mockApplicationEmptyState,
  mockApplicationPlacementNotice,
  mockCoordinatorApplications,
  mockApplicationDetails,
} from '../mocks/application.mock';

const delay = (ms = 250): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

async function getMockData<T>(data: T): Promise<T> {
  if (!ENV.useMocks) {
    throw new Error(
      'Application API integration is not available yet.',
    );
  }

  await delay();
  return clone(data);
}

export async function getStudentApplications() {
  return getMockData({
    heading: mockApplicationHeading,
    filters: mockApplicationFilters,
    records: mockApplications,
    emptyState: mockApplicationEmptyState,
    placementNotice: mockApplicationPlacementNotice,
  });
}

export async function getCoordinatorApplications() {
  return getMockData(mockCoordinatorApplications);
}

export async function getApplicationDetails() {
  return getMockData(mockApplicationDetails);
}