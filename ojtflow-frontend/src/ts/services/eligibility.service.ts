import { ENV } from '../core/env';
import type { User } from '../types/user.types';

const STUDENT_ACCOUNTS_KEY = 'ojtflow_student_accounts';
const ELIGIBILITY_KEY = 'ojtflow_student_eligibility';
const REMARKS_KEY = 'ojtflow_eligibility_remarks';

type Decision = 'For Review' | 'Eligible' | 'Not Eligible';
interface StoredAccount { user: User; passwordHash: string }
interface EligibilityState { status: Decision; submittedRequirements?: number; totalRequirements?: number }
export interface EligibilityRecord {
  id: string; studentName: string; studentNumber: string; program: string;
  requirements: string; status: Decision | 'Incomplete Requirements';
  yearLevel: string; section: string; studentType: string;
}

function readObject<T>(key: string): Record<string, T> {
  try { return JSON.parse(localStorage.getItem(key) || '{}') as Record<string, T>; }
  catch { return {}; }
}
function getStudents(): User[] {
  try {
    const accounts = JSON.parse(localStorage.getItem(STUDENT_ACCOUNTS_KEY) || '[]') as StoredAccount[];
    return Array.isArray(accounts) ? accounts.filter(a => a?.user?.portal === 'student').map(a => a.user) : [];
  } catch { return []; }
}
function buildRecords(): EligibilityRecord[] {
  const states = readObject<EligibilityState>(ELIGIBILITY_KEY);
  return getStudents().map(user => {
    const state = states[user.id] || { status: 'For Review' as Decision };
    const submitted = Number(state.submittedRequirements || 0);
    const total = Number(state.totalRequirements || 0);
    const incomplete = total > 0 && submitted < total;
    return {
      id: user.id, studentName: user.name, studentNumber: user.identifier || 'Not provided',
      program: user.program || 'Not provided', requirements: total > 0 ? `${submitted}/${total}` : 'Not recorded',
      status: incomplete ? 'Incomplete Requirements' : state.status,
      yearLevel: 'Not provided', section: 'Not provided', studentType: 'Regular Student',
    };
  });
}

export async function getEligibilityPage() {
  if (!ENV.useMocks) throw new Error('Eligibility API integration is not available yet.');
  const records = buildRecords();
  return {
    records,
    summary: {
      totalStudents: records.length,
      forReview: records.filter(r => r.status === 'For Review').length,
      eligible: records.filter(r => r.status === 'Eligible').length,
      incompleteRequirements: records.filter(r => r.status === 'Incomplete Requirements').length,
    },
    programs: [...new Set(records.map(r => r.program).filter(p => p !== 'Not provided'))],
    statuses: ['Eligible', 'Not Eligible', 'For Review', 'Incomplete Requirements'],
  };
}

export async function getEligibilityDetails(id: string) {
  if (!ENV.useMocks) throw new Error('Eligibility API integration is not available yet.');
  const student = buildRecords().find(record => record.id === id);
  if (!student) throw new Error('Student eligibility record was not found.');
  const states = readObject<EligibilityState>(ELIGIBILITY_KEY);
  const remarks = readObject<string>(REMARKS_KEY);
  return { student, status: states[id]?.status || 'For Review', remarks: remarks[id] || '' };
}

export function saveEligibilityDecision(id: string, status: 'Eligible' | 'Not Eligible'): void {
  const states = readObject<EligibilityState>(ELIGIBILITY_KEY);
  states[id] = { ...states[id], status };
  localStorage.setItem(ELIGIBILITY_KEY, JSON.stringify(states));
}
export function saveEligibilityRemarks(id: string, remarks: string): void {
  const allRemarks = readObject<string>(REMARKS_KEY);
  allRemarks[id] = remarks;
  localStorage.setItem(REMARKS_KEY, JSON.stringify(allRemarks));
}
