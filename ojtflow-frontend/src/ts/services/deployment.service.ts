import { ENV } from '../core/env';

import { mockDeployment } from '../mocks/deployment.mock';

import type { DeploymentData } from '../types/deployment.types';

const delay = (ms = 250): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

export async function getMyDeployment(): Promise<DeploymentData> {
  if (!ENV.useMocks) {
    throw new Error(
      'Deployment API integration is not available yet.',
    );
  }

  await delay();

  return JSON.parse(
    JSON.stringify(mockDeployment),
  ) as DeploymentData;
}