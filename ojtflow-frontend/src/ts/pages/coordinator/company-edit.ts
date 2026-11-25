
import { initAppShell } from '../../core/app-shell';
import { getEditCompanyForm, getCompanyById, updateCompany } from '../../services/company.service';

initAppShell();

// =========================================================
// INITIALIZE EDIT COMPANY PAGE
// =========================================================

async function initCompanyEdit(): Promise<void> {
  const data = await getEditCompanyForm();
  const companyId = new URLSearchParams(window.location.search).get('id');
  if (!companyId) throw new Error('Missing company ID in the edit URL.');
  const company = await getCompanyById(companyId);
  if (!company) throw new Error('The selected company could not be found.');
  const mockEditCompanyForm = {
    ...data.form, partnerId: company.partnerId, companyName: company.name, initials: company.initials,
    verificationStatus: 'Company record', recordStatus: company.status,
    logo: { fileName: company.logoDataUrl ? 'Current company logo' : 'No logo uploaded', fileSize: '—', format: '—' },
    lastModified: 'Current record',
    companyDetails: { address: company.companyAddress || '', cityMunicipality: company.municipality || '', province: company.province || '', email: company.companyEmail || '', contactNumber: company.companyPhone || '', website: company.website || '' },
    representative: { contactPerson: company.contactName || '', position: company.contactRole || '', email: company.contactPersonEmail || '', contactNumber: company.contactPhone || '' },
    partnership: { acceptedPrograms: (company.acceptedPrograms || []).map(code => ({ code, selected: true })), availableSlots: company.availableSlots, status: company.status, remarks: company.partnershipRemarks || '' },
  };

  const form = document.querySelector<HTMLFormElement>(
    '[data-js-company-edit-form], #company-edit-form'
  );

  const companyNameInput = document.querySelector<HTMLInputElement>(
    '[data-js-company-name]'
  );

  const addressInput = document.querySelector<HTMLInputElement>(
    '[data-js-company-address]'
  );

  const cityInput = document.querySelector<HTMLInputElement>(
    '[data-js-company-city]'
  );

  const provinceInput = document.querySelector<HTMLSelectElement>(
    '[data-js-company-province]'
  );

  const emailInput = document.querySelector<HTMLInputElement>(
    '[data-js-company-email]'
  );

  const companyContactInput = document.querySelector<HTMLInputElement>(
    '[data-js-company-contact]'
  );

  const websiteInput = document.querySelector<HTMLInputElement>(
    '[data-js-company-website]'
  );

  const contactPersonInput = document.querySelector<HTMLInputElement>(
    '[data-js-contact-person]'
  );

  const positionInput = document.querySelector<HTMLInputElement>(
    '[data-js-contact-position]'
  );

  const representativeEmailInput = document.querySelector<HTMLInputElement>(
    '[data-js-contact-email]'
  );

  const representativeContactInput = document.querySelector<HTMLInputElement>(
    '[data-js-contact-number]'
  );

  const slotsInput = document.querySelector<HTMLInputElement>(
    '[data-js-available-slots]'
  );

  const statusInput = document.querySelector<HTMLSelectElement>(
    '[data-js-company-status]'
  );

  const remarksInput = document.querySelector<HTMLTextAreaElement>(
    '[data-js-partnership-remarks]'
  );

  const logoInput = document.querySelector<HTMLInputElement>(
    '[data-js-company-logo]'
  );

  const logoDropzone = document.querySelector<HTMLElement>(
    '[data-js-logo-dropzone]'
  );

  const activeLogo = document.querySelector<HTMLElement>(
    '[data-js-active-logo]'
  );

  const logoPreview = document.querySelector<HTMLElement>(
    '[data-js-logo-preview]'
  );

  const changeLogoButton = document.querySelector<HTMLButtonElement>(
    '[data-js-change-logo]'
  );

  const removeLogoButton = document.querySelector<HTMLButtonElement>(
    '[data-js-remove-logo]'
  );

  const toast = document.querySelector<HTMLElement>(
    '[data-js-company-toast]'
  );

  const saveButton = document.querySelector<HTMLButtonElement>(
    '[data-js-save-company]'
  );

  const remarksCounter = document.querySelector<HTMLElement>(
    '[data-js-remarks-counter]'
  );

  const slotsTag = document.querySelector<HTMLElement>(
    '[data-js-slots-tag]'
  );

  const programError = document.querySelector<HTMLElement>(
    '[data-js-program-error]'
  );

  const errorElements = Array.from(
    document.querySelectorAll<HTMLElement>('[data-js-error]')
  );

  let selectedLogoUrl: string | null = null;
  let removeExistingLogo = false;
  let toastTimeout: number | undefined;

  // =========================================================
  // REUSABLE HELPER FUNCTIONS
  // =========================================================

  const setText = (selector: string, value: string): void => {
    const element = document.querySelector<HTMLElement>(selector);

    if (element) {
      element.textContent = value;
    }
  };

  const setInputValue = (
    element:
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null,
    value: string
  ): void => {
    if (element) {
      element.value = value;
    }
  };

  // =========================================================
  // 1. INITIALIZE COMPANY RECORD HEADER
  // =========================================================

  setText('[data-js-partner-id]', mockEditCompanyForm.partnerId);
  setText('[data-js-record-company-name]', mockEditCompanyForm.companyName);
  setText('[data-js-company-initials]', mockEditCompanyForm.initials);
  setText('[data-js-logo-initials]', mockEditCompanyForm.initials);
  if (company.logoDataUrl && activeLogo) { activeLogo.hidden = false; const currentLogoImage = activeLogo.querySelector('img'); if (currentLogoImage) { currentLogoImage.src = company.logoDataUrl; currentLogoImage.hidden = false; } }

  setText(
    '[data-js-verification]',
    mockEditCompanyForm.verificationStatus
  );

  setText(
    '[data-js-record-status]',
    mockEditCompanyForm.recordStatus
  );

  setText(
    '[data-js-logo-filename]',
    mockEditCompanyForm.logo.fileName
  );

  setText(
    '[data-js-logo-file-details]',
    `${mockEditCompanyForm.logo.fileSize} · ${mockEditCompanyForm.logo.format}`
  );

  setText(
    '[data-js-last-modified]',
    `Last modified ${mockEditCompanyForm.lastModified} • Changes will immediately update coordinator and student directory listings.`
  );

  // =========================================================
  // 2. PREFILL COMPANY DETAILS
  // =========================================================

  setInputValue(companyNameInput, mockEditCompanyForm.companyName);

  setInputValue(
    addressInput,
    mockEditCompanyForm.companyDetails.address
  );

  setInputValue(
    cityInput,
    mockEditCompanyForm.companyDetails.cityMunicipality
  );

  // Populate province options using the service response.
  if (provinceInput) {
    provinceInput.replaceChildren();

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select province';

    provinceInput.appendChild(placeholderOption);

    data.provinces.forEach((province) => {
      const option = document.createElement('option');

      option.value = province;
      option.textContent = province;

      provinceInput.appendChild(option);
    });

    provinceInput.value = mockEditCompanyForm.companyDetails.province;
  }

  setInputValue(
    emailInput,
    mockEditCompanyForm.companyDetails.email === '—'
      ? ''
      : mockEditCompanyForm.companyDetails.email
  );

  setInputValue(
    companyContactInput,
    mockEditCompanyForm.companyDetails.contactNumber === '—'
      ? ''
      : mockEditCompanyForm.companyDetails.contactNumber
  );

  setInputValue(
    websiteInput,
    mockEditCompanyForm.companyDetails.website
  );

  // =========================================================
  // 3. PREFILL REPRESENTATIVE DETAILS
  // =========================================================

  setInputValue(
    contactPersonInput,
    mockEditCompanyForm.representative.contactPerson
  );

  setInputValue(
    positionInput,
    mockEditCompanyForm.representative.position
  );

  setInputValue(
    representativeEmailInput,
    mockEditCompanyForm.representative.email === '—'
      ? ''
      : mockEditCompanyForm.representative.email
  );

  setInputValue(
    representativeContactInput,
    mockEditCompanyForm.representative.contactNumber === '—'
      ? ''
      : mockEditCompanyForm.representative.contactNumber
  );

  // =========================================================
  // 4. PREFILL PARTNERSHIP DETAILS
  // =========================================================

  document
    .querySelectorAll<HTMLInputElement>('[data-js-program]')
    .forEach((checkbox) => {
      const program = mockEditCompanyForm.partnership.acceptedPrograms.find(
        (item) => item.code === checkbox.dataset.jsProgram
      );

      checkbox.checked = program?.selected ?? false;
    });

  setInputValue(
    slotsInput,
    String(mockEditCompanyForm.partnership.availableSlots)
  );

  setInputValue(
    statusInput,
    mockEditCompanyForm.partnership.status
  );

  setInputValue(
    remarksInput,
    mockEditCompanyForm.partnership.remarks
  );

  // =========================================================
  // 5. REMARKS CHARACTER COUNTER
  // =========================================================

  const updateRemarksCounter = (): void => {
    if (!remarksInput || !remarksCounter) return;

    const currentLength = remarksInput.value.length;

    remarksCounter.textContent = `${currentLength}/500`;

    remarksCounter.classList.toggle(
      'is-limit-reached',
      currentLength >= 500
    );
  };

  remarksInput?.addEventListener('input', updateRemarksCounter);

  updateRemarksCounter();

  // =========================================================
  // 6. AVAILABLE SLOTS STEPPER
  // =========================================================

  const updateSlotsTag = (): void => {
    if (!slotsInput || !slotsTag) return;

    const slots = Math.max(1, Number(slotsInput.value) || 1);

    slotsTag.textContent = `${slots} Slots Configured`;
  };

  document
    .querySelector('[data-js-slots-decrease]')
    ?.addEventListener('click', () => {
      if (!slotsInput) return;

      const currentValue = Number(slotsInput.value) || 1;

      slotsInput.value = String(Math.max(1, currentValue - 1));

      updateSlotsTag();
    });

  document
    .querySelector('[data-js-slots-increase]')
    ?.addEventListener('click', () => {
      if (!slotsInput) return;

      const currentValue = Number(slotsInput.value) || 1;

      slotsInput.value = String(currentValue + 1);

      updateSlotsTag();
    });

  slotsInput?.addEventListener('input', updateSlotsTag);

  updateSlotsTag();

  // =========================================================
  // 7. FORM ERROR HELPERS
  // =========================================================

  const clearFieldError = (
    input:
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null
  ): void => {
    if (!input) return;

    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');

    const field = input.closest<HTMLElement>('.field');

    field?.classList.remove('field--error');

    const error = field?.querySelector<HTMLElement>('[data-js-error]');

    if (error) {
      error.textContent = '';
    }
  };

  const showFieldError = (
    input:
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null,
    message: string
  ): void => {
    if (!input) return;

    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');

    const field = input.closest<HTMLElement>('.field');

    field?.classList.add('field--error');

    const error = field?.querySelector<HTMLElement>('[data-js-error]');

    if (error) {
      error.textContent = message;
    }
  };

  const clearErrors = (): void => {
    errorElements.forEach((error) => {
      error.textContent = '';
    });

    document
      .querySelectorAll<HTMLElement>('.is-invalid')
      .forEach((element) => {
        element.classList.remove('is-invalid');
        element.removeAttribute('aria-invalid');
      });

    document
      .querySelectorAll<HTMLElement>('.field--error')
      .forEach((element) => {
        element.classList.remove('field--error');
      });

    if (programError) {
      programError.textContent = '';
    }

    document
      .querySelector('.company-form-program-grid')
      ?.classList.remove('is-invalid');
  };

  // =========================================================
  // 8. LOGO FILE HANDLING
  // =========================================================

  const clearLogoPreview = (): void => {
    if (selectedLogoUrl) {
      URL.revokeObjectURL(selectedLogoUrl);
      selectedLogoUrl = null;
    }

    if (logoPreview) {
      logoPreview.innerHTML = '';
      logoPreview.hidden = true;
    }
  };

  const showSelectedLogo = (file: File): void => {
    clearLogoPreview();

    selectedLogoUrl = URL.createObjectURL(file);

    if (activeLogo) {
      activeLogo.hidden = true;
    }

    if (logoDropzone) {
      logoDropzone.hidden = true;
    }

    if (logoPreview) {
      logoPreview.hidden = false;

      const previewCard = document.createElement('div');
      previewCard.className = 'company-logo-preview__file';

      const image = document.createElement('img');
      image.className = 'company-logo-preview__image';
      image.src = selectedLogoUrl;
      image.alt = 'Selected company logo preview';

      const information = document.createElement('div');
      information.className = 'company-logo-preview__information';

      const fileName = document.createElement('strong');
      fileName.textContent = file.name;

      const fileDetails = document.createElement('span');

      fileDetails.textContent =
        `${(file.size / 1024).toFixed(1)} KB · ${file.type || 'Unknown format'}`;

      information.append(fileName, fileDetails);
      previewCard.append(image, information);
      logoPreview.append(previewCard);
    }
  };

  const resetLogo = (): void => {
    removeExistingLogo = true;
    clearLogoPreview();

    if (logoInput) {
      logoInput.value = '';
    }

    if (activeLogo) {
      activeLogo.hidden = true;
    }

    if (logoDropzone) {
      logoDropzone.hidden = false;
    }

    clearFieldError(logoInput);
  };

  const validateLogoFile = (file: File): boolean => {
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/svg+xml',
    ];

    const maximumSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      showFieldError(
        logoInput,
        'Please select a PNG, JPG, or SVG logo file.'
      );

      return false;
    }

    if (file.size > maximumSize) {
      showFieldError(
        logoInput,
        'The company logo must not exceed 2MB.'
      );

      return false;
    }

    clearFieldError(logoInput);

    return true;
  };

  changeLogoButton?.addEventListener('click', () => {
    logoInput?.click();
  });

  removeLogoButton?.addEventListener('click', () => {
    resetLogo();
  });

  logoInput?.addEventListener('change', () => {
    const file = logoInput.files?.[0];

    if (!file) return;

    if (!validateLogoFile(file)) {
      logoInput.value = '';
      return;
    }

    showSelectedLogo(file);
  });

  // Drag and drop support.
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

    const file = (event as DragEvent).dataTransfer?.files?.[0];

    if (!file || !logoInput) return;

    const transfer = new DataTransfer();
    transfer.items.add(file);

    logoInput.files = transfer.files;

    logoInput.dispatchEvent(
      new Event('change', { bubbles: true })
    );
  });

  // =========================================================
  // 9. FORM VALIDATION
  // =========================================================

  const validateForm = (): boolean => {
    clearErrors();

    let isValid = true;

    // COMPANY NAME
    if (!companyNameInput?.value.trim()) {
      showFieldError(
        companyNameInput,
        'Company name is required.'
      );

      isValid = false;
    }

    // COMPANY ADDRESS
    if (!addressInput?.value.trim()) {
      showFieldError(
        addressInput,
        'Company address is required.'
      );

      isValid = false;
    }

    // CITY / MUNICIPALITY
    if (!cityInput?.value.trim()) {
      showFieldError(
        cityInput,
        'City or municipality is required.'
      );

      isValid = false;
    }

    // PROVINCE
    if (!provinceInput?.value) {
      showFieldError(
        provinceInput,
        'Please select a province.'
      );

      isValid = false;
    }

    // CONTACT PERSON
    if (!contactPersonInput?.value.trim()) {
      showFieldError(
        contactPersonInput,
        'Contact person is required.'
      );

      isValid = false;
    }

    // COMPANY EMAIL
    if (
      emailInput?.value.trim() &&
      !emailInput.validity.valid
    ) {
      showFieldError(
        emailInput,
        'Please enter a valid company email.'
      );

      isValid = false;
    }

    // REPRESENTATIVE EMAIL
    if (
      representativeEmailInput?.value.trim() &&
      !representativeEmailInput.validity.valid
    ) {
      showFieldError(
        representativeEmailInput,
        'Please enter a valid representative email.'
      );

      isValid = false;
    }

    // WEBSITE
    if (
      websiteInput?.value.trim() &&
      !websiteInput.validity.valid
    ) {
      showFieldError(
        websiteInput,
        'Please enter a valid website URL.'
      );

      isValid = false;
    }

    // ACCEPTED ACADEMIC PROGRAMS
    const selectedPrograms = document.querySelectorAll<HTMLInputElement>(
      '[data-js-program]:checked'
    );

    if (selectedPrograms.length === 0) {
      if (programError) {
        programError.textContent =
          'Select at least one academic program.';
      }

      document
        .querySelector('.company-form-program-grid')
        ?.classList.add('is-invalid');

      isValid = false;
    }

    // AVAILABLE SLOTS
    if (
      !slotsInput ||
      !Number.isInteger(Number(slotsInput.value)) ||
      Number(slotsInput.value) < 1
    ) {
      showFieldError(
        slotsInput,
        'Enter at least one available slot.'
      );

      isValid = false;
    }

    // COMPANY STATUS
    if (!statusInput?.value.trim()) {
      showFieldError(
        statusInput,
        'Please select a company status.'
      );

      isValid = false;
    }

    // COMPANY LOGO
    // Logo is optional. Validate only when a replacement is selected.
    const selectedLogo = logoInput?.files?.[0];

    if (selectedLogo && !validateLogoFile(selectedLogo)) {
      isValid = false;
    }

    // PARTNERSHIP REMARKS
    if (remarksInput && remarksInput.value.length > 500) {
      showFieldError(
        remarksInput,
        'Partnership remarks must not exceed 500 characters.'
      );

      isValid = false;
    }

    return isValid;
  };

  // =========================================================
  // 10. LIVE VALIDATION
  // =========================================================

  const formFields = form?.querySelectorAll<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >('input, select, textarea');

  formFields?.forEach((input) => {
    input.addEventListener('input', () => {
      clearFieldError(input);
    });

    input.addEventListener('change', () => {
      clearFieldError(input);

      // Update accepted programs validation.
      if (input.matches('[data-js-program]')) {
        const selected = document.querySelectorAll(
          '[data-js-program]:checked'
        );

        if (selected.length > 0) {
          if (programError) {
            programError.textContent = '';
          }

          document
            .querySelector('.company-form-program-grid')
            ?.classList.remove('is-invalid');
        }
      }

      // Validate the selected logo immediately.
      if (input.matches('[data-js-company-logo]')) {
        const selectedLogo = logoInput?.files?.[0];

        if (selectedLogo) {
          validateLogoFile(selectedLogo);
        }
      }
    });
  });

  // =========================================================
  // 11. SUCCESS TOAST
  // =========================================================

  const showToast = (): void => {
    if (!toast) return;

    toast.hidden = false;

    if (toastTimeout) {
      window.clearTimeout(toastTimeout);
    }

    toastTimeout = window.setTimeout(() => {
      toast.hidden = true;
    }, 3500);
  };

  // =========================================================
  // 12. SAVE CHANGES — PERSIST TO INDEXEDDB
  // =========================================================

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      const firstInvalid = form.querySelector<HTMLElement>(
        '.is-invalid, .field--error input, .field--error select, .field--error textarea'
      );

      firstInvalid?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      firstInvalid?.focus();

      return;
    }

    const selectedPrograms = Array.from(document.querySelectorAll<HTMLInputElement>('[data-js-program]:checked')).map(checkbox => checkbox.value);
    if (saveButton) { saveButton.disabled = true; saveButton.textContent = 'Saving...'; }
    try {
      let logoDataUrl = removeExistingLogo ? undefined : company.logoDataUrl;
      const file = logoInput?.files?.[0];
      if (file) logoDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Unable to read logo file.')); reader.readAsDataURL(file);
      });
      await updateCompany(companyId, {
        name: companyNameInput?.value.trim() || company.name, address: addressInput?.value.trim() || '',
        municipality: cityInput?.value.trim() || '', province: provinceInput?.value || '',
        companyEmail: emailInput?.value.trim() || '', companyPhone: companyContactInput?.value.trim() || '',
        website: websiteInput?.value.trim() || '', contactName: contactPersonInput?.value.trim() || '',
        contactRole: positionInput?.value.trim() || '', contactPersonEmail: representativeEmailInput?.value.trim() || '',
        contactPhone: representativeContactInput?.value.trim() || '', acceptedPrograms: selectedPrograms,
        slotsOpen: Number(slotsInput?.value), status: (statusInput?.value || 'Active') as 'Active' | 'Inactive',
        partnershipRemarks: remarksInput?.value || '', logoDataUrl,
      });
      showToast();
      window.setTimeout(() => { window.location.href = 'company-management.html'; }, 900);
    } catch (error) {
      console.error('Failed to save company changes:', error);
      window.alert('Unable to save company changes. Please try again.');
    } finally {
      if (saveButton) { saveButton.disabled = false; saveButton.textContent = 'Save Changes'; }
    }
  });

  // =========================================================
  // 13. CLEANUP
  // =========================================================

  // Release the preview URL when leaving the page.
  window.addEventListener('beforeunload', clearLogoPreview);
}

// =========================================================
// LOAD EDIT COMPANY PAGE
// =========================================================

void initCompanyEdit().catch((error: unknown) => {
  console.error('Failed to load Edit Company form:', error);
  window.alert(error instanceof Error ? error.message : 'The selected company could not be loaded.');
  window.location.replace('company-management.html');
});
