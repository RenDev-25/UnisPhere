// No seeded deployment records. The deployment service supplies live records or an empty state.
import type { DeploymentData } from '../types/deployment.types';

export const mockDeployment: DeploymentData = {
  heading: { title: 'My Deployment', subtitle: 'View your OJT placement information and deployment status.' },
  placement: null,
};
