
// src/ts/pages/auth/student-login.ts

// TEMP MOCK

import {
  mockStudent,
  mockStudentLoginBrand,
  mockRoleToggle,
  mockStudentLoginForm,
  mockStudentLoginFooter
} from '../../mocks/user.mock';

import { qs } from '../../utils/dom';
import { setSession } from '../../core/session';


// Render student login branding
const brandElement = document.querySelector<HTMLElement>(
  '[data-js-brand]'
);

const versionElement = document.querySelector<HTMLElement>(
  '[data-js-version]'
);

const headingElement = document.querySelector<HTMLElement>(
  '[data-js-heading]'
);

const subtitleElement = document.querySelector<HTMLElement>(
  '[data-js-subtitle]'
);

if (brandElement) {
  brandElement.textContent = mockStudentLoginBrand.brand;
}

if (versionElement) {
  versionElement.textContent = mockStudentLoginBrand.version;
}

if (headingElement) {
  headingElement.textContent = mockStudentLoginBrand.heading;
}

if (subtitleElement) {
  subtitleElement.textContent = mockStudentLoginBrand.subtitle;
}

// TEMP MOCK — Render role toggle data
const roleOptions = document.querySelectorAll<HTMLAnchorElement>(
  '.segmented__option'
);

roleOptions.forEach((option, index) => {
  const role = mockRoleToggle[index];

  if (!role) return;

  option.href = role.href;

  // Update the label without removing existing icons
  const label = option.querySelector('span');

  if (label) {
    label.textContent = role.label;
  } else {
    option.append(document.createTextNode(role.label));
  }

  option.classList.toggle(
    'segmented__option--active',
    role.active
  );

  option.setAttribute(
    'aria-selected',
    String(role.active)
  );
});



// TEMP MOCK — Render student login form
const emailLabel = document.querySelector<HTMLElement>(
  '[data-js-email-label]'
);

const emailInput = document.querySelector<HTMLInputElement>(
  '[data-js-email-input]'
);

const passwordLabel = document.querySelector<HTMLElement>(
  '[data-js-password-label]'
);

const passwordInput = document.querySelector<HTMLInputElement>(
  '[data-js-password-input]'
);

const rememberLabel = document.querySelector<HTMLElement>(
  '[data-js-remember-label]'
);

const forgotPasswordLink = document.querySelector<HTMLElement>(
  '[data-js-forgot-password]'
);

const togglePasswordButton = document.querySelector<HTMLButtonElement>(
  '[data-js-toggle-password]'
);

// Render email field
if (emailLabel) {
  emailLabel.textContent = mockStudentLoginForm.emailLabel;
}

if (emailInput) {
  emailInput.placeholder = mockStudentLoginForm.emailPlaceholder;
}

// Render password field
if (passwordLabel) {
  passwordLabel.textContent = mockStudentLoginForm.passwordLabel;
}

if (passwordInput) {
  passwordInput.placeholder = mockStudentLoginForm.passwordPlaceholder;
}

// Render Remember Me
if (rememberLabel) {
  rememberLabel.textContent = mockStudentLoginForm.rememberLabel;
}

// Render Forgot Password
if (forgotPasswordLink) {
  forgotPasswordLink.textContent =
    mockStudentLoginForm.forgotPasswordLabel;
}

// Show / Hide password
if (passwordInput && togglePasswordButton) {
  togglePasswordButton.addEventListener('click', () => {
    const isPasswordHidden = passwordInput.type === 'password';

    passwordInput.type = isPasswordHidden ? 'text' : 'password';

    togglePasswordButton.textContent = isPasswordHidden
      ? mockStudentLoginForm.hidePasswordLabel
      : mockStudentLoginForm.showPasswordLabel;

    togglePasswordButton.setAttribute(
      'aria-label',
      isPasswordHidden ? 'Hide password' : 'Show password'
    );

    togglePasswordButton.setAttribute(
      'aria-pressed',
      String(isPasswordHidden)
    );
  });
}




// TEMP MOCK — Render primary action and footer
const loginButtonLabel = document.querySelector<HTMLElement>(
  '[data-js-login-label]'
);

const createAccountPrompt = document.querySelector<HTMLElement>(
  '[data-js-create-account-prompt]'
);

const createAccountLink = document.querySelector<HTMLElement>(
  '[data-js-create-account]'
);

const statusMessage = document.querySelector<HTMLElement>(
  '[data-js-status-message]'
);

const academicYear = document.querySelector<HTMLElement>(
  '[data-js-academic-year]'
);

// Render Login button label
if (loginButtonLabel) {
  loginButtonLabel.textContent =
    mockStudentLoginFooter.loginButtonLabel;
}

// Render Create Account footer
if (createAccountPrompt) {
  createAccountPrompt.textContent =
    mockStudentLoginFooter.createAccountPrompt;
}

if (createAccountLink) {
  createAccountLink.textContent =
    mockStudentLoginFooter.createAccountLabel;
}

// Render status line
if (statusMessage) {
  statusMessage.textContent =
    mockStudentLoginFooter.statusMessage;
}

if (academicYear) {
  academicYear.textContent =
    mockStudentLoginFooter.academicYear;
}



// ==========================================
// STUDENT LOGIN — MOCK SESSION
// ==========================================

const loginForm = qs<HTMLFormElement>('#login-form');

const studentEmailInput = qs<HTMLInputElement>(
  '[data-js-email-input]'
);

const studentPasswordInput = qs<HTMLInputElement>(
  '[data-js-password-input]'
);

const studentRememberInput = qs<HTMLInputElement>(
  'input[name="remember"]'
);

function setStudentFieldError(
  fieldName: 'email' | 'password',
  message: string
): void {
  const field = qs<HTMLElement>(
    `[data-js-field="${fieldName}"]`
  );

  const errorElement = qs<HTMLElement>(
    '[data-js-error]',
    field
  );

  field.classList.add('field--error');
  errorElement.textContent = message;

  const input = field.querySelector<HTMLInputElement>('input');

  input?.setAttribute('aria-invalid', 'true');
}

function clearStudentFieldError(
  fieldName: 'email' | 'password'
): void {
  const field = qs<HTMLElement>(
    `[data-js-field="${fieldName}"]`
  );

  const errorElement = qs<HTMLElement>(
    '[data-js-error]',
    field
  );

  field.classList.remove('field--error');
  errorElement.textContent = '';

  const input = field.querySelector<HTMLInputElement>('input');

  input?.removeAttribute('aria-invalid');
}


// Clear errors while typing
studentEmailInput.addEventListener('input', () => {
  if (studentEmailInput.value.trim()) {
    clearStudentFieldError('email');
  }
});

studentPasswordInput.addEventListener('input', () => {
  if (studentPasswordInput.value) {
    clearStudentFieldError('password');
  }
});


// Handle student login submission
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = studentEmailInput.value.trim();
  const password = studentPasswordInput.value;

  clearStudentFieldError('email');
  clearStudentFieldError('password');

  let hasError = false;

  if (!email) {
    setStudentFieldError(
      'email',
      'Please enter your institutional email.'
    );

    hasError = true;
  }

  if (!password.trim()) {
    setStudentFieldError(
      'password',
      'Please enter your password.'
    );

    hasError = true;
  }

  if (hasError) {
    if (!email) {
      studentEmailInput.focus();
    } else {
      studentPasswordInput.focus();
    }

    return;
  }

  const rememberMe = studentRememberInput.checked;

  setSession({
    user: mockStudent,
    rememberMe
  });

  window.location.href = '/pages/student/dashboard.html';
});
