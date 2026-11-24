
/* =========================================================
   OJTFLOW — FORM VALIDATOR
   Phase 12 — Stage 12.1
   ========================================================= */

import type { Rule } from '../utils/validators';

export type ValidationRules = Record<string, Rule[]>;

type FieldElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

function getFieldValue(field: FieldElement): string {
  return field.value;
}

/* =========================================================
   FIND FIELD WRAPPER
========================================================= */

function getFieldWrapper(
  field: FieldElement,
): HTMLElement | null {
  return field.closest<HTMLElement>('.field');
}

/* =========================================================
   SHOW FIELD ERROR
========================================================= */

function showFieldError(
  field: FieldElement,
  message: string,
): void {

  const wrapper = getFieldWrapper(field);

  wrapper?.classList.add('field--error');

  field.setAttribute('aria-invalid', 'true');

  const errorSlot = wrapper?.querySelector<HTMLElement>(
    '[data-js-error]',
  );

  if (errorSlot) {
    errorSlot.textContent = message;
  }
}

/* =========================================================
   CLEAR FIELD ERROR
========================================================= */

export function clearFieldError(
  field: FieldElement,
): void {

  const wrapper = getFieldWrapper(field);

  wrapper?.classList.remove('field--error');

  field.removeAttribute('aria-invalid');

  const errorSlot = wrapper?.querySelector<HTMLElement>(
    '[data-js-error]',
  );

  if (errorSlot) {
    errorSlot.textContent = '';
  }
}

/* =========================================================
   VALIDATE INDIVIDUAL FIELD
========================================================= */

export function validateField(
  field: FieldElement,
  rules: Rule[],
): boolean {

  const value = getFieldValue(field);

  const message =
    rules
      .map((rule) => rule(value))
      .find((result) => result !== '') ?? '';

  if (message) {
    showFieldError(field, message);
    return false;
  }

  clearFieldError(field);

  return true;
}

/* =========================================================
   VALIDATE CHECKBOX GROUP
========================================================= */

export function validateCheckboxGroup(
  form: HTMLFormElement,
  name: string,
  message = 'Select at least one option.',
): boolean {

  const checkboxes = Array.from(
    form.querySelectorAll<HTMLInputElement>(
      `input[type="checkbox"][name="${name}"]`,
    ),
  );

  if (checkboxes.length === 0) return true;

  const isValid = checkboxes.some(
    (checkbox) => checkbox.checked,
  );

  const wrapper = checkboxes[0].closest<HTMLElement>('.field');

  const errorSlot = wrapper?.querySelector<HTMLElement>(
    '[data-js-error]',
  );

  wrapper?.classList.toggle('field--error', !isValid);

  if (errorSlot) {
    errorSlot.textContent = isValid ? '' : message;
  }

  checkboxes.forEach((checkbox) => {
    if (isValid) {
      checkbox.removeAttribute('aria-invalid');
    } else {
      checkbox.setAttribute('aria-invalid', 'true');
    }
  });

  return isValid;
}

/* =========================================================
   VALIDATE FILE INPUT
========================================================= */

export function validateFile(
  input: HTMLInputElement,
  validator: (file: File) => string,
): boolean {

  const file = input.files?.[0];

  // Optional file input: no file selected is valid.
  if (!file) {
    clearFieldError(input);
    return true;
  }

  const message = validator(file);

  if (message) {
    showFieldError(input, message);
    return false;
  }

  clearFieldError(input);

  return true;
}

/* =========================================================
   VALIDATE COMPLETE FORM
========================================================= */

export function validateForm(
  form: HTMLFormElement,
  rules: ValidationRules,
): boolean {

  let firstInvalid: FieldElement | null = null;

  for (const [name, fieldRules] of Object.entries(rules)) {

    const element = form.elements.namedItem(name);

    if (
      !element ||
      element instanceof RadioNodeList
    ) {
      continue;
    }

    const field = element as FieldElement;

    if (!validateField(field, fieldRules)) {
      if (!firstInvalid) {
        firstInvalid = field;
      }
    }
  }

  if (firstInvalid) {
  firstInvalid.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });

  firstInvalid.focus();

  return false;
}

  return true;
}

/* =========================================================
   LIVE VALIDATION
========================================================= */

export function enableLiveValidation(
  form: HTMLFormElement,
  rules: ValidationRules,
): void {

  for (const [name, fieldRules] of Object.entries(rules)) {

    const element = form.elements.namedItem(name);

    if (
      !element ||
      element instanceof RadioNodeList
    ) {
      continue;
    }

    const field = element as FieldElement;

    const validate = (): void => {
      validateField(field, fieldRules);
    };

    field.addEventListener('blur', validate);

    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        validate();
      }
    });

    field.addEventListener('change', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        validate();
      }
    });
  }
}
