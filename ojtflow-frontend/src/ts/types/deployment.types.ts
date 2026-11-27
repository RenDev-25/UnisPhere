// src/ts/types/deployment.types.ts

export type DeploymentProgress =
  | 'application-accepted'
  | 'placement-confirmed'
  | 'deployed'
  | 'undeployed';

export interface DeploymentHeading {
  title: string;
  subtitle: string;
}

export interface DeploymentStatus {
  title: string;
  status: string;
  message: string;
}

export interface CompanyAssignment {
  companyName: string;
  location: string | null;
}

export interface DeploymentInformation {
  academicProgram: string | null;
  companySupervisor: string | null;
  deploymentDate: string | null;
  deploymentEndDate?: string | null;
  deploymentDuration?: string | null;
  ojtCoordinator: string | null;
  requiredOjtHours: number | null;
  accumulatedOjtHours?: number | null;
}

export interface DeploymentPlacement {
  status: DeploymentStatus;
  company: CompanyAssignment;
  information: DeploymentInformation;
  progress: DeploymentProgress;
  placementStatus?: string;
  previousDeploymentEnded?: boolean;
  undeploymentRemarks?: string | null;
}

export interface DeploymentData {
  heading: DeploymentHeading;
  placement: DeploymentPlacement | null;
  deployments?: Array<{ companyName: string; location: string | null; deploymentStartDate: string | null; deploymentEndDate: string | null; applicationId: string | null }>;
  history?: Array<{ id: string; companyName: string; location: string | null; deploymentStartDate: string | null; deploymentEndDate: string | null; status: string; undeployedAt: string | null; undeploymentRemarks?: string | null; accumulatedOjtHours: number }>;
}