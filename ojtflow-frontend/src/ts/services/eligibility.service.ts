import { ENV } from '../core/env';

import {
  mockEligibilityPage,
  mockEligibilityDetails,
  mockEmptyEligibilityRecords,
} from '../mocks/eligibility.mock';

const delay = (ms = 250): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

async function getMockData<T>(data: T): Promise<T> {
  if (!ENV.useMocks) {
    throw new Error(
      'Eligibility API integration is not available yet.',
    );
  }

  await delay();
  return clone(data);
}

export async function getEligibilityPage() {
  return getMockData(mockEligibilityPage);
}

export async function getEligibilityDetails() {
  return getMockData(mockEligibilityDetails);
}

export async function getEmptyEligibilityRecords() {
  return getMockData(mockEmptyEligibilityRecords);
}