import { ENV } from '../core/env';
import { getSession } from '../core/session';
import { mockRequirementHeading, mockRequirementAssistance } from '../mocks/requirement.mock';
import type { RequirementRecord, RequirementDetail } from '../types/requirement.types';

const KEY = 'ojtflow_student_requirements';
type RequirementState = 'Passed' | 'Pending' | 'Missing';
type Store = Record<string, RequirementRecord[]>;

interface CatalogueItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  submissionNote: string;
}

/** The active pre-deployment checklist configured in the current UNISphere source. */
export const OJT_REQUIREMENT_CATALOGUE: CatalogueItem[] = [
  { id: 'REQ-001', title: 'Student Information Sheet', category: 'Student Information', icon: 'assignment_ind', description: 'The official student information sheet containing the intern’s personal details, contact information, academic program, and emergency contact. The OJT Office uses it to verify the student record and maintain accurate internship documentation.', submissionNote: 'Submit the completed and signed student information sheet in person at the OJT Office.' },
  { id: 'REQ-002', title: 'Medical Certificate', category: 'Mandatory Clearance', icon: 'medical_services', description: 'A current medical certificate issued by a qualified medical practitioner. It provides the host establishment and the University with confirmation that the student has undergone the required medical assessment for internship participation.', submissionNote: 'Present the original or officially accepted medical certificate at the OJT Office for physical checking.' },
  { id: 'REQ-003', title: "Parent's Consent Form", category: 'Mandatory Clearance', icon: 'family_restroom', description: 'The signed consent of the student’s parent or legal guardian acknowledging the OJT placement and its requirements. It records that the family has been informed of the internship arrangement and agrees to the student’s participation.', submissionNote: 'Submit the completed form with the required parent or guardian signature at the OJT Office.' },
  { id: 'REQ-004', title: 'Resume / Curriculum Vitae', category: 'Personal Document', icon: 'description', description: 'An updated resume or curriculum vitae summarizing the student’s education, relevant skills, training, and contact information. The document supports the host establishment’s assessment of the applicant.', submissionNote: 'Provide a printed, updated copy when required by the OJT Office or host establishment.' },
  { id: 'REQ-005', title: 'Certificate of Registration', category: 'Academic Document', icon: 'school', description: 'The official Certificate of Registration for the applicable semester or academic term. It helps verify the student’s current enrollment and academic standing for the OJT period.', submissionNote: 'Present the official Certificate of Registration for the current applicable term at the OJT Office.' },
  { id: 'REQ-006', title: 'Insurance Document', category: 'Mandatory Clearance', icon: 'health_and_safety', description: 'The applicable insurance or coverage document required for the student’s OJT deployment. It provides supporting evidence that the required coverage arrangements have been documented before deployment.', submissionNote: 'Submit the insurance certificate or other document accepted by the OJT Office for physical verification.' },
  { id: 'REQ-007', title: 'Endorsement Letter', category: 'Institutional Document', icon: 'approval', description: 'The University or OJT Office endorsement addressed to the host establishment. It formally introduces the student and confirms the institution’s endorsement of the internship application or placement.', submissionNote: 'Coordinate with the OJT Office for the official endorsement and submit the required physical copy when issued.' },
  { id: 'REQ-008', title: 'Company Acceptance Letter', category: 'Company Document', icon: 'business_center', description: 'The host establishment’s written confirmation that it has accepted the student for internship consideration or placement. It provides the OJT Office with evidence of the company’s acceptance before official deployment processing.', submissionNote: 'Present the acceptance letter issued by the host establishment to the OJT Office.' },
];

function read(): Store {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Store : {};
  } catch { return {}; }
}
function write(data: Store): void {
  localStorage.setItem(KEY, JSON.stringify(data));
  try { localStorage.setItem('ojtflow_requirements_updated', String(Date.now())); } catch { /* best effort */ }
}
function currentUser() { const user = getSession()?.user; if (!user) throw new Error('Please sign in to view OJT requirements.'); return user; }
function studentId(): string { const user = currentUser(); if (user.portal !== 'student') throw new Error('Student access is required.'); return user.id; }
function normalizeStatus(status: unknown): RequirementState {
  const value = String(status ?? '').trim().toLowerCase();
  if (['passed', 'approved', 'verified', 'completed'].includes(value)) return 'Passed';
  if (['pending', 'pending review', 'pending verification'].includes(value)) return 'Pending';
  return 'Missing';
}
function normalizeRecord(raw: Partial<RequirementRecord> | null | undefined, item: CatalogueItem, index: number): RequirementRecord {
  const record = raw && typeof raw === 'object' ? raw : {};
  const status = normalizeStatus(record.status);
  return {
    ...record,
    id: typeof record.id === 'string' && record.id ? record.id : item.id,
    number: Number.isFinite(Number(record.number)) && Number(record.number) > 0 ? Number(record.number) : index + 1,
    title: typeof record.title === 'string' && record.title.trim() ? record.title : item.title,
    category: typeof record.category === 'string' && record.category.trim() ? record.category : item.category,
    description: typeof record.description === 'string' && record.description.trim() ? record.description : item.description,
    icon: typeof record.icon === 'string' && record.icon.trim() ? record.icon : item.icon,
    status,
    submittedDate: typeof record.submittedDate === 'string' ? record.submittedDate : '—',
    submissionNote: typeof record.submissionNote === 'string' && record.submissionNote.trim() ? record.submissionNote : (status === 'Passed' ? 'Physically submitted and verified at the OJT Office.' : status === 'Pending' ? 'Awaiting physical submission or verification at the OJT Office.' : item.submissionNote),
    documentId: typeof record.documentId === 'string' ? record.documentId : '—',
    actionRequired: typeof record.actionRequired === 'string' ? record.actionRequired : '',
  };
}
function ensureCatalogue(id: string): RequirementRecord[] {
  const all = read();
  const stored = Array.isArray(all[id]) ? all[id] : [];
  const byId = new Map(stored.filter(Boolean).map(record => [String(record.id || ''), record]));
  const normalized = OJT_REQUIREMENT_CATALOGUE.map((item, index) => normalizeRecord(byId.get(item.id), item, index));
  const unchanged = Array.isArray(all[id]) && JSON.stringify(stored) === JSON.stringify(normalized);
  if (!unchanged) { all[id] = normalized; write(all); }
  return normalized;
}
function getRemarks(id: string): string {
  try { const value = (JSON.parse(localStorage.getItem('ojtflow_eligibility_remarks') || '{}') as Record<string, unknown>)[id]; return typeof value === 'string' ? value : ''; }
  catch { return ''; }
}
function decorateRecords(id: string): RequirementRecord[] {
  const remarks = getRemarks(id);
  return ensureCatalogue(id).map(record => ({
    ...record,
    actionRequired: record.actionRequired || remarks,
    submissionNote: record.status === 'Passed' ? 'Physically submitted and recorded as passed by the OJT Coordinator.' : record.status === 'Pending' ? 'Awaiting physical submission or verification at the OJT Office.' : record.submissionNote || 'Not yet recorded as physically submitted and passed.',
  }));
}

/** Coordinator-only read access to the same canonical student checklist. */
export function getCoordinatorStudentRequirementRecords(id: string): RequirementRecord[] {
  const user = currentUser();
  if (user.portal !== 'coordinator') throw new Error('Only the OJT Coordinator can view this requirement record.');
  if (!id) throw new Error('Student ID is required.');
  return ensureCatalogue(id);
}

export async function getStudentRequirements() {
  if (!ENV.useMocks) throw new Error('Requirement API integration is not available yet.');
  const id = studentId();
  const records = decorateRecords(id);
  const passed = records.filter(record => record.status === 'Passed').length;
  const pending = records.filter(record => record.status === 'Pending').length;
  const missing = records.length - passed - pending;
  const overall = passed === records.length ? 'All Requirements Passed' : missing > 0 ? 'Requirements Incomplete' : 'Verification In Progress';
  return {
    heading: { ...mockRequirementHeading, progressLabel: 'PHYSICAL SUBMISSION & VERIFICATION', progressPercent: 0 },
    completion: { academicYear: 'A.Y. 2026-2027', completed: passed, total: records.length, actionNeeded: missing + pending, status: overall, minimumThreshold: 100, stage: 'OJT Office Face-to-Face Verification', pending, missing },
    records, detail: null as RequirementDetail | null, assistance: mockRequirementAssistance,
  };
}

export async function getRequirementDetails(requirementId: string) {
  const id = studentId();
  const records = decorateRecords(id);
  const item = records.find(record => record.id === requirementId);
  if (!item) throw new Error('Requirement not found.');
  const remarks = getRemarks(id);
  return { requirementId: item.id, itemLabel: `Item ${item.number} of ${records.length}`, category: item.category, documentId: item.documentId, title: item.title, icon: item.icon, status: item.status, description: item.description, evaluationStatus: item.status === 'Passed' ? 'Passed — physically verified at the OJT Office' : item.status === 'Pending' ? 'Pending — awaiting physical verification' : 'Missing / Not yet completed', evaluationNote: 'Requirements are submitted, checked, and verified face-to-face at the OJT Office. This page is for monitoring only.', dateChecked: '—', coordinatorName: 'OJT Coordinator', remarks: remarks || item.actionRequired || 'Please coordinate with the OJT Office regarding this requirement.' } as RequirementDetail;
}

/** Coordinator-only: update one requirement after face-to-face checking. */
export function updateStudentRequirementStatus(id: string, requirementId: string, status: RequirementState, remarks = ''): void {
  const user = currentUser(); if (user.portal !== 'coordinator') throw new Error('Only the OJT Coordinator can update requirement verification.');
  if (!id || !requirementId) throw new Error('Student and requirement are required.');
  if (!['Passed', 'Pending', 'Missing'].includes(status)) throw new Error('Invalid requirement status.');
  const all = read(); const records = ensureCatalogue(id); const index = records.findIndex(record => record.id === requirementId);
  if (index < 0) throw new Error('Requirement not found.');
  const item = OJT_REQUIREMENT_CATALOGUE.find(entry => entry.id === requirementId)!;
  records[index] = { ...records[index], status, submissionNote: status === 'Passed' ? 'Physically submitted and verified at the OJT Office.' : status === 'Pending' ? 'Awaiting physical submission or verification.' : item.submissionNote, actionRequired: remarks.trim() || (status === 'Missing' ? 'Please comply with this requirement at the OJT Office.' : '') };
  all[id] = records; write(all);
}

/** Coordinator-only: mark every checklist item passed after complete physical verification. */
export function markAllStudentRequirementsPassed(id: string): void {
  const user = currentUser(); if (user.portal !== 'coordinator') throw new Error('Only the OJT Coordinator can update requirement verification.');
  if (!id) throw new Error('Student ID is required.');
  const all = read(); const records = ensureCatalogue(id).map(record => ({ ...record, status: 'Passed' as RequirementState, submissionNote: 'Physically submitted and verified at the OJT Office.', actionRequired: '' }));
  all[id] = records; write(all);
}
