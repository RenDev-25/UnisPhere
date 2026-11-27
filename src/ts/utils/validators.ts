
/* =========================================================
   OJTFLOW — SHARED VALIDATION RULES
   Phase 12 — Validation, States and Safe Rendering
   ========================================================= */

export type Rule = (value: string) => string;

/* =========================================================
   REQUIRED FIELD
========================================================= */

export const required: Rule = (value) =>
  value.trim() !== ''
    ? ''
    : 'This field is required.';

/* =========================================================
   EMAIL
========================================================= */

export const isEmail: Rule = (value) =>
  value.trim() === '' ||
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? ''
    : 'Enter a valid email address.';

/* =========================================================
   PHONE NUMBER
========================================================= */

export const isPhone: Rule = (value) =>
  value.trim() === '' ||
  /^[+]?[\d\s()-]{7,20}$/.test(value.trim())
    ? ''
    : 'Enter a valid contact number.';

/* =========================================================
   MAXIMUM CHARACTER LENGTH
========================================================= */

export const maxLength = (limit: number): Rule => (value) =>
  value.length <= limit
    ? ''
    : `Must be ${limit} characters or fewer.`;

/* =========================================================
   MINIMUM CHARACTER LENGTH
========================================================= */

export const minLength = (limit: number): Rule => (value) =>
  value.length >= limit
    ? ''
    : `Must contain at least ${limit} characters.`;

/* =========================================================
   NUMBER RANGE
========================================================= */

export const minNumber = (minimum: number): Rule => (value) =>
  value.trim() === '' || Number(value) >= minimum
    ? ''
    : `Must be ${minimum} or more.`;

export const maxNumber = (maximum: number): Rule => (value) =>
  value.trim() === '' || Number(value) <= maximum
    ? ''
    : `Must be ${maximum} or less.`;

export const numberRange = (
  minimum: number,
  maximum: number,
): Rule => (value) => {
  if (value.trim() === '') return '';

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 'Enter a valid number.';
  }

  if (number < minimum || number > maximum) {
    return `Enter a number between ${minimum} and ${maximum}.`;
  }

  return '';
};

/* =========================================================
   WEBSITE URL
========================================================= */

export const isUrl: Rule = (value) => {
  if (value.trim() === '') return '';

  try {
    const url = new URL(value);

    return ['http:', 'https:'].includes(url.protocol)
      ? ''
      : 'Enter a valid website URL.';
  } catch {
    return 'Enter a valid website URL.';
  }
};

/* =========================================================
   FILE VALIDATION
========================================================= */

export const allowedFile = (
  types: string[],
  maxBytes: number,
) => (file: File): string => {

  if (!types.includes(file.type)) {
    return 'File type is not allowed.';
  }

  if (file.size > maxBytes) {
    return 'File is too large.';
  }

  return '';
};

/* =========================================================
   OJTFLOW COMPANY LOGO RULE
========================================================= */

export const companyLogoRule = allowedFile(
  [
    'image/png',
    'image/jpeg',
    'image/svg+xml',
  ],
  2 * 1024 * 1024,
);
