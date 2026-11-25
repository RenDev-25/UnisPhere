import {
  mockCompanyRecords,
  mockCompanyPrograms,
  mockCompanyStatuses,
  mockCompanyDetails,
  mockAddCompanyForm,
  mockEditCompanyForm,
  mockCompanyProvinces,
  mockCompanyDirectoryHeading,
  mockCompanyDirectoryFilters,
  mockCompanyProgramSection,
  mockCompanies,
  type CompanyManagementRecord,
} from '../mocks/company.mock';

import type { CompanyRecord } from '../types/company.types';

const DB_NAME = 'ojtflow-local';
const DB_VERSION = 1;
const STORE_NAME = 'companies';

export interface NewCompanyInput {
  name: string; address: string; municipality: string; province: string;
  companyEmail: string; companyPhone: string; website: string;
  contactName: string; contactRole: string; contactPersonEmail: string;
  contactPhone: string; acceptedPrograms: string[]; slotsOpen: number;
  status: 'Active' | 'Inactive'; partnershipRemarks: string; logoDataUrl?: string;
}

interface StoredCompany extends CompanyRecord {
  partnerId: string; subtitle: string; status: 'Active' | 'Inactive';
  availableSlots: number;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('IndexedDB is not supported by this browser.')); return; }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open company storage.'));
  });
}

async function readStoredCompanies(): Promise<StoredCompany[]> {
  const db = await openDatabase();
  try { return await new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as StoredCompany[]);
    request.onerror = () => reject(request.error ?? new Error('Unable to read companies.'));
  }); } finally { db.close(); }
}

export async function createCompany(input: NewCompanyInput): Promise<StoredCompany> {
  const companyId = `LOCAL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const initials = input.name.trim().split(/\s+/).slice(0, 3).map(part => part[0]).join('').toUpperCase();
  const program = input.acceptedPrograms[0] ?? '';
  const location = `${input.municipality}, ${input.province}`;
  const record: StoredCompany = {
    id: companyId, partnerId: `HTE-${new Date().getFullYear()}-${companyId.slice(-6)}`,
    name: input.name.trim(), initials, subtitle: 'New OJT Partner', location, municipality: input.municipality,
    program, availability: input.slotsOpen > 0 ? 'accepting' : 'not-accepting', slotsOpen: input.slotsOpen,
    description: input.partnershipRemarks || 'OJT partner company.', acceptedPrograms: input.acceptedPrograms,
    opportunityFocus: [], requirements: [], preferredSkills: [], contactName: input.contactName,
    contactRole: input.contactRole, contactPhone: input.contactPhone, contactEmail: input.contactPersonEmail || input.companyEmail,
    logoDataUrl: input.logoDataUrl, companyStatus: input.status, province: input.province,
    companyEmail: input.companyEmail, companyPhone: input.companyPhone, website: input.website,
    partnershipRemarks: input.partnershipRemarks, contactPersonEmail: input.contactPersonEmail, companyAddress: input.address,
    academicProgramHours: { BSIT: 486, BSCS: 500 },
    availableSlots: input.slotsOpen, status: input.status,
  };
  const db = await openDatabase();
  try { await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).add(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Unable to save company.'));
    tx.onabort = () => reject(tx.error ?? new Error('Company save was cancelled.'));
  }); } finally { db.close(); }
  return record;
}

const delay = (ms = 120): Promise<void> => new Promise(resolve => window.setTimeout(resolve, ms));

export async function getCompanyDirectory() {
  await delay();
  const stored = await readStoredCompanies();
  const added: CompanyRecord[] = stored.filter(c => c.status === 'Active').map(c => ({
    ...c, availability: c.availableSlots > 0 ? 'accepting' : 'not-accepting',
  }));
  const companies = [...mockCompanies, ...added];
  return {
    heading: { ...mockCompanyDirectoryHeading, totalCompanies: companies.length },
    filters: mockCompanyDirectoryFilters, programSection: { ...mockCompanyProgramSection, partnerCount: companies.length },
    companies,
  };
}

export async function getCompanyManagement() {
  await delay();
  const stored = await readStoredCompanies();
  const added: CompanyManagementRecord[] = stored.map(c => ({
    id: c.id, partnerId: c.partnerId, name: c.name, initials: c.initials, subtitle: c.subtitle,
    location: c.location, program: c.program, availableSlots: c.availableSlots, status: c.status, logoDataUrl: c.logoDataUrl,
  }));
  const records = [...mockCompanyRecords, ...added];
  return {
    summary: {
      totalCompanies: records.length,
      activeCompanies: records.filter(c => c.status === 'Active').length,
      availableSlots: records.reduce((total, c) => total + c.availableSlots, 0),
    },
    records, programs: mockCompanyPrograms, statuses: mockCompanyStatuses,
  };
}

export async function getCompanyDetails() { return mockCompanyDetails; }
export async function getAddCompanyForm() { return { form: mockAddCompanyForm, provinces: mockCompanyProvinces }; }
export async function getEditCompanyForm() { return { form: mockEditCompanyForm, provinces: mockCompanyProvinces }; }
