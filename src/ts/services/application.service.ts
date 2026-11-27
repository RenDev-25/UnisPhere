import { ENV } from '../core/env';
import { getSession } from '../core/session';
import { getCompanyById, adjustCompanyOccupiedSlots } from './company.service';
import { createNotifications } from './notification.service';
import { mockCoordinator } from '../mocks/user.mock';
import { mockApplicationHeading, mockApplicationFilters, mockApplicationEmptyState, mockApplicationPlacementNotice } from '../mocks/application.mock';
import type { ApplicationRecord, CoordinatorApplicationStatus } from '../types/application.types';

const STORAGE_KEY = 'ojtflow_applications';
export type StoredApplication = ApplicationRecord & {
  studentId: string; studentName: string; studentNumber: string; studentEmail: string; createdAt?: string;
  yearLevel: string; verificationStatus: string; coordinatorRemarks: string;
  resumeFileName: string; resumeMimeType: 'application/pdf'; resumeDataUrl: string;
  resumeSize: number; supervisorRemarks: string; deploymentRequestedAt?: string; deploymentStatus?: 'Not Requested'|'Requested'|'Deployed'|'Undeployed'; studentAcceptedAt?: string; supervisorDecisionAt?: string; supervisorDecision?: 'Accepted' | 'Rejected'; supervisorDecisionVersion?: number; deploymentRequestVersion?: number; coordinatorUndeployed?: boolean; coordinatorUndeployedAt?: string; coordinatorUndeploymentRemarks?: string;
};
const delay = (ms = 100) => new Promise<void>(resolve => window.setTimeout(resolve, ms));
function readAll(): StoredApplication[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(value)) return [];
    const valid = value.filter((item): item is StoredApplication => Boolean(item && typeof item === 'object' && typeof item.id === 'string' && typeof item.studentId === 'string' && typeof item.companyId === 'string'));
    // Migrate records written by the earlier undeployment implementation. It
    // incorrectly changed an accepted company application to Cancelled and
    // marked the application itself Undeployed. Coordinator undeployment is a
    // deployment lifecycle event only, so restore the accepted application
    // while retaining its undeployment metadata and separate deployment history.
    let migrated = false;
    for (let index = 0; index < valid.length; index += 1) {
      const item = valid[index];
      if (item.coordinatorUndeployed === true && item.supervisorDecision === 'Accepted' && item.status === 'Cancelled' && item.deploymentStatus === 'Undeployed') {
        valid[index] = { ...item, status: 'Accepted', deploymentStatus: 'Not Requested', remarks: item.coordinatorUndeploymentRemarks ? `Previous deployment ended by the OJT Coordinator: ${item.coordinatorUndeploymentRemarks}` : 'Previous deployment ended by the OJT Coordinator.' };
        migrated = true;
      }
    }
    // Preserve genuinely cancelled applications as history, but collapse
    // duplicate active student/company submissions so one active application remains possible.
    const closed = valid.filter(item => item.status === 'Cancelled' || item.deploymentStatus === 'Undeployed');
    const activeByPair = new Map<string, StoredApplication>();
    for (const item of valid.filter(item => item.status !== 'Cancelled' && item.deploymentStatus !== 'Undeployed')) {
      const pair = `${item.studentId}::${item.companyId}`;
      const previous = activeByPair.get(pair);
      if (!previous || String(item.dateApplied || '') >= String(previous.dateApplied || '')) activeByPair.set(pair, item);
    }
    const records = [...closed, ...activeByPair.values()];
    if (migrated || records.length !== valid.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return records;
  } catch { return []; }
}
function saveAll(records: StoredApplication[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
function requireStudent() {
  const user = getSession()?.user;
  if (!user || user.portal !== 'student') throw new Error('Please sign in using a student account before submitting or viewing applications.');
  return user;
}
function toCoordinatorStatus(status: ApplicationRecord['status']): CoordinatorApplicationStatus {
  return status === 'Pending Decision' ? 'Pending' : status;
}
function readPdfAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Unable to read the PDF file.'));
    reader.onerror = () => reject(new Error('Unable to read the PDF file.'));
    reader.readAsDataURL(file);
  });
}


export async function getStudentApplicationForCompany(companyId: string): Promise<StoredApplication | null> {
  const user = requireStudent();
  const matches = readAll()
    .filter(item => item.studentId === user.id && item.companyId === companyId)
    .sort((a, b) => String(b.dateApplied || '').localeCompare(String(a.dateApplied || '')) || String(b.id).localeCompare(String(a.id)));
  // Prefer the current non-cancelled application. If none exists, return the
  // newest historical record so the directory can explain cancellation and
  // offer a fresh application without reusing the old resume snapshot.
  return matches.find(item => item.status !== 'Cancelled') || matches[0] || null;
}

export async function submitCompanyApplication(companyId: string, resume: File): Promise<StoredApplication> {
  if (!ENV.useMocks) throw new Error('Application API integration is not available yet.');
  const user = requireStudent();
  if (!(resume instanceof File)) throw new Error('Please upload your resume in PDF format before applying.');
  if (resume.type !== 'application/pdf' || !resume.name.toLowerCase().endsWith('.pdf')) throw new Error('Resume must be a PDF file.');
  if (resume.size < 8) throw new Error('The selected PDF appears to be empty or invalid.');
  if (resume.size > 2 * 1024 * 1024) throw new Error('Resume must not exceed 2 MB.');
  const signature = new Uint8Array(await resume.slice(0, 5).arrayBuffer());
  if (new TextDecoder().decode(signature) !== '%PDF-') throw new Error('The uploaded file is not a valid PDF document.');
  const resumeDataUrl = await readPdfAsDataUrl(resume);
  const company = await getCompanyById(companyId);
  if (!company || !company.ownerId || company.published !== true || company.status !== 'Active' || company.availableSlots <= 0) throw new Error('This company is no longer accepting applications.');
  const records = readAll();
  if (records.some(item => item.studentId === user.id && item.companyId === companyId && item.status !== 'Cancelled')) throw new Error('You already have an active application for this company.');
  const record: StoredApplication = {
    id: `APP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString(), studentId: user.id,
    studentName: user.name, studentNumber: user.identifier || 'Not provided', studentEmail: user.email,
    companyId, initials: company.initials, companyName: company.name, location: company.location,
    dateApplied: new Date().toISOString().slice(0, 10), academicProgram: user.program || 'Not provided',
    status: 'Pending Decision', remarks: 'Your application has been submitted and is awaiting company supervisor review.',
    yearLevel: 'Not provided', verificationStatus: 'Not yet verified', coordinatorRemarks: '',
    resumeFileName: resume.name, resumeMimeType: 'application/pdf', resumeDataUrl,
    resumeSize: resume.size, supervisorRemarks: '',
  };
  records.push(record); saveAll(records);
  createNotifications(`application-submitted:${record.id}`, [{ id: mockCoordinator.id, portal: 'coordinator' }, { id: String(company.ownerId), portal: 'supervisor' }], 'New student application', `${record.studentName} applied to ${record.companyName}.`);
  return record;
}
export async function getStudentApplications() {
  if (!ENV.useMocks) throw new Error('Application API integration is not available yet.');
  await delay(); const user = requireStudent();
  const records = readAll().filter(item => item.studentId === user.id).map(item=>({...item,deploymentStatus:item.deploymentStatus || 'Not Requested'})).sort((a,b) => b.dateApplied.localeCompare(a.dateApplied));
  return { heading: { ...mockApplicationHeading, totalLabel: `TOTAL APPLICATIONS: ${String(records.length).padStart(2,'0')}` }, filters: mockApplicationFilters, records, emptyState: mockApplicationEmptyState, placementNotice: mockApplicationPlacementNotice };
}
export async function getCoordinatorApplications() {
  if (!ENV.useMocks) throw new Error('Application API integration is not available yet.');
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required.');
  await delay(); const records = readAll().map(item => ({ id:item.id, studentName:item.studentName, studentNumber:item.studentNumber, academicProgram:item.academicProgram, companyName:item.companyName, applicationDate:item.dateApplied, status:toCoordinatorStatus(item.status) }));
  return { summary: { total:records.length, pending:records.filter(x=>x.status==='Pending').length, underReview:records.filter(x=>x.status==='Under Review').length, accepted:records.filter(x=>x.status==='Accepted').length, rejected:records.filter(x=>x.status==='Rejected').length }, records, totalRecords:records.length, pageSize:10 };
}
export async function getApplicationDetails(id: string) {
  if (!ENV.useMocks) throw new Error('Application API integration is not available yet.');
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required.');
  await delay(); const item = readAll().find(record => record.id === id);
  if (!item) throw new Error('Application not found. Return to Applications Management and select an existing application.');
  const company = await getCompanyById(item.companyId);
  return { header:{ backLabel:'Back to Applications', title:'Application Details', subtitle:'Review the submitted OJT application and record a decision.', academicYear:'A.Y. 2026–2027', statusLabel:item.status }, student:{ fullName:item.studentName, studentNumber:item.studentNumber, academicProgram:item.academicProgram, yearLevel:item.yearLevel, verificationStatus:item.verificationStatus }, application:{ applicationId:item.id, academicProgram:item.academicProgram, applicationDate:item.dateApplied, studentEmail:item.studentEmail }, company:{ companyName:item.companyName, accreditationLabel:'Partner Company', contactPerson:company?.contactName || 'Not provided', location:item.location, contactNumber:company?.contactPhone || 'Not provided' }, statusUpdate:{ initialStatus:toCoordinatorStatus(item.status), coordinatorRemarks:item.coordinatorRemarks, maxRemarksLength:1000 } };
}
export async function updateApplicationDecision(id: string, status: CoordinatorApplicationStatus, remarks: string): Promise<void> {
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required to update application records.');
  const records=readAll(); const index=records.findIndex(item=>item.id===id); if(index<0) throw new Error('Application not found.');
  const mapped: ApplicationRecord['status'] = status==='Pending' ? 'Pending Decision' : status;
  records[index]={...records[index], status:mapped, coordinatorRemarks:remarks.trim(), remarks:remarks.trim() || records[index].remarks}; saveAll(records);
  createNotifications(`coordinator-application-decision:${id}:${mapped}`, [{ id: records[index].studentId, portal: 'student' }], 'Application status updated', `The coordinator updated your application to ${mapped} for ${records[index].companyName}.`);
}
export async function cancelStudentApplication(applicationId: string): Promise<void> {
  const user = requireStudent();
  const records = readAll();
  const index = records.findIndex(item => item.id === applicationId && item.studentId === user.id);
  if (index < 0) throw new Error('Your application could not be found.');
  if (records[index].status === 'Cancelled') throw new Error('This application has already been cancelled.');
  if (records[index].deploymentStatus === 'Deployed') throw new Error('You cannot cancel an application that has already been deployed.');
  if (records[index].deploymentStatus === 'Requested') throw new Error('You cannot cancel an application while its deployment request is awaiting coordinator review.');
  // Only supervisor acceptance reserves a company slot. Pending applications
  // and rejected applications never change capacity when cancelled.
  if (records[index].supervisorDecision === 'Accepted') {
    await adjustCompanyOccupiedSlots(records[index].companyId, -1, records[index].id);
  }
  records[index] = {
    ...records[index], status: 'Cancelled', deploymentStatus: 'Not Requested',
    remarks: 'Application cancelled by the student.',
    supervisorRemarks: records[index].supervisorRemarks || '',
  };
  saveAll(records);
  const company = await getCompanyById(records[index].companyId);
  const recipients: Array<{ id: string; portal: 'coordinator' | 'supervisor' }> = [{ id: mockCoordinator.id, portal: 'coordinator' }];
  if (company?.ownerId) recipients.push({ id: company.ownerId, portal: 'supervisor' });
  createNotifications(`application-cancelled:${applicationId}`, recipients, 'Student application updated', `${records[index].studentName} cancelled the application for ${records[index].companyName}. ${records[index].supervisorDecision === 'Accepted' ? 'The reserved company slot has been released.' : 'No company slot was occupied.'}`);
}

export async function getCoordinatorApplicationCountsByCompany(): Promise<Record<string, number>> {
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required.');
  const counts: Record<string, Set<string>> = {};
  for (const item of readAll()) {
    if (item.status === 'Cancelled') continue;
    counts[item.companyId] ??= new Set<string>();
    counts[item.companyId].add(item.studentId);
  }
  return Object.fromEntries(Object.entries(counts).map(([companyId, students]) => [companyId, students.size]));
}

export function getAllStoredApplications(): StoredApplication[] {
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required.');
  return readAll();
}


function requireSupervisor() {
  const user = getSession()?.user;
  if (!user || user.portal !== 'supervisor') throw new Error('Please sign in using a Supervisor account.');
  return user;
}

export async function getSupervisorApplications() {
  const user = requireSupervisor();
  const records = readAll().filter(asyncRecord => asyncRecord.companyId);
  const owned: StoredApplication[] = [];
  for (const record of records) { const company = await getCompanyById(record.companyId); if (company?.ownerId === user.id) owned.push(record); }
  const deployments = (() => { try { const value = JSON.parse(localStorage.getItem('ojtflow_deployments') || '[]') as Array<{applicationId?:string;status?:string}>; return value; } catch { return []; } })();
  const eligibility = (() => { try { return JSON.parse(localStorage.getItem('ojtflow_student_eligibility') || '{}') as Record<string,{status?:string}>; } catch { return {}; } })();
  return owned.sort((a,b) => b.dateApplied.localeCompare(a.dateApplied)).map(item => ({
    ...item,
    eligibilityStatus: eligibility[item.studentId]?.status === 'Eligible' ? 'Eligible' : eligibility[item.studentId]?.status === 'Not Eligible' ? 'Not Eligible' : 'Not Eligible Yet',
    officialDeploymentStatus: item.coordinatorUndeployed ? 'Deployment Cancelled by Coordinator' : deployments.some(record => record.applicationId === item.id && record.status === 'Deployed')
      ? 'Officially Deployed' : item.supervisorDecision === 'Accepted' && item.deploymentStatus === 'Requested'
        ? 'Accepted by Student — Awaiting Official Coordinator Deployment'
        : item.supervisorDecision === 'Accepted' ? 'Awaiting Student Response to Offer'
        : item.supervisorDecision === 'Rejected' ? 'Rejected by Supervisor' : 'Pending Supervisor Decision',
  }));
}

export async function getSupervisorApplicationDetails(id: string): Promise<StoredApplication> {
  const user = requireSupervisor();
  const item = readAll().find(record => record.id === id);
  if (!item) throw new Error('Application not found.');
  const company = await getCompanyById(item.companyId);
  if (!company || company.ownerId !== user.id) throw new Error('You can only view applications submitted to your own company.');
  const eligibility = (() => { try { return JSON.parse(localStorage.getItem('ojtflow_student_eligibility') || '{}') as Record<string,{status?:string}>; } catch { return {}; } })();
  const deployments = (() => { try { return JSON.parse(localStorage.getItem('ojtflow_deployments') || '[]') as Array<{applicationId?:string;status?:string}>; } catch { return []; } })();
  return {
    ...item,
    eligibilityStatus: eligibility[item.studentId]?.status === 'Eligible' ? 'Eligible' : eligibility[item.studentId]?.status === 'Not Eligible' ? 'Not Eligible' : 'Not Eligible Yet',
    officialDeploymentStatus: item.coordinatorUndeployed ? 'Deployment Cancelled by Coordinator' : deployments.some(record => record.applicationId === item.id && record.status === 'Deployed') ? 'Officially Deployed' : item.supervisorDecision === 'Accepted' && item.deploymentStatus === 'Requested' ? 'Accepted by Student — Awaiting Official Coordinator Deployment' : item.supervisorDecision === 'Accepted' ? 'Awaiting Student Response to Offer' : item.supervisorDecision === 'Rejected' ? 'Rejected by Supervisor' : 'Pending Supervisor Decision',
  } as StoredApplication;
}

export async function updateSupervisorApplicationDecision(id: string, decision: 'Accepted' | 'Rejected', remarks = ''): Promise<void> {
  const user = requireSupervisor(); const records = readAll(); const index = records.findIndex(item => item.id === id);
  if (index < 0) throw new Error('Application not found.');
  const company = await getCompanyById(records[index].companyId);
  if (!company || company.ownerId !== user.id) throw new Error('You can only review applications for your own company.');
  const previous = records[index];
  if (previous.status === 'Cancelled' || previous.coordinatorUndeployed) throw new Error('This application is closed and cannot be reviewed again.');
  const cleanRemarks = remarks.trim();
  const decisionAt = new Date().toISOString();
  const decisionVersion = Number(previous.supervisorDecisionVersion || 0) + (previous.supervisorDecision === decision ? 0 : 1);
  // The company slot is reserved at supervisor acceptance, not at coordinator deployment.
  if (decision === 'Accepted' && company.deploymentSlotLedger?.[previous.id] !== true) {
    await adjustCompanyOccupiedSlots(previous.companyId, 1, previous.id);
  } else if (decision === 'Rejected' && company.deploymentSlotLedger?.[previous.id] === true) {
    await adjustCompanyOccupiedSlots(previous.companyId, -1, previous.id);
  }
  records[index] = { ...previous, status: decision, supervisorDecision: decision, supervisorRemarks: cleanRemarks, supervisorDecisionAt: decisionAt, supervisorDecisionVersion: decisionVersion,
    deploymentStatus: decision === 'Accepted' ? 'Not Requested' : 'Not Requested',
    studentAcceptedAt: undefined,
    remarks: cleanRemarks || (decision === 'Accepted' ? 'Accepted by the company supervisor; awaiting the student response to the offer.' : 'Application was not accepted by the company supervisor.') };
  saveAll(records);
  if (decision === 'Accepted' && previous.supervisorDecision !== 'Accepted') createNotifications(`supervisor-accepted:${previous.id}:${decisionVersion}`,  [{ id: previous.studentId, portal: 'student' }], 'Company offer received', `${previous.companyName} accepted your application. Review the offer in My Applications.`);
  if (decision === 'Rejected' && previous.supervisorDecision !== 'Rejected') createNotifications(`supervisor-rejected:${previous.id}:${decisionVersion}`,  [{ id: previous.studentId, portal: 'student' }], 'Application not accepted', `${previous.companyName} did not accept your application.${previous.supervisorDecision === 'Accepted' ? ' The reserved company slot has been released.' : ''}`);
}

export async function getSupervisorAcceptedStudents() {
  return (await getSupervisorApplications()).filter(item => item.supervisorDecision === 'Accepted' && item.status === 'Accepted' && item.deploymentStatus === 'Requested');
}

export async function requestStudentDeployment(applicationId: string): Promise<void> {
  const user = requireStudent();
  const records = readAll();
  const index = records.findIndex(item => item.id === applicationId && item.studentId === user.id);
  if (index < 0) throw new Error('Application not found.');
  if (records[index].status !== 'Accepted' || records[index].supervisorDecision !== 'Accepted') throw new Error('You can accept an offer only after the company supervisor accepts your application.');
  const activeDeployments = (() => { try { const value: unknown = JSON.parse(localStorage.getItem('ojtflow_deployments') || '[]'); return Array.isArray(value) ? value as Array<{studentId?:string;status?:string}> : []; } catch { return []; } })();
  if (activeDeployments.some(item => item.studentId === user.id && item.status === 'Deployed')) throw new Error('You are already officially deployed. Contact the OJT Coordinator before requesting another deployment.');
  if (records[index].deploymentStatus === 'Requested' || records[index].deploymentStatus === 'Deployed') throw new Error('A deployment request has already been submitted for this application.');
  if (records.some(item => item.studentId === user.id && item.id !== applicationId && item.status === 'Accepted' && (item.deploymentStatus === 'Requested' || item.deploymentStatus === 'Deployed'))) {
    throw new Error('You already have another deployment request awaiting coordinator review.');
  }
  const company = await getCompanyById(records[index].companyId);
  if (!company || company.status !== 'Active' || company.published !== true) throw new Error('This company is no longer accepting deployment requests.');
  // Reconcile older accepted applications created before slot reservation was
  // moved to the supervisor decision event.
  if (company.deploymentSlotLedger?.[records[index].id] !== true) {
    await adjustCompanyOccupiedSlots(records[index].companyId, 1, records[index].id);
  }
  const requestedAt = new Date().toISOString();
  const requestVersion = Number(records[index].deploymentRequestVersion || 0) + 1;
  records[index] = { ...records[index], deploymentStatus: 'Requested', studentAcceptedAt: requestedAt, deploymentRequestedAt: requestedAt, deploymentRequestVersion: requestVersion, coordinatorUndeployed: false };
  saveAll(records);
  createNotifications(`student-accepted-offer:${records[index].id}:${requestVersion}`, [{ id: mockCoordinator.id, portal: 'coordinator' }], 'Student accepted company offer', `${records[index].studentName} accepted the offer from ${records[index].companyName}.`);
}

export async function getCoordinatorDeploymentRequests() {
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required.');
  return readAll().filter(item => item.supervisorDecision === 'Accepted' && item.status === 'Accepted' && item.deploymentStatus === 'Requested').map(item => ({
    applicationId: item.id, studentId: item.studentId, studentName: item.studentName,
    studentNumber: item.studentNumber, program: item.academicProgram,
    companyId: item.companyId, companyName: item.companyName,
    requestedAt: item.deploymentRequestedAt || item.dateApplied,
    eligibilityStatus: (() => { try { return (JSON.parse(localStorage.getItem('ojtflow_student_eligibility') || '{}') as Record<string,{status?:string}>)[item.studentId]?.status || 'For Review'; } catch { return 'For Review'; } })() === 'Eligible' ? 'Eligible' : (() => { try { return (JSON.parse(localStorage.getItem('ojtflow_student_eligibility') || '{}') as Record<string,{status?:string}>)[item.studentId]?.status === 'Not Eligible' ? 'Not Eligible' : 'Not Eligible Yet'; } catch { return 'Not Eligible Yet'; } })(),
  }));
}

export async function confirmStudentDeployment(applicationId: string, deploymentStartDate: string, deploymentEndDate: string): Promise<void> {
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required.');
  const isValidDate = (value: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(year, month - 1, day);
    return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
  };
  if (!isValidDate(deploymentStartDate) || !isValidDate(deploymentEndDate) || deploymentEndDate < deploymentStartDate) {
    throw new Error('Enter valid deployment start and end dates. The end date must be on or after the start date.');
  }
  const records = readAll();
  const index = records.findIndex(item => item.id === applicationId);
  if (index < 0) throw new Error('Application not found.');
  const item = records[index];
  if (item.status !== 'Accepted' || item.supervisorDecision !== 'Accepted' || item.deploymentStatus !== 'Requested') throw new Error('Only supervisor-accepted applications with a pending student deployment request can be deployed.');
  let eligibility: Record<string,{status?:string}> = {};
  try { eligibility = JSON.parse(localStorage.getItem('ojtflow_student_eligibility') || '{}') as Record<string,{status?:string}>; } catch { /* empty */ }
  if (eligibility[item.studentId]?.status !== 'Eligible') throw new Error('This student has not been marked Eligible by the Coordinator.');
  const deployments = (() => { try { const value: unknown = JSON.parse(localStorage.getItem('ojtflow_deployments') || '[]'); return Array.isArray(value) ? value as Array<Record<string,unknown>> : []; } catch { return []; } })();
  // Recover safely from a partially completed earlier confirmation. The deployment
  // record is the durable source of truth; if it already exists for this exact
  // application, reconcile the application status instead of failing or creating
  // another record / consuming another company slot.
  const priorDeployments = deployments.filter(record => String(record.applicationId || '') === item.id);
  const activeOrPendingDeployment = priorDeployments.find(record => record.status === 'Deployed' || record.status === 'Placement Confirmed');
  if (activeOrPendingDeployment) {
    const sameAssignment = String(activeOrPendingDeployment.studentId || '') === item.studentId
      && String(activeOrPendingDeployment.companyId || '') === item.companyId;
    if (!sameAssignment) {
      throw new Error('A deployment record is already linked to this application with different student or company details. Please contact the system administrator.');
    }
    records[index] = { ...item, deploymentStatus: activeOrPendingDeployment.status === 'Deployed' ? 'Deployed' : 'Requested' };
    saveAll(records);
    return;
  }
  const incompatibleHistory = priorDeployments.find(record => record.status !== 'Undeployed');
  if (incompatibleHistory) {
    throw new Error('This application has an unresolved deployment record. Please contact the OJT Coordinator.');
  }
  // A prior deployment for this same accepted application may be retained as
  // Undeployed history. That must not prevent a fresh deployment record from
  // being created after the student submits a new request. Validate that every
  // historical record still belongs to the same student and company.
  if (priorDeployments.some(record => String(record.studentId || '') !== item.studentId || String(record.companyId || '') !== item.companyId)) {
    throw new Error('This application has deployment history linked to different student or company details. Please contact the system administrator.');
  }
  if (deployments.some(record => record.studentId === item.studentId && record.status === 'Deployed')) {
    throw new Error('This student already has an official deployment at another company.');
  }
  const company = await getCompanyById(item.companyId);
  if (!company || company.published !== true || company.status !== 'Active' || company.deploymentSlotLedger?.[item.id] !== true) throw new Error('This application does not have a reserved company slot. The supervisor must accept the application first.');
  const deploymentRecordId = `DEP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  try {
    deployments.push({
      id: deploymentRecordId, createdAt: new Date().toISOString(), studentId: item.studentId, applicationId: item.id,
      companyId: item.companyId, companyName: item.companyName, location: item.location,
      studentName: item.studentName, studentNumber: item.studentNumber, status: 'Deployed',
      deploymentStartDate, deploymentEndDate, deploymentDate: deploymentStartDate,
      program: item.academicProgram, companySupervisor: company.contactName || 'Not provided', requiredOjtHours: 500, accumulatedOjtHours: 0,
    });
    localStorage.setItem('ojtflow_deployments', JSON.stringify(deployments));
  } catch (error) {
    throw error;
  }
  records[index] = { ...item, deploymentStatus: 'Deployed' };
  saveAll(records);
  createNotifications(`deployment-confirmed:${deploymentRecordId}`, [{ id: item.studentId, portal: 'student' }, { id: String(company.ownerId), portal: 'supervisor' }], 'Official OJT deployment confirmed', `${item.studentName} has been officially deployed to ${item.companyName}. Required OJT hours: 500.`);
}

export async function getCoordinatorDeployedStudents() {
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required.');
  const deployments = (() => { try { const value: unknown = JSON.parse(localStorage.getItem('ojtflow_deployments') || '[]'); return Array.isArray(value) ? value as Array<Record<string,unknown>> : []; } catch { return []; } })();
  return deployments.filter(item => item.status === 'Deployed').map(item => ({
    id: String(item.id), studentId: String(item.studentId), studentName: String(item.studentName || 'Student'),
    studentNumber: String(item.studentNumber || 'Not provided'), program: String(item.program || 'Not provided'),
    companyId: String(item.companyId || ''), companyName: String(item.companyName || 'Company'),
    deploymentStartDate: String(item.deploymentStartDate || item.deploymentDate || ''),
    deploymentEndDate: String(item.deploymentEndDate || ''), status: String(item.status || 'Deployed'), requiredOjtHours: 500, accumulatedOjtHours: Number(item.accumulatedOjtHours || 0),
    deploymentDate: String(item.deploymentStartDate || item.deploymentDate || ''),
    applicationId: String(item.applicationId || ''),
  }));
}

export async function getCoordinatorDeploymentHistory() {
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required.');
  const deployments = (() => { try { const value: unknown = JSON.parse(localStorage.getItem('ojtflow_deployments') || '[]'); return Array.isArray(value) ? value as Array<Record<string,unknown>> : []; } catch { return []; } })();
  return deployments.map(item => ({
    id: String(item.id), studentName: String(item.studentName || 'Student'),
    studentNumber: String(item.studentNumber || 'Not provided'), companyName: String(item.companyName || 'Company'),
    deploymentStartDate: String(item.deploymentStartDate || item.deploymentDate || ''),
    deploymentEndDate: String(item.deploymentEndDate || ''), status: String(item.status || 'Unknown'),
    undeployedAt: String(item.undeployedAt || ''), undeploymentRemarks: String(item.undeploymentRemarks || ''), requiredOjtHours: 500, accumulatedOjtHours: Number(item.accumulatedOjtHours || 0),
  })).sort((a,b) => b.deploymentStartDate.localeCompare(a.deploymentStartDate));
}

export async function getSupervisorDeployedInterns() {
  const user = requireSupervisor();
  const deployments = (() => { try { const value: unknown = JSON.parse(localStorage.getItem('ojtflow_deployments') || '[]'); return Array.isArray(value) ? value as Array<Record<string,unknown>> : []; } catch { return []; } })();
  const rows = [];
  for (const item of deployments) {
    if (item.status !== 'Deployed') continue;
    const company = await getCompanyById(String(item.companyId || ''));
    if (company?.ownerId !== user.id) continue;
    rows.push({
      id: String(item.id), studentName: String(item.studentName || 'Student'),
      studentNumber: String(item.studentNumber || 'Not provided'), program: String(item.program || 'Not provided'),
      deploymentStartDate: String(item.deploymentStartDate || item.deploymentDate || ''),
      deploymentEndDate: String(item.deploymentEndDate || ''), status: 'Deployed', requiredOjtHours: 500, accumulatedOjtHours: Number(item.accumulatedOjtHours || 0),
    });
  }
  return rows;
}

export async function undeployStudent(deploymentId: string, remarks: string): Promise<void> {
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required.');
  const cleanRemarks = remarks.trim();
  if (!cleanRemarks) throw new Error('Please provide the reason for undeployment.');
  const deployments = (() => { try { const value: unknown = JSON.parse(localStorage.getItem('ojtflow_deployments') || '[]'); return Array.isArray(value) ? value as Array<Record<string,unknown>> : []; } catch { return []; } })();
  const index = deployments.findIndex(item => item.id === deploymentId && item.status === 'Deployed');
  if (index < 0) throw new Error('Active deployment record not found.');
  const undeployedAt = new Date().toISOString();
  deployments[index] = { ...deployments[index], status: 'Undeployed', undeployedAt, undeploymentRemarks: cleanRemarks, undeployedBy: user.id };
  localStorage.setItem('ojtflow_deployments', JSON.stringify(deployments));
  // Deliberately do not release the company slot here: supervisor acceptance
  // reserves it, and only rejection or student application cancellation releases it.
  const applicationId = String(deployments[index].applicationId || '');
  let application: StoredApplication | undefined;
  if (applicationId) {
    const records = readAll();
    const appIndex = records.findIndex(item => item.id === applicationId);
    if (appIndex >= 0) {
      application = records[appIndex];
      // Undeployment ends only the official deployment record. It does not
      // revoke the supervisor's accepted application or its reserved company
      // slot. Reset the request state so the student can request deployment
      // again against the same accepted application.
      records[appIndex] = { ...application, status: 'Accepted', deploymentStatus: 'Not Requested', coordinatorUndeployed: true,
        coordinatorUndeployedAt: undeployedAt, coordinatorUndeploymentRemarks: cleanRemarks,
        remarks: `Previous deployment ended by the OJT Coordinator: ${cleanRemarks}` };
      saveAll(records);
    }
  }
  const company = await getCompanyById(String(deployments[index].companyId || ''));
  const studentId = String(deployments[index].studentId || '');
  const studentName = String(deployments[index].studentName || 'The student');
  const companyName = String(deployments[index].companyName || 'the company');
  const dateLabel = undeployedAt.slice(0, 10);
  const detail = `${studentName}'s deployment at ${companyName} ended on ${dateLabel}. Coordinator remarks: ${cleanRemarks}. The company slot remains reserved because the supervisor accepted the application.`;
  const recipients: Array<{ id: string; portal: 'student' | 'supervisor' }> = [{ id: studentId, portal: 'student' }];
  if (company?.ownerId) recipients.push({ id: company.ownerId, portal: 'supervisor' });
  createNotifications(`deployment-undeployed:${deploymentId}`, recipients, 'Deployment cancelled by Coordinator', detail);
}
