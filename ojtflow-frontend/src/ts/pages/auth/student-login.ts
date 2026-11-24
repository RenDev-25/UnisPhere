
// src/ts/pages/auth/student-login.ts

import {
  mockStudentLoginBrand,
  mockRoleToggle,
  mockStudentLoginForm,
  mockStudentLoginFooter
} from '../../mocks/user.mock';

import { qs } from '../../utils/dom';
import { login } from '../../services/auth.service';
import { isEmail } from '../../utils/validators';

// ==========================================
// RENDER STUDENT LOGIN BRANDING
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


// ==========================================
// RENDER ROLE TOGGLE
// ==========================================

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


// ==========================================
// RENDER STUDENT LOGIN FORM
// ==========================================

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


// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

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


// ==========================================
// RENDER PRIMARY ACTION AND FOOTER
// ==========================================

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
// STUDENT LOGIN — SERVICE INTEGRATION
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

const studentLoginButton = loginForm.querySelector<HTMLButtonElement>(
  'button[type="submit"]'
);


// ==========================================
// FIELD ERROR HANDLING
// ==========================================

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


// ==========================================
// AUTHENTICATION ERROR HANDLING
// ==========================================

function showStudentLoginError(message: string): void {
  let errorElement = loginForm.querySelector<HTMLElement>(
    '[data-js-auth-error]'
  );

  if (!errorElement) {
    errorElement = document.createElement('p');
    errorElement.dataset.jsAuthError = '';
    errorElement.className = 'field__error';
    errorElement.setAttribute('role', 'alert');

    loginForm.append(errorElement);
  }

  errorElement.textContent = message;
}


function clearStudentLoginError(): void {
  loginForm.querySelector('[data-js-auth-error]')?.remove();
}


// ==========================================
// CLEAR ERRORS WHILE TYPING
// ==========================================

studentEmailInput.addEventListener('input', () => {
  if (studentEmailInput.value.trim()) {
    clearStudentFieldError('email');
  }

  clearStudentLoginError();
});


studentPasswordInput.addEventListener('input', () => {
  if (studentPasswordInput.value) {
    clearStudentFieldError('password');
  }

  clearStudentLoginError();
});


// ==========================================
// HANDLE STUDENT LOGIN SUBMISSION
// ==========================================

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = studentEmailInput.value.trim();
  const password = studentPasswordInput.value;

  clearStudentFieldError('email');
  clearStudentFieldError('password');
  clearStudentLoginError();

  let hasError = false;

 if (!email) {
  setStudentFieldError(
    'email',
    'Please enter your institutional email.'
  );

  hasError = true;

} else if (isEmail(email) !== '') {
  setStudentFieldError(
    'email',
    'Please enter a valid email address.'
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

  try {
    if (studentLoginButton) {
      studentLoginButton.disabled = true;
      studentLoginButton.setAttribute('aria-busy', 'true');
    }

    await login({
      email,
      password,
      portal: 'student',
      rememberMe
    });

    window.location.href = '/pages/student/dashboard.html';

  } catch (error) {
    showStudentLoginError(
      error instanceof Error
        ? error.message
        : 'Unable to sign in. Please try again.'
    );

  } finally {
    if (studentLoginButton) {
      studentLoginButton.disabled = false;
      studentLoginButton.removeAttribute('aria-busy');
    }
  }
});
