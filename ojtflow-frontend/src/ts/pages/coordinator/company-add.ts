
import { initAppShell } from '../../core/app-shell';
import { mockAddCompanyForm } from '../../mocks/company.mock';

// Initialize the coordinator layout.
initAppShell();

// Stop if the page does not contain the Add Company form.
const form = document.querySelector<HTMLFormElement>(
  '#company-add-form'
);

if (!form) {
  throw new Error('Add Company form was not found.');
}

// =========================================================
// 1. FORM ELEMENTS
// =========================================================

const companyNameInput = document.querySelector<HTMLInputElement>(
  '[data-js-company-name]'
);

const companyAddressInput = document.querySelector<HTMLInputElement>(
  '[data-js-company-address]'
);

const companyCityInput = document.querySelector<HTMLInputElement>(
  '[data-js-company-city]'
);

const companyProvinceInput = document.querySelector<HTMLSelectElement>(
  '[data-js-company-province]'
);

const companyEmailInput = document.querySelector<HTMLInputElement>(
  '[data-js-company-email]'
);

const companyContactInput = document.querySelector<HTMLInputElement>(
  '[data-js-company-contact]'
);

const companyWebsiteInput = document.querySelector<HTMLInputElement>(
  '[data-js-company-website]'
);

const contactPersonInput = document.querySelector<HTMLInputElement>(
  '[data-js-contact-person]'
);

const contactPositionInput = document.querySelector<HTMLInputElement>(
  '[data-js-contact-position]'
);

const contactEmailInput = document.querySelector<HTMLInputElement>(
  '[data-js-contact-email]'
);

const contactNumberInput = document.querySelector<HTMLInputElement>(
  '[data-js-contact-number]'
);

const slotsInput = document.querySelector<HTMLInputElement>(
  '[data-js-available-slots]'
);

const remarksInput = document.querySelector<HTMLTextAreaElement>(
  '[data-js-partnership-remarks]'
);

const remarksCounter = document.querySelector<HTMLElement>(
  '[data-js-remarks-counter]'
);

const logoInput = document.querySelector<HTMLInputElement>(
  '[data-js-company-logo]'
);

const logoDropzone = document.querySelector<HTMLElement>(
  '[data-js-logo-dropzone]'
);

const logoPreview = document.querySelector<HTMLElement>(
  '[data-js-logo-preview]'
);

const toast = document.querySelector<HTMLElement>(
  '[data-js-company-toast]'
);

const academicYear = document.querySelector<HTMLElement>(
  '[data-js-academic-year]'
);

const programInputs = Array.from(
  document.querySelectorAll<HTMLInputElement>(
    '[data-js-program]'
  )
);

const statusInputs = Array.from(
  document.querySelectorAll<HTMLInputElement>(
    '[data-js-company-status]'
  )
);

const decreaseSlotsButton = document.querySelector<HTMLButtonElement>(
  '[data-js-slots-decrease]'
);

const increaseSlotsButton = document.querySelector<HTMLButtonElement>(
  '[data-js-slots-increase]'
);

// =========================================================
// 2. INITIALIZE MOCK DATA
// =========================================================

const mock = mockAddCompanyForm;

if (academicYear) {
  academicYear.textContent = mock.academicYear;
}

if (companyNameInput) {
  companyNameInput.value = mock.companyDetails.companyName;
}

if (companyAddressInput) {
  companyAddressInput.value =
    mock.companyDetails.address === '—'
      ? ''
      : mock.companyDetails.address;
}

if (companyCityInput) {
  companyCityInput.value = mock.companyDetails.cityMunicipality;
}

if (companyProvinceInput) {
  companyProvinceInput.value = mock.companyDetails.province;
}

if (companyEmailInput) {
  companyEmailInput.value =
    mock.companyDetails.email === '—'
      ? ''
      : mock.companyDetails.email;
}

if (companyContactInput) {
  companyContactInput.value =
    mock.companyDetails.contactNumber === '—'
      ? ''
      : mock.companyDetails.contactNumber;
}

if (companyWebsiteInput) {
  companyWebsiteInput.value =
    mock.companyDetails.website === '—'
      ? ''
      : mock.companyDetails.website;
}

if (contactPersonInput) {
  contactPersonInput.value = mock.representative.contactPerson;
}

if (contactPositionInput) {
  contactPositionInput.value =
    mock.representative.position === '—'
      ? ''
      : mock.representative.position;
}

if (contactEmailInput) {
  contactEmailInput.value =
    mock.representative.email === '—'
      ? ''
      : mock.representative.email;
}

if (contactNumberInput) {
  contactNumberInput.value =
    mock.representative.contactNumber === '—'
      ? ''
      : mock.representative.contactNumber;
}

if (slotsInput) {
  slotsInput.value = String(mock.partnership.availableSlots);
}

programInputs.forEach((input) => {
  const program = mock.partnership.acceptedPrograms.find(
    (item) => item.code === input.value
  );

  input.checked = program?.selected ?? false;
});

statusInputs.forEach((input) => {
  input.checked = input.value === mock.partnership.status;
});

if (remarksInput) {
  remarksInput.value = mock.partnership.remarks;
}

// =========================================================
// 3. FIELD ERROR HELPERS
// =========================================================

function showFieldError(
  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  message: string
): void {
  input.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');

  const field = input.closest('.field');
  const error = field?.querySelector<HTMLElement>('[data-js-error]');

  if (error) {
    error.textContent = message;
  }
}

function clearFieldError(
  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
): void {
  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');

  const field = input.closest('.field');
  const error = field?.querySelector<HTMLElement>('[data-js-error]');

  if (error) {
    error.textContent = '';
  }
}

const validatedInputs = [
  companyNameInput,
  companyAddressInput,
  companyCityInput,
  companyProvinceInput,
  companyEmailInput,
  companyContactInput,
  companyWebsiteInput,
  contactPersonInput,
  contactPositionInput,
  contactEmailInput,
  contactNumberInput,
  slotsInput,
  remarksInput,
].filter(
  (
    input
  ): input is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
    input !== null
);

validatedInputs.forEach((input) => {
  input.addEventListener('input', () => {
    clearFieldError(input);
  });

  input.addEventListener('change', () => {
    clearFieldError(input);
  });
});

// =========================================================
// 4. AVAILABLE OJT SLOTS
// =========================================================

function updateSlots(amount: number): void {
  if (!slotsInput) return;

  const currentValue = Number(slotsInput.value) || 1;

  slotsInput.value = String(
    Math.max(1, currentValue + amount)
  );

  clearFieldError(slotsInput);
}

decreaseSlotsButton?.addEventListener('click', () => {
  updateSlots(-1);
});

increaseSlotsButton?.addEventListener('click', () => {
  updateSlots(1);
});

// =========================================================
// 5. PARTNERSHIP REMARKS CHARACTER COUNTER
// =========================================================

function updateRemarksCounter(): void {
  if (!remarksInput || !remarksCounter) return;

  const characterCount = remarksInput.value.length;

  remarksCounter.textContent = `${characterCount}/500`;
}

remarksInput?.addEventListener('input', updateRemarksCounter);

updateRemarksCounter();

// =========================================================
// 6. COMPANY LOGO UPLOAD AND PREVIEW
// =========================================================

const MAX_LOGO_SIZE = 2 * 1024 * 1024;

const allowedLogoTypes = [
  'image/png',
  'image/jpeg',
  'image/svg+xml',
];

let currentLogoUrl: string | null = null;

function clearLogoPreview(): void {
  if (currentLogoUrl) {
    URL.revokeObjectURL(currentLogoUrl);
    currentLogoUrl = null;
  }

  if (logoPreview) {
    logoPreview.replaceChildren();
    logoPreview.hidden = true;
  }
}

function showLogoPreview(file: File): void {
  if (!logoPreview) return;

  clearLogoPreview();

  currentLogoUrl = URL.createObjectURL(file);

  const previewCard = document.createElement('div');
  previewCard.className = 'company-logo-preview__file';

  const image = document.createElement('img');
  image.className = 'company-logo-preview__image';
  image.src = currentLogoUrl;
  image.alt = 'Selected company logo';

  const information = document.createElement('div');
  information.className = 'company-logo-preview__information';

  const fileName = document.createElement('strong');
  fileName.textContent = file.name;

  const fileSize = document.createElement('span');
  fileSize.textContent =
    `${(file.size / 1024).toFixed(1)} KB`;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className =
    'btn btn--secondary btn--small company-logo-preview__remove';
  removeButton.textContent = 'Remove logo';

  removeButton.addEventListener('click', () => {
    if (logoInput) {
      logoInput.value = '';
    }

    clearLogoPreview();
  });

  information.append(fileName, fileSize);
  previewCard.append(image, information, removeButton);

  logoPreview.replaceChildren(previewCard);
  logoPreview.hidden = false;
}

function handleLogoFile(file?: File): void {
  if (!file || !logoInput) return;

  const isAllowedType = allowedLogoTypes.includes(file.type);

  if (!isAllowedType) {
    logoInput.value = '';
    clearLogoPreview();

    window.alert('Please upload a PNG, JPG, or SVG logo.');
    return;
  }

  if (file.size > MAX_LOGO_SIZE) {
    logoInput.value = '';
    clearLogoPreview();

    window.alert('The company logo must not exceed 2MB.');
    return;
  }

  showLogoPreview(file);
}

logoInput?.addEventListener('change', () => {
  const file = logoInput.files?.[0];

  if (file) {
    handleLogoFile(file);
  }
});

// Drag-and-drop support.

logoDropzone?.addEventListener('dragover', (event) => {
  event.preventDefault();
  logoDropzone.classList.add('is-dragging');
});

logoDropzone?.addEventListener('dragleave', () => {
  logoDropzone.classList.remove('is-dragging');
});

logoDropzone?.addEventListener('drop', (event) => {
  event.preventDefault();
  logoDropzone.classList.remove('is-dragging');

  const file = event.dataTransfer?.files[0];

  if (!file || !logoInput) return;

  const transfer = new DataTransfer();
  transfer.items.add(file);
  logoInput.files = transfer.files;

  handleLogoFile(file);
});

// =========================================================
// 7. FORM VALIDATION
// =========================================================

function validateRequiredField(
  input: HTMLInputElement | HTMLSelectElement | null,
  label: string
): boolean {
  if (!input) return false;

  if (!input.value.trim()) {
    showFieldError(input, `${label} is required.`);
    return false;
  }

  clearFieldError(input);
  return true;
}

function validateOptionalInput(
  input: HTMLInputElement | null,
  message: string
): boolean {
  if (!input || !input.value.trim()) return true;

  if (!input.checkValidity()) {
    showFieldError(input, message);
    return false;
  }

  clearFieldError(input);
  return true;
}

function validatePrograms(): boolean {
  const programGrid = document.querySelector<HTMLElement>(
    '.company-form-program-grid'
  );

  const hasSelectedProgram = programInputs.some(
    (input) => input.checked
  );

  programGrid?.classList.toggle(
    'is-invalid',
    !hasSelectedProgram
  );

  return hasSelectedProgram;
}

function validateSlots(): boolean {
  if (!slotsInput) return false;

  const value = Number(slotsInput.value);

  if (
    !Number.isInteger(value) ||
    value < 1
  ) {
    showFieldError(
      slotsInput,
      'Enter a whole number of at least 1 slot.'
    );

    return false;
  }

  clearFieldError(slotsInput);
  return true;
}

function validateForm(): boolean {
  const checks = [
    validateRequiredField(companyNameInput, 'Company name'),
    validateRequiredField(companyAddressInput, 'Company address'),
    validateRequiredField(companyCityInput, 'City / Municipality'),
    validateRequiredField(companyProvinceInput, 'Province'),
    validateRequiredField(contactPersonInput, 'Contact person'),
    validatePrograms(),
    validateSlots(),
    validateOptionalInput(companyEmailInput, 'Enter a valid company email.'),
    validateOptionalInput(contactEmailInput, 'Enter a valid representative email.'),
    validateOptionalInput(companyWebsiteInput, 'Enter a valid website URL.'),
  ];

  return checks.every(Boolean);
}

// =========================================================
// 8. SUCCESS FEEDBACK
// =========================================================

function showSuccessToast(): void {
  if (!toast) return;

  toast.hidden = false;

  window.setTimeout(() => {
    toast.hidden = true;
  }, 5000);
}

// =========================================================
// 9. FORM SUBMISSION
// =========================================================

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!validateForm()) {
    const firstInvalid = form.querySelector<HTMLElement>(
      '.is-invalid'
    );

    firstInvalid?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    firstInvalid?.focus();

    return;
  }

  /*
   * Stage 7.7 is a frontend mockup.
   * No company record is sent to a backend or permanently saved here.
   */

  showSuccessToast();
});
