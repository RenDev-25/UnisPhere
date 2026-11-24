import { ENV } from '../core/env';

import {
  mockRequirementHeading,
  mockRequirementCompletion,
  mockRequirements,
  mockRequirementAssistance,
  mockRequirementDetail,
} from '../mocks/requirement.mock';

const delay = (ms = 250): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

async function getMockData<T>(data: T): Promise<T> {
  if (!ENV.useMocks) {
    throw new Error(
      'Requirement API integration is not available yet.',
    );
  }

  await delay();
  return clone(data);
}

export async function getStudentRequirements() {
  // Keep your existing mock/API logic.

  return {
    heading: mockRequirementHeading,
    completion: mockRequirementCompletion,
    records: mockRequirements,
    assistance: mockRequirementAssistance,
    detail: mockRequirementDetail
  };
}

export async function getRequirementDetails() {
  return getMockData(mockRequirementDetail);
}