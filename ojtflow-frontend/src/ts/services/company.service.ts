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
const DB_VERSION = 2;
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
}

interface StoredCompany extends CompanyRecord {
  partnerId: string; subtitle: string; status: 'Active' | 'Inactive';
  availableSlots: number; companyStatus?: 'Active' | 'Inactive';
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported by this browser.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open company storage.'));
  });
}

async function readStoredCompanies(): Promise<StoredCompany[]> {
  const db = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(((request.result ?? []) as StoredCompany[]).filter(company => !LEGACY_SAMPLE_IDS.has(company.id)));
      request.onerror = () => reject(request.error ?? new Error('Unable to read companies.'));
    });
  } finally { db.close(); }
}

async function writeCompany(record: StoredCompany, mode: 'add' | 'put'): Promise<void> {
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME)[mode](record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('Unable to save company.'));
      tx.onabort = () => reject(tx.error ?? new Error('Company save was cancelled.'));
    });
  } finally { db.close(); }
}

export async function createCompany(input: NewCompanyInput): Promise<StoredCompany> {
  const name = input.name.trim();
  if (!name) throw new Error('Company name is required.');
  const slots = Math.max(0, Number.isFinite(input.slotsOpen) ? input.slotsOpen : 0);
  const companyId = `LOCAL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const initials = name.split(/\s+/).slice(0, 3).map(part => part[0]).join('').toUpperCase();
  const program = input.acceptedPrograms[0] ?? '';
  const location = [input.municipality, input.province].filter(Boolean).join(', ');
  const record: StoredCompany = {
    id: companyId, partnerId: `HTE-${new Date().getFullYear()}-${companyId.slice(-6)}`,
    name, initials, subtitle: 'OJT Partner', location, municipality: input.municipality,
    program, availability: slots > 0 && input.status === 'Active' ? 'accepting' : 'not-accepting',
    slotsOpen: slots, availableSlots: slots,
    description: input.partnershipRemarks || 'OJT partner company.',
    acceptedPrograms: [...input.acceptedPrograms], opportunityFocus: [], requirements: [], preferredSkills: [],
    contactName: input.contactName, contactRole: input.contactRole, contactPhone: input.contactPhone,
    contactEmail: input.contactPersonEmail || input.companyEmail,
    logoDataUrl: input.logoDataUrl, companyStatus: input.status, status: input.status,
    province: input.province, companyEmail: input.companyEmail, companyPhone: input.companyPhone,
    website: input.website, partnershipRemarks: input.partnershipRemarks,
    contactPersonEmail: input.contactPersonEmail, companyAddress: input.address,
    academicProgramHours: { BSIT: 486, BSCS: 500 },
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
  const name = input.name?.trim() || current.name;
  const acceptedPrograms = input.acceptedPrograms ?? current.acceptedPrograms;
  const slots = Math.max(0, input.slotsOpen ?? current.availableSlots);
  const status = input.status ?? current.status;
  const municipality = input.municipality ?? current.municipality;
  const province = input.province ?? current.province ?? '';
  const updated: StoredCompany = {
    ...current, ...input, id, name,
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
    slotsOpen: slots, availableSlots: slots,
    availability: slots > 0 && status === 'Active' ? 'accepting' : 'not-accepting',
    status, companyStatus: status,
    description: input.partnershipRemarks ?? current.description,
    partnershipRemarks: input.partnershipRemarks ?? current.partnershipRemarks,
    contactEmail: input.contactPersonEmail ?? input.companyEmail ?? current.contactEmail,
  };
  await writeCompany(updated, 'put');
  return updated;
}

export async function deleteCompany(id: string): Promise<void> {
  const exists = await getCompanyById(id);
  if (!exists) throw new Error('Company not found. It may already have been deleted.');
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
  await delay();
  // Students see only active companies that currently have open slots.
  const companies = (await readStoredCompanies())
    .filter(company => company.status === 'Active' && company.availableSlots > 0)
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

export async function getCompanyManagement() {
  await delay();
  const records: CompanyManagementRecord[] = (await readStoredCompanies()).map(company => ({
    id: company.id, partnerId: company.partnerId, name: company.name, initials: company.initials,
    subtitle: company.subtitle, location: company.location, program: company.program,
    availableSlots: company.availableSlots, status: company.status, logoDataUrl: company.logoDataUrl,
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
  const company = await getCompanyById(id);
  if (!company) throw new Error('Company not found. The company may have been deleted or the link is invalid.');
  return {
    companyId: company.id, partnerId: company.partnerId, companyName: company.name,
    initials: company.initials, location: company.location, academicYear: 'A.Y. 2026–2027',
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
    },
    verificationText: 'Company record', lastUpdated: 'Recently updated',
  };
}

export async function getAddCompanyForm() {
  return { form: mockAddCompanyForm, provinces: mockCompanyProvinces };
}

export async function getEditCompanyForm() {
  return { form: mockEditCompanyForm, provinces: mockCompanyProvinces };
}
