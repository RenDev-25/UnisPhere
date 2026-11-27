import { ENV } from '../core/env';
import type { DeploymentData } from '../types/deployment.types';

const DEPLOYMENT_KEY = 'ojtflow_deployments';
const APPLICATION_KEY = 'ojtflow_applications';

export interface StoredDeployment {
  id: string;
  studentId: string;
  createdAt?: string;
  status: 'Placement Confirmed' | 'Deployed' | 'Not Yet Deployed' | 'Undeployed';
  companyId?: string;
  companyName?: string;
  location?: string;
  applicationId?: string;
  program?: string;
  deploymentDate?: string;
  deploymentStartDate?: string;
  deploymentEndDate?: string;
  companySupervisor?: string;
  requiredOjtHours?: number;
  accumulatedOjtHours?: number;
  undeployedAt?: string;
  undeploymentRemarks?: string;
}

interface StoredApplicationProgress {
  id: string;
  studentId: string;
  companyId: string;
  companyName: string;
  location?: string;
  academicProgram?: string;
  status: string;
  supervisorDecision?: string;
  deploymentStatus?: string;
  deploymentRequestedAt?: string;
  supervisorDecisionAt?: string;
  createdAt?: string;
  dateApplied?: string;
  coordinatorUndeployed?: boolean;
  coordinatorUndeploymentRemarks?: string;
}

function readArray<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    return [];
  }
}

export function getStoredDeployments(): StoredDeployment[] {
  return readArray<StoredDeployment>(DEPLOYMENT_KEY);
}

function duration(start?: string, end?: string): string | null {
  if (!start || !end) return null;
  const days = Math.floor((new Date(`${end}T00:00:00`).getTime() - new Date(`${start}T00:00:00`).getTime()) / 86400000) + 1;
  return Number.isFinite(days) && days > 0 ? `${days} calendar days` : null;
}

function latestByDate<T extends { createdAt?: string; dateApplied?: string; deploymentRequestedAt?: string; supervisorDecisionAt?: string; deploymentStartDate?: string; deploymentDate?: string; undeployedAt?: string }>(items: T[]): T | undefined {
  const eventTime = (item: T): number => {
    const values = [item.createdAt, item.dateApplied, item.deploymentRequestedAt, item.supervisorDecisionAt, item.deploymentStartDate, item.deploymentDate, item.undeployedAt];
    return Math.max(0, ...values.filter((value): value is string => Boolean(value)).map(value => Date.parse(value)).filter(Number.isFinite));
  };
  return [...items].sort((a, b) => eventTime(b) - eventTime(a))[0];
}

export async function getMyDeployment(): Promise<DeploymentData> {
  if (!ENV.useMocks) throw new Error('Deployment API integration is not available yet.');

  const { getSession } = await import('../core/session');
  const user = getSession()?.user;
  const records = user?.portal === 'student'
    ? getStoredDeployments().filter(item => item.studentId === user.id)
    : [];
  const applications = user?.portal === 'student'
    ? readArray<StoredApplicationProgress>(APPLICATION_KEY).filter(item => item.studentId === user.id && item.status === 'Accepted' && (!item.supervisorDecision || item.supervisorDecision === 'Accepted'))
    : [];

  const active = records.filter(item => item.status === 'Deployed');
  const activeDeployment = latestByDate(active);
  const latestDeployment = latestByDate(records);
  const acceptedApplication = latestByDate(applications);

  // Resolve the current placement from deployment records first, then from the
  // accepted application workflow when no official deployment exists. Company
  // application status is never treated as deployment status by itself.
  const requestPending = Boolean(acceptedApplication && acceptedApplication.deploymentStatus === 'Requested');
  const placementApproved = Boolean(latestDeployment && ['Placement Confirmed', 'Not Yet Deployed'].includes(latestDeployment.status));
  const hasUndeploymentHistory = Boolean(latestDeployment && latestDeployment.status === 'Undeployed');

  let progress: 'not-yet-requested' | 'deployment-pending' | 'placement-confirmed' | 'deployed' | 'undeployed';
  let source: StoredDeployment | StoredApplicationProgress | undefined;

  if (activeDeployment) {
    progress = 'deployed';
    source = activeDeployment;
  } else if (placementApproved) {
    progress = 'placement-confirmed';
    source = latestDeployment;
  } else if (requestPending) {
    progress = 'deployment-pending';
    source = acceptedApplication;
  } else if (hasUndeploymentHistory) {
    progress = 'undeployed';
    source = latestDeployment;
  } else if (acceptedApplication) {
    progress = 'not-yet-requested';
    source = acceptedApplication;
  } else {
    source = latestDeployment;
    progress = latestDeployment ? 'undeployed' : 'not-yet-requested';
  }

  const hasPlacement = Boolean(source || latestDeployment || acceptedApplication);
  const isUndeployed = progress === 'undeployed';
  const companyName = source?.companyName || 'Not assigned';
  const companyLocation = source && 'location' in source ? source.location || null : null;
  const start = source && 'deploymentStartDate' in source
    ? source.deploymentStartDate || source.deploymentDate || ''
    : '';

  const history = records.map(item => ({
    id: item.id,
    companyName: item.companyName || 'Company not recorded',
    location: item.location || null,
    deploymentStartDate: item.deploymentStartDate || item.deploymentDate || null,
    deploymentEndDate: item.deploymentEndDate || null,
    status: item.status,
    undeployedAt: item.undeployedAt || null,
    undeploymentRemarks: item.undeploymentRemarks || null,
    accumulatedOjtHours: Number(item.accumulatedOjtHours || 0),
  }));

  const activeDeployments = active.map(item => ({
    companyName: item.companyName || 'Not assigned',
    location: item.location || null,
    deploymentStartDate: item.deploymentStartDate || item.deploymentDate || null,
    deploymentEndDate: item.deploymentEndDate || null,
    applicationId: item.applicationId || null,
  }));

  const statusLabel = progress === 'deployed' ? 'Deployed'
    : progress === 'placement-confirmed' ? 'Approved'
      : progress === 'deployment-pending' ? 'Pending'
        : progress === 'undeployed' ? 'Undeployed'
          : 'Not Yet Requested';

  const statusMessage = progress === 'deployed'
    ? 'You have an active official OJT deployment confirmed by the OJT Coordinator.'
    : progress === 'placement-confirmed'
      ? 'Your deployment request has been approved. Follow the Coordinator instructions for your official deployment schedule.'
      : progress === 'deployment-pending'
        ? 'Your deployment request has been submitted and is awaiting Coordinator review.'
        : progress === 'undeployed'
          ? 'Your previous deployment has ended. Your accepted company application remains valid; you may submit another deployment request through My Applications.'
          : 'Your company application has been accepted. Submit a deployment request through My Applications when you are ready.';

  const remarks = isUndeployed && source && 'undeploymentRemarks' in source
    ? source.undeploymentRemarks || null
    : isUndeployed && acceptedApplication?.coordinatorUndeploymentRemarks
      ? acceptedApplication.coordinatorUndeploymentRemarks
      : null;

  return {
    heading: {
      title: 'My Deployment',
      subtitle: 'View your official OJT company assignment and deployment schedule.',
    },
    deployments: activeDeployments,
    history,
    placement: hasPlacement ? {
      status: { title: 'Deployment Status', status: statusLabel, message: statusMessage },
      company: {
        companyName: isUndeployed ? `${companyName} (Previous Assignment)` : companyName,
        location: isUndeployed ? null : companyLocation,
      },
      information: {
        academicProgram: source && 'academicProgram' in source ? source.academicProgram || null : source && 'program' in source ? source.program || null : null,
        companySupervisor: isUndeployed || !source || !('companySupervisor' in source) ? null : source.companySupervisor || null,
        deploymentDate: isUndeployed || !start ? null : start,
        deploymentEndDate: isUndeployed || !source || !('deploymentEndDate' in source) ? null : source.deploymentEndDate || null,
        deploymentDuration: isUndeployed || !source || !('deploymentEndDate' in source) ? null : duration(start, source.deploymentEndDate),
        ojtCoordinator: 'OJT Coordinator',
        requiredOjtHours: 500,
        accumulatedOjtHours: source && 'accumulatedOjtHours' in source ? Number(source.accumulatedOjtHours || 0) : 0,
      },
      progress,
      placementStatus: statusLabel,
      previousDeploymentEnded: isUndeployed,
      undeploymentRemarks: remarks,
    } : null,
  } as DeploymentData;
}
