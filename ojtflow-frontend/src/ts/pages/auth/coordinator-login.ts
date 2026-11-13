
// src/ts/pages/auth/coordinator-login.ts

// TEMP MOCK

// TEMP MOCK
import {
  mockCoordinator,
  mockCoordinatorLoginBrand,
  mockCoordinatorRoleToggle,
  mockCoordinatorLoginForm,
  mockCoordinatorInfoNote
} from '../../mocks/user.mock';

import { qs } from '../../utils/dom';
import { setSession } from '../../core/session';

// ==========================================
// 1. BRAND AND HEADING
// ==========================================

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
  brandElement.textContent = mockCoordinatorLoginBrand.brand;
}

if (versionElement) {
  versionElement.textContent = mockCoordinatorLoginBrand.version;
}

if (headingElement) {
  headingElement.textContent = mockCoordinatorLoginBrand.heading;
}

if (subtitleElement) {
  subtitleElement.textContent = mockCoordinatorLoginBrand.subtitle;
}


// ==========================================
// 2. ROLE TOGGLE
// ==========================================

// TEMP MOCK
const roleOptions = document.querySelectorAll<HTMLAnchorElement>(
  '.segmented-control__option'
);

roleOptions.forEach((option, index) => {
  const role = mockCoordinatorRoleToggle[index];

  if (!role) return;

  option.href = role.href;
  option.textContent = role.label;

  option.classList.toggle(
    'segmented-control__option--active',
    role.active
  );

  option.setAttribute(
    'aria-selected',
    String(role.active)
  );

  if (role.active) {
    option.setAttribute('aria-current', 'page');
  } else {
    option.removeAttribute('aria-current');
  }
});


// ==========================================
// 3. FORM FIELDS AND ACTION
// ==========================================

// TEMP MOCK
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

const loginButtonLabel = document.querySelector<HTMLElement>(
  '[data-js-login-label]'
);

const togglePasswordButton = document.querySelector<HTMLButtonElement>(
  '[data-js-toggle-password]'
);


// Email field
if (emailLabel) {
  emailLabel.textContent =
    mockCoordinatorLoginForm.emailLabel;
}

if (emailInput) {
  emailInput.placeholder =
    mockCoordinatorLoginForm.emailPlaceholder;
}


// Password field
if (passwordLabel) {
  passwordLabel.textContent =
    mockCoordinatorLoginForm.passwordLabel;
}

if (passwordInput) {
  passwordInput.placeholder =
    mockCoordinatorLoginForm.passwordPlaceholder;
}


// Remember Me
if (rememberLabel) {
  rememberLabel.textContent =
    mockCoordinatorLoginForm.rememberLabel;
}


// Forgot Password
if (forgotPasswordLink) {
  forgotPasswordLink.textContent =
    mockCoordinatorLoginForm.forgotPasswordLabel;
}


// Login button
if (loginButtonLabel) {
  loginButtonLabel.textContent =
    mockCoordinatorLoginForm.loginButtonLabel;
}


// Show / Hide password
if (passwordInput && togglePasswordButton) {

  togglePasswordButton.addEventListener('click', () => {

    const isPasswordHidden =
      passwordInput.type === 'password';

    passwordInput.type = isPasswordHidden
      ? 'text'
      : 'password';

    togglePasswordButton.textContent = isPasswordHidden
      ? mockCoordinatorLoginForm.hidePasswordLabel
      : mockCoordinatorLoginForm.showPasswordLabel;

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


// ==========================================
// 4. COORDINATOR INFORMATION NOTE
// ==========================================

// TEMP MOCK
const informationMessage = document.querySelector<HTMLElement>(
  '[data-js-info-message]'
);

if (informationMessage) {
  informationMessage.textContent =
    mockCoordinatorInfoNote.message;
}





// ==========================================
// COORDINATOR LOGIN — MOCK SESSION
// ==========================================

const loginForm = qs<HTMLFormElement>('#login-form');

const coordinatorEmailInput = qs<HTMLInputElement>(
  '[data-js-email-input]'
);

const coordinatorPasswordInput = qs<HTMLInputElement>(
  '[data-js-password-input]'
);

const coordinatorRememberInput = qs<HTMLInputElement>(
  'input[name="remember"]'
);

function setCoordinatorFieldError(
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

function clearCoordinatorFieldError(
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
coordinatorEmailInput.addEventListener('input', () => {
  if (coordinatorEmailInput.value.trim()) {
    clearCoordinatorFieldError('email');
  }
});

coordinatorPasswordInput.addEventListener('input', () => {
  if (coordinatorPasswordInput.value) {
    clearCoordinatorFieldError('password');
  }
});


// Handle coordinator login submission
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = coordinatorEmailInput.value.trim();
  const password = coordinatorPasswordInput.value;

  clearCoordinatorFieldError('email');
  clearCoordinatorFieldError('password');

  let hasError = false;

  if (!email) {
    setCoordinatorFieldError(
      'email',
      'Please enter your institutional email.'
    );

    hasError = true;
  }

  if (!password.trim()) {
    setCoordinatorFieldError(
      'password',
      'Please enter your password.'
    );

    hasError = true;
  }

  if (hasError) {
    if (!email) {
      coordinatorEmailInput.focus();
    } else {
      coordinatorPasswordInput.focus();
    }

    return;
  }

  const rememberMe = coordinatorRememberInput.checked;

  setSession({
    user: mockCoordinator,
    rememberMe
  });

  window.location.href = '/pages/coordinator/dashboard.html';
});
