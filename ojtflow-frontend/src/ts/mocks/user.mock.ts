
// src/ts/mocks/user.mock.ts
// TEMP MOCK
import type { User, StudentLoginBrand } from '../types/user.types';


export const mockStudent: User = {
  id: 'STU-1',
  name: 'Juan D. Dela Cruz',
  email: 'juan.delacruz@g.batstate-u.edu.ph',
  portal: 'student',
  roleLabel: 'Student',
  identifier: '22-00125',
  program: 'BS Information Technology'
};

export const mockCoordinator: User = {
  id: 'COO-1',
  name: 'Engr. Santos',
  email: 'santos@g.batstate-u.edu.ph',
  portal: 'coordinator',
  roleLabel: 'CICS Faculty Coordinator'
};





// TEMP MOCK
export const mockStudentLoginBrand: StudentLoginBrand = {
  brand: 'OJTFlow',
  version: 'v2.4',
  heading: 'Welcome Back',
  subtitle: 'Sign in to your OJTFlow Student Portal.'
};



// TEMP MOCK — Student login role toggle
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


// TEMP MOCK — Student login form
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



// TEMP MOCK — Student login primary action and footer
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



// TEMP MOCK — Coordinator Login brand and heading

export interface CoordinatorLoginBrandMock {
  brand: string;
  version: string;
  heading: string;
  subtitle: string;
}

export const mockCoordinatorLoginBrand: CoordinatorLoginBrandMock = {
  brand: 'OJTFlow',
  version: 'v2.4',
  heading: 'Coordinator Login',
  subtitle: 'Sign in to your OJTFlow Coordinator Portal.'
};


// TEMP MOCK — Coordinator Login role toggle

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


// TEMP MOCK — Coordinator Login form

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


// TEMP MOCK — Coordinator information note

export interface CoordinatorInfoNoteMock {
  message: string;
}

export const mockCoordinatorInfoNote: CoordinatorInfoNoteMock = {
  message:
    'Coordinator accounts are provided or authorized by the university. Public coordinator registration is not available.',
};
