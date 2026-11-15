// src/ts/types/deployment.types.ts

export type DeploymentProgress =
  | 'application-accepted'
  | 'placement-confirmed'
  | 'deployed';

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
  ojtCoordinator: string | null;
  requiredOjtHours: number | null;
}

export interface DeploymentPlacement {
  status: DeploymentStatus;
  company: CompanyAssignment;
  information: DeploymentInformation;
  progress: DeploymentProgress;
}

export interface DeploymentData {
  heading: DeploymentHeading;
  placement: DeploymentPlacement | null;
}