
import { ENV } from '../core/env';

import {
  mockRequirementHeading,
  mockRequirementCompletion,
  mockRequirements,
  mockRequirementDetail
} from '../mocks/requirement.mock';

import type {
  RequirementRecord
} from '../types/requirement.types';

const delay = (ms = 250): Promise<void> =>
  new Promise(resolve => window.setTimeout(resolve, ms));

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

async function getMockData<T>(data: T): Promise<T> {

  if (!ENV.useMocks) {
    throw new Error(
      'Requirement API integration is not available yet.'
    );
  }

  await delay();

  return clone(data);
}

export async function getStudentRequirements() {

  return getMockData({
    heading: mockRequirementHeading,
    completion: mockRequirementCompletion,
    records: mockRequirements as RequirementRecord[],
    detail: mockRequirementDetail
  });
}

export async function getRequirementDetails() {

  return getMockData(mockRequirementDetail);
}
