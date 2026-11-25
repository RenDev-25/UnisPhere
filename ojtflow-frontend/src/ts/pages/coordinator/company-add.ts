
import { initAppShell } from '../../core/app-shell';
import { createCompany, getAddCompanyForm } from '../../services/company.service';

// Initialize the coordinator layout.
initAppShell();

type AddCompanyData = Awaited<ReturnType<typeof getAddCompanyForm>>;

// =========================================================
// INITIALIZE ADD COMPANY PAGE
// =========================================================

async function initCompanyAdd(): Promise<void> {
  const data: AddCompanyData = await getAddCompanyForm();
  const mock = data.form;

  // =========================================================
  // 1. GET THE ADD COMPANY FORM
  // =========================================================

  const formElement = document.querySelector<HTMLFormElement>(
    '#company-add-form'
  );

  if (!formElement) {
    console.error('Add Company form was not found.');
    return;
  }

  const form: HTMLFormElement = formElement;

  // Always start a new company record with a clean form. The service supplies
  // blank defaults; reset also clears any browser-restored values from a prior visit.
  form.reset();

  // =========================================================
  // 2. FORM ELEMENTS
  // =========================================================

  const academicYear = document.querySelector<HTMLElement>(
    '[data-js-academic-year]'
  );

  const companyNameInput = form.querySelector<HTMLInputElement>(
    '[data-js-company-name]'
  );

  const companyAddressInput = form.querySelector<HTMLInputElement>(
    '[data-js-company-address]'
  );

  const companyCityInput = form.querySelector<HTMLInputElement>(
    '[data-js-company-city]'
  );

  const companyProvinceInput = form.querySelector<HTMLSelectElement>(
    '[data-js-company-province]'
  );

  const companyEmailInput = form.querySelector<HTMLInputElement>(
    '[data-js-company-email]'
  );

  const companyContactInput = form.querySelector<HTMLInputElement>(
    '[data-js-company-contact]'
  );

  const companyWebsiteInput = form.querySelector<HTMLInputElement>(
    '[data-js-company-website]'
  );

  const contactPersonInput = form.querySelector<HTMLInputElement>(
    '[data-js-contact-person]'
  );

  const contactPositionInput = form.querySelector<HTMLInputElement>(
    '[data-js-contact-position]'
  );

  const contactEmailInput = form.querySelector<HTMLInputElement>(
    '[data-js-contact-email]'
  );

  const contactNumberInput = form.querySelector<HTMLInputElement>(
    '[data-js-contact-number]'
  );

  const slotsInput = form.querySelector<HTMLInputElement>(
    '[data-js-available-slots]'
  );

  const remarksInput = form.querySelector<HTMLTextAreaElement>(
    '[data-js-partnership-remarks]'
  );

  const remarksCounter = form.querySelector<HTMLElement>(
    '[data-js-remarks-counter]'
  );

  const logoInput = form.querySelector<HTMLInputElement>(
    '[data-js-company-logo]'
  );

  const logoDropzone = form.querySelector<HTMLElement>(
    '[data-js-logo-dropzone]'
  );

  const logoPreview = form.querySelector<HTMLElement>(
    '[data-js-logo-preview]'
  );

  const toast = document.querySelector<HTMLElement>(
    '[data-js-company-toast]'
  );

  const programInputs = Array.from(
    form.querySelectorAll<HTMLInputElement>('[data-js-program]')
  );

  const statusInputs = Array.from(
    form.querySelectorAll<HTMLInputElement>('[data-js-company-status]')
  );

  const decreaseSlotsButton = form.querySelector<HTMLButtonElement>(
    '[data-js-slots-decrease]'
  );

  const increaseSlotsButton = form.querySelector<HTMLButtonElement>(
    '[data-js-slots-increase]'
  );

  // =========================================================
  // 3. INITIALIZE FORM DATA
  // =========================================================

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

  // Populate province selector.
  if (companyProvinceInput) {
    companyProvinceInput.replaceChildren();

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select province';

    companyProvinceInput.appendChild(placeholderOption);

    data.provinces.forEach((province) => {
      const option = document.createElement('option');

      option.value = province;
      option.textContent = province;

      companyProvinceInput.appendChild(option);
    });

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

  // Initialize accepted programs.
  programInputs.forEach((input) => {
    const program = mock.partnership.acceptedPrograms.find(
      (item) => item.code === input.value
    );

    input.checked = program?.selected ?? false;
  });

  // Initialize company status.
  statusInputs.forEach((input) => {
    input.checked = input.value === mock.partnership.status;
  });

  if (remarksInput) {
    remarksInput.value = mock.partnership.remarks;
  }

  // =========================================================
  // 4. FIELD ERROR HELPERS
  // =========================================================

  type FormField =
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;

  function showFieldError(
    input: FormField,
    message: string
  ): void {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');

    const field = input.closest('.field');
    const error = field?.querySelector<HTMLElement>(
      '[data-js-error]'
    );

    if (error) {
      error.textContent = message;
    }
  }

  function clearFieldError(input: FormField): void {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');

    const field = input.closest('.field');
    const error = field?.querySelector<HTMLElement>(
      '[data-js-error]'
    );

    if (error) {
      error.textContent = '';
    }
  }

  function showProgramError(message: string): void {
    const error = form.querySelector<HTMLElement>(
      '[data-js-program-error]'
    );

    if (error) {
      error.textContent = message;
    }

    const programGrid = form.querySelector<HTMLElement>(
      '.company-form-program-grid'
    );

    programGrid?.classList.add('is-invalid');
  }

  function clearProgramError(): void {
    const error = form.querySelector<HTMLElement>(
      '[data-js-program-error]'
    );

    if (error) {
      error.textContent = '';
    }

    const programGrid = form.querySelector<HTMLElement>(
      '.company-form-program-grid'
    );

    programGrid?.classList.remove('is-invalid');
  }

  function clearStatusError(): void {
    const statusField = form.querySelector<HTMLElement>(
      '.company-form-status-field'
    );

    const error = statusField?.querySelector<HTMLElement>(
      '[data-js-error]'
    );

    if (error) {
      error.textContent = '';
    }

    statusField?.classList.remove('field--error');

    statusInputs.forEach((input) => {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
    });
  }

  // =========================================================
  // 5. LIVE FIELD VALIDATION
  // =========================================================

  const validatedInputs: FormField[] = [
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
    (input): input is FormField => input !== null
  );

  validatedInputs.forEach((input) => {
    input.addEventListener('input', () => {
      clearFieldError(input);
    });

    input.addEventListener('change', () => {
      clearFieldError(input);
    });
  });

  programInputs.forEach((input) => {
    input.addEventListener('change', clearProgramError);
  });

  statusInputs.forEach((input) => {
    input.addEventListener('change', clearStatusError);
  });

  // =========================================================
  // 6. AVAILABLE OJT SLOTS
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
  // 7. PARTNERSHIP REMARKS CHARACTER COUNTER
  // =========================================================

  function updateRemarksCounter(): void {
    if (!remarksInput || !remarksCounter) return;

    remarksCounter.textContent =
      `${remarksInput.value.length}/500`;
  }

  remarksInput?.addEventListener(
    'input',
    updateRemarksCounter
  );

  updateRemarksCounter();

  // =========================================================
  // 8. COMPANY LOGO UPLOAD AND PREVIEW
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
    information.className =
      'company-logo-preview__information';

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

    if (!allowedLogoTypes.includes(file.type)) {
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
  // 9. FORM VALIDATION
  // =========================================================

  function validateRequiredField(
    input: FormField | null,
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
    if (!input || !input.value.trim()) {
      if (input) clearFieldError(input);
      return true;
    }

    if (!input.checkValidity()) {
      showFieldError(input, message);
      return false;
    }

    clearFieldError(input);
    return true;
  }

  function validatePrograms(): boolean {
    const hasSelectedProgram = programInputs.some(
      (input) => input.checked
    );

    if (!hasSelectedProgram) {
      showProgramError(
        'Please select at least one accepted program.'
      );

      return false;
    }

    clearProgramError();
    return true;
  }

  function validateSlots(): boolean {
    if (!slotsInput) return false;

    const value = Number(slotsInput.value);

    if (!Number.isInteger(value) || value < 1) {
      showFieldError(
        slotsInput,
        'Enter a whole number of at least 1 slot.'
      );

      return false;
    }

    clearFieldError(slotsInput);
    return true;
  }

  function validateStatus(): boolean {
    const selected = statusInputs.some(
      (input) => input.checked
    );

    const statusField = form.querySelector<HTMLElement>(
      '.company-form-status-field'
    );

    const error = statusField?.querySelector<HTMLElement>(
      '[data-js-error]'
    );

    if (!selected) {
      statusField?.classList.add('field--error');

      if (error) {
        error.textContent = 'Please select a company status.';
      }

      statusInputs[0]?.classList.add('is-invalid');
      statusInputs[0]?.setAttribute('aria-invalid', 'true');

      return false;
    }

    clearStatusError();

    return true;
  }

  function validateLogo(): boolean {
    if (!logoInput) return true;

    const file = logoInput.files?.[0];

    // Logo is optional.
    if (!file) return true;

    if (!allowedLogoTypes.includes(file.type)) {
      window.alert('Please upload a PNG, JPG, or SVG logo.');
      return false;
    }

    if (file.size > MAX_LOGO_SIZE) {
      window.alert('The company logo must not exceed 2MB.');
      return false;
    }

    return true;
  }

  function validateRemarks(): boolean {
    if (!remarksInput) return true;

    if (remarksInput.value.length > 500) {
      showFieldError(
        remarksInput,
        'Remarks must not exceed 500 characters.'
      );

      return false;
    }

    clearFieldError(remarksInput);
    return true;
  }

  function validateForm(): boolean {
    const checks = [
      validateRequiredField(
        companyNameInput,
        'Company name'
      ),
      validateRequiredField(
        companyAddressInput,
        'Company address'
      ),
      validateRequiredField(
        companyCityInput,
        'City / Municipality'
      ),
      validateRequiredField(
        companyProvinceInput,
        'Province'
      ),
      validateRequiredField(
        contactPersonInput,
        'Contact person'
      ),
      validatePrograms(),
      validateSlots(),
      validateStatus(),
      validateOptionalInput(
        companyEmailInput,
        'Enter a valid company email.'
      ),
      validateOptionalInput(
        contactEmailInput,
        'Enter a valid representative email.'
      ),
      validateOptionalInput(
        companyWebsiteInput,
        'Enter a valid website URL.'
      ),
      validateLogo(),
      validateRemarks(),
    ];

    return checks.every(Boolean);
  }

  // =========================================================
  // 10. SUCCESS FEEDBACK
  // =========================================================

  function showSuccessToast(): void {
    if (!toast) return;

    toast.hidden = false;

    window.setTimeout(() => {
      toast.hidden = true;
    }, 5000);
  }

  // =========================================================
  // 11. FORM SUBMISSION
  // =========================================================

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      const firstInvalid = form.querySelector<HTMLElement>(
        '.is-invalid, .field--error input, .field--error select, .field--error textarea'
      );
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid?.focus();
      return;
    }

    const selectedPrograms = programInputs.filter(input => input.checked).map(input => input.value);
    const selectedStatus = statusInputs.find(input => input.checked)?.value;
    const logoFile = logoInput?.files?.[0];
    const logoDataUrl = logoFile ? await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Unable to read company logo.'));
      reader.onerror = () => reject(reader.error ?? new Error('Unable to read company logo.'));
      reader.readAsDataURL(logoFile);
    }) : undefined;

    const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    try {
      await createCompany({
        name: companyNameInput?.value ?? '', address: companyAddressInput?.value ?? '',
        municipality: companyCityInput?.value ?? '', province: companyProvinceInput?.value ?? '',
        companyEmail: companyEmailInput?.value ?? '', companyPhone: companyContactInput?.value ?? '',
        website: companyWebsiteInput?.value ?? '', contactName: contactPersonInput?.value ?? '',
        contactRole: contactPositionInput?.value ?? '', contactPersonEmail: contactEmailInput?.value ?? '',
        contactPhone: contactNumberInput?.value ?? '', acceptedPrograms: selectedPrograms,
        slotsOpen: Number(slotsInput?.value ?? 0), status: selectedStatus === 'Inactive' ? 'Inactive' : 'Active',
        partnershipRemarks: remarksInput?.value ?? '', logoDataUrl,
      });
      showSuccessToast();
      window.setTimeout(() => { window.location.href = 'company-management.html'; }, 700);
    } catch (error) {
      console.error('Failed to save company:', error);
      window.alert('The company could not be saved. Please try again.');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  // Clean up the temporary logo preview URL.
  window.addEventListener('beforeunload', () => {
    if (currentLogoUrl) {
      URL.revokeObjectURL(currentLogoUrl);
    }
  });
}

// =========================================================
// LOAD ADD COMPANY PAGE
// =========================================================

void initCompanyAdd().catch((error: unknown) => {
  console.error(
    'Failed to load Add Company form:',
    error
  );
});
