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
const DB_VERSION = 2;
const STORE_NAME = 'companies';
const DELETED_STORE = 'deletedCompanies';

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
      if (!db.objectStoreNames.contains(DELETED_STORE)) db.createObjectStore(DELETED_STORE, { keyPath: 'id' });
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


async function readDeletedCompanyIds(): Promise<Set<string>> {
  const db = await openDatabase();
  try { return await new Promise((resolve, reject) => {
    const request = db.transaction(DELETED_STORE, 'readonly').objectStore(DELETED_STORE).getAllKeys();
    request.onsuccess = () => resolve(new Set(request.result as string[]));
    request.onerror = () => reject(request.error ?? new Error('Unable to read deleted company records.'));
  }); } finally { db.close(); }
}

/**
 * The coordinator and student mock datasets were created independently and
 * use different IDs for the same five starter entries. Keep their order-based
 * relationship explicit until the project is connected to a real backend.
 */
function getDirectoryCompanyForManagementId(id: string): CompanyRecord | undefined {
  const managementIndex = mockCompanyRecords.findIndex(company => company.id === id);
  return managementIndex >= 0 ? mockCompanies[managementIndex] : undefined;
}

function getManagementCompanyForDirectoryId(id: string): CompanyManagementRecord | undefined {
  const directoryIndex = mockCompanies.findIndex(company => company.id === id);
  return directoryIndex >= 0 ? mockCompanyRecords[directoryIndex] : undefined;
}

function toDirectoryRecord(company: StoredCompany, fallback?: CompanyRecord): CompanyRecord {
  return {
    ...(fallback ?? {} as CompanyRecord),
    ...company,
    id: fallback?.id ?? company.id,
    initials: company.initials,
    name: company.name,
    location: company.location,
    municipality: company.municipality,
    program: company.program,
    availability: company.availableSlots > 0 ? 'accepting' : 'not-accepting',
    slotsOpen: company.availableSlots,
    description: company.description,
    acceptedPrograms: company.acceptedPrograms,
    opportunityFocus: company.opportunityFocus,
    requirements: company.requirements,
    preferredSkills: company.preferredSkills,
    contactName: company.contactName,
    contactRole: company.contactRole,
    contactPhone: company.contactPhone,
    contactEmail: company.contactEmail,
  };
}

export async function getCompanyById(id: string): Promise<StoredCompany | undefined> {
  const stored = (await readStoredCompanies()).find(company => company.id === id);
  if (stored) return stored;
  const legacy = mockCompanyRecords.find(company => company.id === id);
  if (!legacy) return undefined;
  const directoryRecord = mockCompanies.find(company => company.id === id) ?? getDirectoryCompanyForManagementId(id);
  return {
    id: legacy.id, partnerId: legacy.partnerId, name: legacy.name, initials: legacy.initials,
    subtitle: legacy.subtitle, location: legacy.location, municipality: directoryRecord?.municipality || legacy.location,
    province: '', program: legacy.program, availability: 'accepting', slotsOpen: legacy.availableSlots,
    availableSlots: legacy.availableSlots, description: directoryRecord?.description || '',
    acceptedPrograms: directoryRecord?.acceptedPrograms || [legacy.program], opportunityFocus: directoryRecord?.opportunityFocus || [],
    requirements: directoryRecord?.requirements || [], preferredSkills: directoryRecord?.preferredSkills || [],
    contactName: directoryRecord?.contactName || '', contactRole: directoryRecord?.contactRole || '',
    contactPhone: directoryRecord?.contactPhone || '', contactEmail: directoryRecord?.contactEmail || '',
    status: legacy.status, companyStatus: legacy.status, academicProgramHours: { BSIT: 486, BSCS: 500 },
  };
}

export async function updateCompany(id: string, input: Partial<NewCompanyInput>): Promise<StoredCompany> {
  const current = await getCompanyById(id);
  if (!current) throw new Error('Company not found.');
  const name = input.name?.trim() || current.name;
  const acceptedPrograms = input.acceptedPrograms ?? current.acceptedPrograms;
  const slots = input.slotsOpen ?? current.availableSlots;
  const status = input.status ?? current.status;
  const updated: StoredCompany = {
    ...current, ...input, id, name, initials: name.split(/\s+/).slice(0, 3).map(part => part[0]).join('').toUpperCase(),
    municipality: input.municipality ?? current.municipality, province: input.province ?? current.province,
    location: `${input.municipality ?? current.municipality}, ${input.province ?? current.province}`,
    companyAddress: input.address ?? current.companyAddress,
    companyEmail: input.companyEmail ?? current.companyEmail,
    companyPhone: input.companyPhone ?? current.companyPhone,
    website: input.website ?? current.website,
    contactName: input.contactName ?? current.contactName,
    contactRole: input.contactRole ?? current.contactRole,
    contactPhone: input.contactPhone ?? current.contactPhone,
    contactPersonEmail: input.contactPersonEmail ?? current.contactPersonEmail,
    program: acceptedPrograms[0] ?? '', acceptedPrograms, slotsOpen: slots, availableSlots: slots,
    availability: slots > 0 ? 'accepting' : 'not-accepting', status, companyStatus: status,
    description: input.partnershipRemarks ?? current.description,
    contactEmail: input.contactPersonEmail ?? input.companyEmail ?? current.contactEmail,
  };
  const db = await openDatabase();
  try { await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_NAME, DELETED_STORE], 'readwrite');
    tx.objectStore(STORE_NAME).put(updated);
    tx.objectStore(DELETED_STORE).put({ id });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Unable to update company.'));
    tx.onabort = () => reject(tx.error ?? new Error('Company update was cancelled.'));
  }); } finally { db.close(); }
  return updated;
}

export async function deleteCompany(id: string): Promise<void> {
  const db = await openDatabase();
  try { await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_NAME, DELETED_STORE], 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.objectStore(DELETED_STORE).put({ id });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Unable to delete company.'));
    tx.onabort = () => reject(tx.error ?? new Error('Company deletion was cancelled.'));
  }); } finally { db.close(); }
}

const delay = (ms = 120): Promise<void> => new Promise(resolve => window.setTimeout(resolve, ms));

export async function getCompanyDirectory() {
  await delay();
  const stored = await readStoredCompanies();
  const deletedIds = await readDeletedCompanyIds();

  // Apply coordinator deletions to the corresponding student starter records.
  const visibleMocks = mockCompanies.filter(directoryCompany => {
    const managementCompany = getManagementCompanyForDirectoryId(directoryCompany.id);
    return !deletedIds.has(directoryCompany.id)
      && (!managementCompany || !deletedIds.has(managementCompany.id));
  });

  // Coordinator edits to legacy starter records are persisted in IndexedDB
  // under coordinator IDs. Overlay those edits on the matching student record.
  const editedLegacyRecords = stored
    .filter(company => mockCompanyRecords.some(record => record.id === company.id))
    .filter(company => company.status === 'Active')
    .map(company => {
      const directoryRecord = getDirectoryCompanyForManagementId(company.id);
      return toDirectoryRecord(company, directoryRecord);
    });

  const editedDirectoryIds = new Set(editedLegacyRecords.map(company => company.id));
  const uneditedMocks = visibleMocks.filter(company => !editedDirectoryIds.has(company.id));

  // Newly added companies have IDs that do not belong to either mock dataset.
  const addedCompanies = stored
    .filter(company => !mockCompanyRecords.some(record => record.id === company.id))
    .filter(company => company.status === 'Active' && !deletedIds.has(company.id))
    .map(company => toDirectoryRecord(company));

  const companies = [...uneditedMocks, ...editedLegacyRecords, ...addedCompanies];
  return {
    heading: { ...mockCompanyDirectoryHeading, totalCompanies: companies.length },
    filters: mockCompanyDirectoryFilters,
    programSection: { ...mockCompanyProgramSection, partnerCount: companies.length },
    companies,
  };
}

export async function getCompanyManagement() {
  await delay();
  const stored = await readStoredCompanies();
  const deletedIds = await readDeletedCompanyIds();
  const added: CompanyManagementRecord[] = stored.map(c => ({
    id: c.id, partnerId: c.partnerId, name: c.name, initials: c.initials, subtitle: c.subtitle,
    location: c.location, program: c.program, availableSlots: c.availableSlots, status: c.status, logoDataUrl: c.logoDataUrl,
  }));
  const records = [...mockCompanyRecords.filter(company => !deletedIds.has(company.id)), ...added];
  return {
    summary: {
      totalCompanies: records.length,
      activeCompanies: records.filter(c => c.status === 'Active').length,
      availableSlots: records.reduce((total, c) => total + c.availableSlots, 0),
    },
    records, programs: mockCompanyPrograms, statuses: mockCompanyStatuses,
  };
}

export async function getCompanyDetails(id?: string) {
  if (!id) return mockCompanyDetails;
  const company = await getCompanyById(id);
  if (!company) {
    const legacy = mockCompanyRecords.find(item => item.id === id);
    if (legacy) return { ...mockCompanyDetails, companyId: legacy.id, partnerId: legacy.partnerId, companyName: legacy.name, initials: legacy.initials, location: legacy.location, availableSlots: legacy.availableSlots, information: { ...mockCompanyDetails.information, companyName: legacy.name, cityMunicipality: legacy.location }, partnership: { ...mockCompanyDetails.partnership, availableSlots: legacy.availableSlots, companyStatus: legacy.status } };
    throw new Error('Company not found.');
  }
  return {
    companyId: company.id, partnerId: company.partnerId, companyName: company.name, initials: company.initials,
    location: company.location, academicYear: 'A.Y. 2026–2027', establishmentType: 'Host Training Establishment (HTE)',
    availableSlots: company.availableSlots,
    information: { companyName: company.name, address: company.companyAddress || '—', cityMunicipality: company.municipality || '—', province: company.province || '—', email: company.companyEmail || '—', contactNumber: company.companyPhone || '—', website: company.website || '—' },
    representative: { contactPerson: company.contactName || '—', position: company.contactRole || '—', email: company.contactPersonEmail || '—', contactNumber: company.contactPhone || '—' },
    partnership: { acceptedPrograms: company.acceptedPrograms.map(code => ({ code, requiredHours: company.academicProgramHours?.[code] ?? 0 })), availableSlots: company.availableSlots, allocationNote: '—', companyStatus: company.status, partnershipRemarks: company.partnershipRemarks || '—' },
    verificationText: 'Company record', lastUpdated: 'Recently updated'
  };
}
export async function getAddCompanyForm() { return { form: mockAddCompanyForm, provinces: mockCompanyProvinces }; }
export async function getEditCompanyForm() { return { form: mockEditCompanyForm, provinces: mockCompanyProvinces }; }
