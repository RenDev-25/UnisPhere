import { initAppShell } from '../../core/app-shell';
import {
  createCompany,
  getSupervisorCompany,
  updateCompany,
  publishSupervisorCompany,
  type NewCompanyInput,
} from '../../services/company.service';

initAppShell();

const form = document.querySelector<HTMLFormElement>('#sup-company-form');
const message = document.querySelector<HTMLElement>('#sup-company-message');
const publish = document.querySelector<HTMLButtonElement>('#sup-publish');
const logoInput = document.querySelector<HTMLInputElement>('#company-logo-file');
const logoPreview = document.querySelector<HTMLImageElement>('#company-logo-preview');
const logoPlaceholder = document.querySelector<HTMLElement>('#company-logo-placeholder');
const logoFilename = document.querySelector<HTMLElement>('#company-logo-filename');
let companyId = '';
let logoDataUrl = '';

function showMessage(text: string): void {
  if (message) message.textContent = text;
}

function setLogoPreview(dataUrl: string): void {
  if (logoPreview) {
    logoPreview.src = dataUrl;
    logoPreview.hidden = !dataUrl;
  }
  if (logoPlaceholder) logoPlaceholder.hidden = Boolean(dataUrl);
}

function fill(company: any): void {
  if (!form) return;
  const values: Record<string, unknown> = {
    name: company.name,
    companyEmail: company.companyEmail,
    companyPhone: company.companyPhone,
    website: company.website,
    address: company.companyAddress,
    province: company.province,
    contactName: company.contactName,
    contactRole: company.contactRole,
    contactPersonEmail: company.contactPersonEmail,
    contactPhone: company.contactPhone,
    slotsOpen: company.totalSlots ?? company.availableSlots,
    partnershipRemarks: company.partnershipRemarks,
    keyRequirements: (company.requirements || []).join('\n'),
    preferredSkills: (company.preferredSkills || []).join('\n'),
  };

  Object.entries(values).forEach(([key, value]) => {
    const element = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement | null;
    if (element && 'value' in element) element.value = String(value ?? '');
  });

  const accepted = new Set<string>(company.acceptedPrograms || []);
  form.querySelectorAll<HTMLInputElement>('input[name="acceptedPrograms"]').forEach((checkbox) => {
    checkbox.checked = accepted.has(checkbox.value);
  });

  companyId = company.id;
  logoDataUrl = company.logoDataUrl || '';
  setLogoPreview(logoDataUrl);
  if (logoFilename) logoFilename.textContent = logoDataUrl ? 'Saved company logo' : 'No file selected';

  const slotSummary = document.querySelector<HTMLElement>('#sup-company-slot-summary');
  if (slotSummary) {
    slotSummary.textContent = `Registered capacity: ${company.totalSlots ?? company.availableSlots} · Occupied: ${company.occupiedSlots ?? 0} · Available: ${company.availableSlots ?? 0}`;
  }
  if (publish) {
    publish.disabled = false;
    publish.textContent = company.published ? 'Unpublish Company' : 'Publish Company';
  }
}

void getSupervisorCompany()
  .then((company) => {
    if (company) fill(company);
    else if (publish) publish.disabled = true;
  })
  .catch((error) => showMessage(error instanceof Error ? error.message : 'Unable to load company profile.'));

logoInput?.addEventListener('change', () => {
  const file = logoInput.files?.[0];
  if (!file) return;
  const allowed = ['image/png', 'image/jpeg', 'image/webp'];
  if (!allowed.includes(file.type)) {
    logoInput.value = '';
    if (logoFilename) logoFilename.textContent = 'No file selected';
    showMessage('Invalid logo format. Choose a PNG, JPG, or WebP image.');
    return;
  }
  if (file.size === 0 || file.size > 2 * 1024 * 1024) {
    logoInput.value = '';
    if (logoFilename) logoFilename.textContent = 'No file selected';
    showMessage('Company logo must be a valid image no larger than 2 MB.');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result !== 'string') {
      showMessage('Unable to read the selected logo.');
      return;
    }
    logoDataUrl = reader.result;
    setLogoPreview(logoDataUrl);
    if (logoFilename) logoFilename.textContent = file.name;
    showMessage('Logo preview ready. Save the profile to store it.');
  };
  reader.onerror = () => showMessage('Unable to read the selected logo.');
  reader.readAsDataURL(file);
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const acceptedPrograms = Array.from(
    form.querySelectorAll<HTMLInputElement>('input[name="acceptedPrograms"]:checked'),
  ).map((checkbox) => checkbox.value);
  if (acceptedPrograms.length === 0) {
    showMessage('Select at least one accepted academic program.');
    form.querySelector<HTMLInputElement>('input[name="acceptedPrograms"]')?.focus();
    return;
  }
  if (!logoDataUrl) {
    showMessage('Company logo is required. Please select a PNG, JPG, or WebP logo before saving.');
    logoInput?.focus();
    return;
  }

  const data = new FormData(form);
  const website = String(data.get('website') || '').trim();
  const input: NewCompanyInput = {
    name: String(data.get('name') || '').trim(),
    companyEmail: String(data.get('companyEmail') || '').trim(),
    companyPhone: String(data.get('companyPhone') || '').trim(),
    website,
    address: String(data.get('address') || '').trim(),
    // Kept as an empty legacy field for the existing CompanyRecord schema.
    // Municipality is no longer collected or required by the supervisor form.
    municipality: '',
    province: String(data.get('province') || '').trim(),
    contactName: String(data.get('contactName') || '').trim(),
    contactRole: String(data.get('contactRole') || '').trim(),
    contactPersonEmail: String(data.get('contactPersonEmail') || '').trim(),
    contactPhone: String(data.get('contactPhone') || '').trim(),
    slotsOpen: Number(data.get('slotsOpen') || 0),
    acceptedPrograms,
    status: 'Active',
    partnershipRemarks: String(data.get('partnershipRemarks') || '').trim(),
    keyRequirements: String(data.get('keyRequirements') || '').split(/\n|,/).map((item) => item.trim()).filter(Boolean),
    preferredSkills: String(data.get('preferredSkills') || '').split(/\n|,/).map((item) => item.trim()).filter(Boolean),
    logoDataUrl,
  };

  try {
    const saved = companyId ? await updateCompany(companyId, input) : await createCompany(input);
    fill(saved);
    showMessage('Company profile and logo saved. Review the details, then publish it when ready.');
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'Unable to save company profile.');
  }
});

publish?.addEventListener('click', async () => {
  try {
    const current = await getSupervisorCompany();
    const updated = await publishSupervisorCompany(!(current?.published));
    publish.textContent = updated.published ? 'Unpublish Company' : 'Publish Company';
    showMessage(updated.published
      ? 'Your company is now published and visible to students.'
      : 'Your company is unpublished and hidden from students.');
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'Unable to change publication status.');
  }
});

window.addEventListener('storage', (event) => {
  if (event.key === 'ojtflow_company_records_updated' || event.key === 'ojtflow_deployments') {
    void getSupervisorCompany().then((company) => { if (company) fill(company); });
  }
});
