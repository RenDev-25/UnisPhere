
// src/ts/mocks/user.mock.ts
// TEMP MOCK

import type { User, StudentLoginBrand } from '../types/user.types';

// =====================================================
// DEFAULT AND ONLY COORDINATOR ACCOUNT
// =====================================================

export const mockCoordinator: User = {
  id: 'COO-1',
  name: 'Engr. Santos',
  email: 'coordinator@unisphere.edu.ph',
  portal: 'coordinator',
  roleLabel: 'OJT Coordinator',
};

// =====================================================
// STUDENT LOGIN BRAND
// =====================================================

export const mockStudentLoginBrand: StudentLoginBrand = {
  brand: 'UNISphere',
  version: 'v2.4',
  heading: 'Welcome Back',
  subtitle: 'Sign in to your UNISphere Student Portal.',
};

// =====================================================
// ROLE TOGGLE
// =====================================================

export interface RoleToggleOption {
  label: string;
  href: string;
  active: boolean;
}

export const mockRoleToggle: RoleToggleOption[] = [
  {
    label: 'Student',
    href: '/pages/auth/student-login.html',
    active: true,
  },
  {
    label: 'OJT Coordinator',
    href: '/pages/auth/coordinator-login.html',
    active: false,
  },
];

// =====================================================
// STUDENT LOGIN FORM
// =====================================================

export interface StudentLoginFormMock {
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  rememberLabel: string;
  forgotPasswordLabel: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
}

export const mockStudentLoginForm: StudentLoginFormMock = {
  emailLabel: 'Institutional Email Address',
  emailPlaceholder: 'e.g. s.delacruz@university.edu.ph',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  rememberLabel: 'Remember Me',
  forgotPasswordLabel: 'Forgot Password?',
  showPasswordLabel: 'Show',
  hidePasswordLabel: 'Hide',
};

// =====================================================
// STUDENT LOGIN FOOTER
// =====================================================

export interface StudentLoginFooterMock {
  loginButtonLabel: string;
  createAccountPrompt: string;
  createAccountLabel: string;
  statusMessage: string;
  academicYear: string;
}

export const mockStudentLoginFooter: StudentLoginFooterMock = {
  loginButtonLabel: 'Login as Student',
  createAccountPrompt: "Don't have an account?",
  createAccountLabel: 'Create Account',
  statusMessage: 'OJT Management & Verification Subsystem Active',
  academicYear: 'Academic Year 2024-2025',
};

// =====================================================
// COORDINATOR LOGIN BRAND
// =====================================================

export interface CoordinatorLoginBrandMock {
  brand: string;
  version: string;
  heading: string;
  subtitle: string;
}

export const mockCoordinatorLoginBrand: CoordinatorLoginBrandMock = {
  brand: 'UNISphere',
  version: 'v2.4',
  heading: 'Coordinator Login',
  subtitle: 'Sign in to your UNISphere Coordinator Portal.',
};

// =====================================================
// COORDINATOR LOGIN ROLE TOGGLE
// =====================================================

export const mockCoordinatorRoleToggle: RoleToggleOption[] = [
  {
    label: 'Student',
    href: '/pages/auth/student-login.html',
    active: false,
  },
  {
    label: 'OJT Coordinator',
    href: '/pages/auth/coordinator-login.html',
    active: true,
  },
];

// =====================================================
// COORDINATOR LOGIN FORM
// =====================================================

export interface CoordinatorLoginFormMock {
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  rememberLabel: string;
  forgotPasswordLabel: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
  loginButtonLabel: string;
}

export const mockCoordinatorLoginForm: CoordinatorLoginFormMock = {
  emailLabel: 'Institutional Email Address',
  emailPlaceholder: 'Enter your institutional email',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  rememberLabel: 'Remember Me',
  forgotPasswordLabel: 'Forgot Password?',
  showPasswordLabel: 'Show',
  hidePasswordLabel: 'Hide',
  loginButtonLabel: 'Login as Coordinator',
};

// =====================================================
// COORDINATOR INFORMATION NOTE
// =====================================================

export interface CoordinatorInfoNoteMock {
  message: string;
}

export const mockCoordinatorInfoNote: CoordinatorInfoNoteMock = {
  message:
    'Only the official Unisphere OJT Coordinator account is authorized to access this portal. Public coordinator registration is not available.',
};
