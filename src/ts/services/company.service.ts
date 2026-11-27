import { getSession } from '../core/session';
import {
  mockCompanyPrograms,
  mockCompanyStatuses,
  mockAddCompanyForm,
  mockEditCompanyForm,
  mockCompanyProvinces,
  mockCompanyDirectoryHeading,
  mockCompanyDirectoryFilters,
  mockCompanyProgramSection,
  type CompanyManagementRecord,
} from '../mocks/company.mock';
import type { CompanyRecord } from '../types/company.types';
import type { CompanyDetailsRecord } from '../mocks/company.mock';

const DB_NAME = 'ojtflow-local';
const DB_VERSION = 3;
const STORE_NAME = 'companies';
// IDs reserved by the removed starter dataset in earlier mock versions.
// Ignore these stale sample records without deleting any browser data.
const LEGACY_SAMPLE_IDS = new Set(['company-001', 'company-002', 'company-003', 'company-004', 'company-005']);

export interface NewCompanyInput {
  name: string; address: string; municipality: string; province: string;
  companyEmail: string; companyPhone: string; website: string;
  contactName: string; contactRole: string; contactPersonEmail: string;
  contactPhone: string; acceptedPrograms: string[]; slotsOpen: number;
  status: 'Active' | 'Inactive'; partnershipRemarks: string; logoDataUrl?: string;
  keyRequirements?: string[]; preferredSkills?: string[];
}

interface StoredCompany extends CompanyRecord {
  partnerId: string; subtitle: string; status: 'Active' | 'Inactive'; ownerId?: string; published?: boolean;
  availableSlots: number; totalSlots?: number; occupiedSlots?: number; companyStatus?: 'Active' | 'Inactive'; deploymentSlotLedger?: Record<string, boolean>;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported by this browser.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      let store: IDBObjectStore;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      } else {
        store = request.transaction!.objectStore(STORE_NAME);
      }

      // Version 3 intentionally starts the company directory empty. This is
      // a one-time IndexedDB migration; later company profiles are retained.
      if (event.oldVersion < 3) store.clear();
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open company storage.'));
  });
}

async function readStoredCompanies(): Promise<StoredCompany[]> {
  const db = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      let records: StoredCompany[] = [];
      request.onsuccess = () => {
        records = (request.result ?? []) as StoredCompany[];
        // Permanently clear only IDs belonging to the retired starter-company dataset.
        for (const company of records) if (LEGACY_SAMPLE_IDS.has(company.id)) store.delete(company.id);
        records = records.filter(company => !LEGACY_SAMPLE_IDS.has(company.id));
      };
      request.onerror = () => reject(request.error ?? new Error('Unable to read companies.'));
      tx.oncomplete = () => resolve(records);
      tx.onerror = () => reject(tx.error ?? new Error('Unable to clean company storage.'));
      tx.onabort = () => reject(tx.error ?? new Error('Company storage cleanup was cancelled.'));
    });
  } finally { db.close(); }
}

async function writeCompany(record: StoredCompany, mode: 'add' | 'put'): Promise<void> {
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME)[mode](record);
      tx.oncomplete = () => {
        try { localStorage.setItem('ojtflow_company_records_updated', String(Date.now())); } catch { /* best-effort cross-tab notification */ }
        resolve();
      };
      tx.onerror = () => reject(tx.error ?? new Error('Unable to save company.'));
      tx.onabort = () => reject(tx.error ?? new Error('Company save was cancelled.'));
    });
  } finally { db.close(); }
}

function missingCompanyPublishFields(company: StoredCompany): string[] {
  const missing: string[] = [];
  const required: Array<[string, unknown]> = [
    ['Company logo', company.logoDataUrl], ['Company name', company.name], ['Company address', company.companyAddress],
    ['City / Municipality', company.municipality], ['Province', company.province],
    ['Company email', company.companyEmail], ['Company contact number', company.companyPhone],
    ['Contact person', company.contactName], ['Contact person position', company.contactRole],
    ['Contact person email', company.contactPersonEmail || company.contactEmail],
    ['Contact person contact number', company.contactPhone],
  ];
  for (const [label, value] of required) if (typeof value !== 'string' || !value.trim()) missing.push(label);
  if (!Array.isArray(company.acceptedPrograms) || company.acceptedPrograms.length === 0) missing.push('At least one accepted academic program');
  if (!Number.isFinite(Number(company.totalSlots ?? company.availableSlots)) || Number(company.totalSlots ?? company.availableSlots) < 1) missing.push('Available student slots (at least 1)');
  if (!Array.isArray(company.requirements) || company.requirements.length === 0) missing.push('Key requirements');
  return missing;
}

export async function createCompany(input: NewCompanyInput): Promise<StoredCompany> {
  const creator = getSession()?.user;
  if (!creator || creator.portal !== 'supervisor') throw new Error('Only a registered Company Supervisor can create a company profile.');
  const name = input.name.trim();
  if (!name) throw new Error('Company name is required.');
  if (!input.logoDataUrl) throw new Error('Company logo is required before saving the company profile.');
  const slots = Math.max(0, Number.isFinite(input.slotsOpen) ? input.slotsOpen : 0);
  const companyId = `LOCAL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const initials = name.split(/\s+/).slice(0, 3).map(part => part[0]).join('').toUpperCase();
  const program = input.acceptedPrograms[0] ?? '';
  const location = [input.municipality, input.province].filter(Boolean).join(', ');
  const currentUser = getSession()?.user;
  const record: StoredCompany = {
    ownerId: currentUser?.portal === 'supervisor' ? currentUser.id : undefined, published: currentUser?.portal === 'supervisor' ? false : true,
    id: companyId, partnerId: `HTE-${new Date().getFullYear()}-${companyId.slice(-6)}`,
    name, initials, subtitle: 'OJT Partner', location, municipality: input.municipality,
    program, availability: slots > 0 && input.status === 'Active' ? 'accepting' : 'not-accepting',
    slotsOpen: slots, availableSlots: slots, totalSlots: slots, occupiedSlots: 0,
    description: input.partnershipRemarks || 'OJT partner company.',
    acceptedPrograms: [...input.acceptedPrograms], opportunityFocus: [], requirements: [...(input.keyRequirements ?? [])], preferredSkills: [...(input.preferredSkills ?? [])],
    contactName: input.contactName, contactRole: input.contactRole, contactPhone: input.contactPhone,
    contactEmail: input.contactPersonEmail || input.companyEmail,
    logoDataUrl: input.logoDataUrl, companyStatus: input.status, status: input.status,
    province: input.province, companyEmail: input.companyEmail, companyPhone: input.companyPhone,
    website: input.website, partnershipRemarks: input.partnershipRemarks,
    contactPersonEmail: input.contactPersonEmail, companyAddress: input.address,
    academicProgramHours: { BSIT: 500, BSCS: 500 },
  };
  await writeCompany(record, 'add');
  return record;
}

export async function getCompanyById(id: string): Promise<StoredCompany | undefined> {
  if (!id?.trim()) return undefined;
  return (await readStoredCompanies()).find(company => company.id === id);
}

export async function updateCompany(id: string, input: Partial<NewCompanyInput>): Promise<StoredCompany> {
  const current = await getCompanyById(id);
  if (!current) throw new Error('Company not found. It may have been deleted.');
  const activeUser = getSession()?.user;
  if (!activeUser || activeUser.portal !== 'supervisor') throw new Error('Only a Company Supervisor can edit a company profile.');
  if (activeUser.portal === 'supervisor' && current.ownerId !== activeUser.id) throw new Error('You can only manage your own company profile.');
  const name = input.name?.trim() || current.name;
  if (!(input.logoDataUrl || current.logoDataUrl)) throw new Error('Company logo is required before saving the company profile.');
  const acceptedPrograms = input.acceptedPrograms ?? current.acceptedPrograms;
  const slots = Math.max(0, input.slotsOpen ?? current.totalSlots ?? current.availableSlots);
  if (slots < Number(current.occupiedSlots ?? 0)) throw new Error(`Available capacity cannot be reduced below the ${current.occupiedSlots} students already deployed to this company.`);
  const status = input.status ?? current.status;
  const municipality = input.municipality ?? current.municipality;
  const province = input.province ?? current.province ?? '';
  const updated: StoredCompany = {
    ...current, ...input, id, name, logoDataUrl: input.logoDataUrl ?? current.logoDataUrl,
    initials: name.split(/\s+/).slice(0, 3).map(part => part[0]).join('').toUpperCase(),
    municipality, province, location: [municipality, province].filter(Boolean).join(', '),
    companyAddress: input.address ?? current.companyAddress,
    companyEmail: input.companyEmail ?? current.companyEmail,
    companyPhone: input.companyPhone ?? current.companyPhone,
    website: input.website ?? current.website,
    contactName: input.contactName ?? current.contactName,
    contactRole: input.contactRole ?? current.contactRole,
    contactPhone: input.contactPhone ?? current.contactPhone,
    contactPersonEmail: input.contactPersonEmail ?? current.contactPersonEmail,
    program: acceptedPrograms[0] ?? '', acceptedPrograms: [...acceptedPrograms],
    slotsOpen: slots, availableSlots: Math.max(0, slots - (current.occupiedSlots ?? 0)), totalSlots: slots, occupiedSlots: current.occupiedSlots ?? 0,
    availability: (slots - (current.occupiedSlots ?? 0)) > 0 && status === 'Active' ? 'accepting' : 'not-accepting',
    status, companyStatus: status,
    description: input.partnershipRemarks ?? current.description,
    partnershipRemarks: input.partnershipRemarks ?? current.partnershipRemarks,
    requirements: input.keyRequirements ?? current.requirements ?? [],
    preferredSkills: input.preferredSkills ?? current.preferredSkills ?? [],
    contactEmail: input.contactPersonEmail ?? input.companyEmail ?? current.contactEmail,
  };
  if (current.published) {
    const missing = missingCompanyPublishFields(updated);
    if (missing.length) throw new Error(`This published company cannot be saved with incomplete information. Complete: ${missing.join('; ')}.`);
  }
  await writeCompany(updated, 'put');
  return updated;
}

export async function deleteCompany(id: string): Promise<void> {
  const activeUser = getSession()?.user;
  if (!activeUser || activeUser.portal !== 'supervisor') throw new Error('Only a Company Supervisor can delete a company profile.');
  const company = await getCompanyById(id);
  if (activeUser.portal === 'supervisor' && company?.ownerId !== activeUser.id) throw new Error('You can only delete your own company profile.');
  const exists = await getCompanyById(id);
  if (!exists) throw new Error('Company not found. It may already have been deleted.');
  const hasApplications = (() => { try { return (JSON.parse(localStorage.getItem('ojtflow_applications') || '[]') as Array<{companyId?:string}>).some(item => item.companyId === id); } catch { return false; } })();
  const hasDeployments = (() => { try { return (JSON.parse(localStorage.getItem('ojtflow_deployments') || '[]') as Array<{companyId?:string;status?:string}>).some(item => item.companyId === id && item.status !== 'Undeployed'); } catch { return false; } })();
  if (hasApplications || hasDeployments) throw new Error('This company has application or deployment history and cannot be deleted. Unpublish it or mark it inactive instead.');
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('Unable to delete company.'));
      tx.onabort = () => reject(tx.error ?? new Error('Company deletion was cancelled.'));
    });
  } finally { db.close(); }
}

const delay = (ms = 100): Promise<void> => new Promise(resolve => window.setTimeout(resolve, ms));

/** Reserves or releases company capacity for a supervisor-accepted application. */
export async function adjustCompanyOccupiedSlots(companyId: string, change: 1 | -1, applicationId?: string): Promise<void> {
  const user = getSession()?.user;
  if (!user || !['coordinator', 'supervisor', 'student'].includes(user.portal)) throw new Error('Please sign in to update company application capacity.');
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(companyId);
      let failure: Error | null = null;
      request.onsuccess = () => {
        const company = request.result as StoredCompany | undefined;
        if (!company) {
          failure = new Error('Company record not found while updating deployment slots.');
          tx.abort();
          return;
        }
        const total = Math.max(0, Number(company.totalSlots ?? company.slotsOpen ?? company.availableSlots ?? 0));
        const currentOccupied = Math.max(0, Math.min(total, Number(company.occupiedSlots ?? 0)));
        const ledger = { ...(company.deploymentSlotLedger ?? {}) };
        // Application-scoped ledger makes reservation/release idempotent. An
        // absent ledger entry is distinct from an explicit released (false) entry.
        if (applicationId && Object.prototype.hasOwnProperty.call(ledger, applicationId) && ledger[applicationId] === (change === 1)) return;
        if (user.portal === 'supervisor' && company.ownerId !== user.id) {
          failure = new Error('You can only reserve slots for your own company.'); tx.abort(); return;
        }
        if (change === 1 && currentOccupied >= total) {
          failure = new Error('No deployment slots remain for this company.');
          tx.abort();
          return;
        }
        const occupied = Math.max(0, Math.min(total, currentOccupied + change));
        const available = Math.max(0, total - occupied);
        if (applicationId) ledger[applicationId] = change === 1;
        store.put({
          ...company, totalSlots:total, occupiedSlots:occupied, availableSlots:available,
          slotsOpen:available, deploymentSlotLedger: ledger,
          availability:company.status === 'Active' && available > 0 ? 'accepting' : 'not-accepting',
        } satisfies StoredCompany);
      };
      request.onerror = () => { failure = new Error('Unable to read company capacity.'); tx.abort(); };
      tx.oncomplete = () => {
        try { localStorage.setItem('ojtflow_company_records_updated', String(Date.now())); } catch { /* best-effort cross-tab notification */ }
        resolve();
      };
      tx.onerror = () => reject(failure ?? tx.error ?? new Error('Unable to update company deployment slots.'));
      tx.onabort = () => reject(failure ?? tx.error ?? new Error('Company slot update was cancelled.'));
    });
  } finally { db.close(); }
}

function toDirectoryRecord(company: StoredCompany): CompanyRecord {
  return {
    ...company,
    id: company.id, initials: company.initials, name: company.name, location: company.location,
    municipality: company.municipality, program: company.program,
    availability: company.status === 'Active' && company.availableSlots > 0 ? 'accepting' : 'not-accepting',
    slotsOpen: company.availableSlots, description: company.description,
    acceptedPrograms: company.acceptedPrograms ?? [], opportunityFocus: company.opportunityFocus ?? [],
    requirements: company.requirements ?? [], preferredSkills: company.preferredSkills ?? [],
    contactName: company.contactName ?? '', contactRole: company.contactRole ?? '',
    contactPhone: company.contactPhone ?? '', contactEmail: company.contactEmail ?? '',
  };
}

export async function getCompanyDirectory() {
  const user = getSession()?.user;
  if (!user || user.portal !== 'student') throw new Error('Student access is required to browse the company directory.');
  await delay();
  // Students see only active companies that currently have open slots.
  const companies = (await readStoredCompanies())
    .filter(company => Boolean(company.ownerId) && company.published === true && company.status === 'Active' && company.availableSlots > 0)
    .map(toDirectoryRecord);
  return {
    heading: {
      ...mockCompanyDirectoryHeading,
      displayedRange: companies.length ? `Showing 1–${companies.length} of ${companies.length} companies` : 'No companies available',
      totalCompanies: companies.length,
    },
    filters: mockCompanyDirectoryFilters,
    programSection: { ...mockCompanyProgramSection, partnerCount: companies.length },
    companies,
  };
}

export async function getCoordinatorPublishedCompanies() {
  await delay();
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required to browse published companies.');
  // Coordinators can only browse company profiles that the company supervisor has published.
  const records: CompanyManagementRecord[] = (await readStoredCompanies())
    .filter(company => Boolean(company.ownerId) && company.published === true)
    .map(company => ({
      id: company.id, partnerId: company.partnerId, name: company.name, initials: company.initials,
      subtitle: company.subtitle, location: company.location, program: company.program,
      availableSlots: company.availableSlots, totalSlots: Number(company.totalSlots ?? (company.availableSlots + Number(company.occupiedSlots || 0))), occupiedSlots: Number(company.occupiedSlots || 0), status: company.status, logoDataUrl: company.logoDataUrl, acceptedPrograms: company.acceptedPrograms ?? [],
    }));
  return {
    summary: {
      totalCompanies: records.length,
      activeCompanies: records.filter(company => company.status === 'Active').length,
      availableSlots: records.reduce((total, company) => total + (company.status === 'Active' ? company.availableSlots : 0), 0),
    },
    records, programs: mockCompanyPrograms, statuses: mockCompanyStatuses,
  };
}

export async function getCompanyDetails(id: string): Promise<CompanyDetailsRecord> {
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required to view this company record.');
  const company = await getCompanyById(id);
  if (!company || !company.ownerId || company.published !== true) throw new Error('Published company not found. The company may be unpublished or the link is invalid.');
  return {
    companyId: company.id, partnerId: company.partnerId, companyName: company.name,
    initials: company.initials, logoDataUrl: company.logoDataUrl, location: company.location, academicYear: 'A.Y. 2026–2027',
    establishmentType: 'Host Training Establishment (HTE)', availableSlots: company.availableSlots,
    information: {
      companyName: company.name, address: company.companyAddress || '—',
      cityMunicipality: company.municipality || '—', province: company.province || '—',
      email: company.companyEmail || '—', contactNumber: company.companyPhone || '—', website: company.website || '—',
    },
    representative: {
      contactPerson: company.contactName || '—', position: company.contactRole || '—',
      email: company.contactPersonEmail || company.contactEmail || '—', contactNumber: company.contactPhone || '—',
    },
    partnership: {
      acceptedPrograms: (company.acceptedPrograms ?? []).map(code => ({ code, requiredHours: company.academicProgramHours?.[code] ?? 0 })),
      availableSlots: company.availableSlots, allocationNote: '—', companyStatus: company.status,
      partnershipRemarks: company.partnershipRemarks || '—',
      keyRequirements: company.requirements ?? [], preferredSkills: company.preferredSkills ?? [],
    },
    verificationText: 'Company record', lastUpdated: 'Recently updated',
  };
}

export async function getAddCompanyForm() {
  const user = getSession()?.user;
  if (!user || user.portal !== 'supervisor') throw new Error('Supervisor access is required.');
  return { form: mockAddCompanyForm, provinces: mockCompanyProvinces };
}

export async function getEditCompanyForm() {
  const user = getSession()?.user;
  if (!user || user.portal !== 'supervisor') throw new Error('Supervisor access is required.');
  return { form: mockEditCompanyForm, provinces: mockCompanyProvinces };
}


export async function getSupervisorCompany() {
  const user = getSession()?.user;
  if (!user || user.portal !== 'supervisor') throw new Error('Supervisor access is required.');
  return (await readStoredCompanies()).find(company => company.ownerId === user.id);
}

export async function publishSupervisorCompany(published: boolean): Promise<StoredCompany> {
  const company = await getSupervisorCompany();
  if (!company) throw new Error('Create your company profile before publishing it.');

  if (published) {
    const missing = missingCompanyPublishFields(company);
    if (missing.length) throw new Error(`Cannot publish company. Please complete: ${missing.join('; ')}.`);
  }

    const updated = { ...company, published };
  await writeCompany(updated, 'put');
  return updated;
}

/** Registered company totals for Coordinator dashboard; includes unpublished profiles. */
export async function getCoordinatorCompanyStats(program?: string): Promise<{ totalCompanies: number; publishedCompanies: number; activeCompanies: number; availableSlots: number }> {
  const user = getSession()?.user;
  if (!user || user.portal !== 'coordinator') throw new Error('Coordinator access is required.');
  let companies = (await readStoredCompanies()).filter(company => Boolean(company.ownerId));
  const selected = (program || '').trim().toLocaleLowerCase();
  if (selected && selected !== 'all programs (cics)') {
    companies = companies.filter(company => (company.acceptedPrograms || []).some(item => item.trim().toLocaleLowerCase() === selected) || (company.program || '').trim().toLocaleLowerCase() === selected);
  }
  return {
    totalCompanies: companies.length,
    publishedCompanies: companies.filter(company => company.published === true).length,
    activeCompanies: companies.filter(company => company.published === true && company.status === 'Active').length,
    availableSlots: companies.filter(company => company.published === true && company.status === 'Active').reduce((sum, company) => sum + Number(company.availableSlots || 0), 0),
  };
}
