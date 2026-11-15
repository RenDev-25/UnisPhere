// src/ts/mocks/deployment.mock.ts

import type {
  DeploymentData
} from '../types/deployment.types';


// TEMP MOCK
export const mockDeployment: DeploymentData = {

  heading: {
    title: 'My Deployment',
    subtitle:
      'View your OJT placement information and deployment status.'
  },

  placement: {

    status: {
      title: 'Deployment Status',
      status: 'Placement Confirmed',
      message:
        'Your OJT placement has been confirmed by the OJT Coordinator.'
    },

    company: {
      companyName:
        'Businessaide System and Accounting Solutions Co.',
      location: null
    },

    information: {
      academicProgram: null,
      companySupervisor: null,
      deploymentDate: null,
      ojtCoordinator: null,
      requiredOjtHours: null
    },

    progress: 'placement-confirmed'

  }

};