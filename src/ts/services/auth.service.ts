
// src/ts/services/auth.service.ts

import { ENV } from '../core/env';

import { mockCoordinator } from '../mocks/user.mock';

import type {
  Portal,
  Session,
  User,
} from '../types/user.types';

import {
  getSession,
  setSession,
  clearSession,
} from '../core/session';

// =====================================================
// DEFAULT AND ONLY COORDINATOR CREDENTIALS
// =====================================================

const COORDINATOR_EMAIL = 'coordinator@unisphere.edu.ph';
const COORDINATOR_PASSWORD = 'OJTFlow@2026';

// =====================================================
// STUDENT ACCOUNT STORAGE
// =====================================================

const STUDENT_ACCOUNTS_KEY = 'ojtflow_student_accounts';
const SUPERVISOR_ACCOUNTS_KEY = 'ojtflow_supervisor_accounts';

interface StoredStudentAccount { user: User; passwordHash: string; salt: string; }
interface StoredSupervisorAccount { user: User; passwordHash: string; salt: string; }

export interface LoginCredentials {
  email: string;
  password: string;
  portal: Portal;
  rememberMe: boolean;
}

export interface StudentRegistrationInput { name: string; email: string; password: string; studentNumber: string; program: string; }
export interface SupervisorRegistrationInput { name: string; email: string; password: string; }

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const delay = (ms = 250): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function generateSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function getStudentAccounts(): StoredStudentAccount[] {
  try {
    const raw = localStorage.getItem(STUDENT_ACCOUNTS_KEY);

    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStudentAccounts(
  accounts: StoredStudentAccount[],
): void {
  localStorage.setItem(
    STUDENT_ACCOUNTS_KEY,
    JSON.stringify(accounts),
  );
}

// =====================================================
// PASSWORD HASHING - PBKDF2 SHA-256
// =====================================================

async function hashPassword(
  password: string,
  salt: string,
): Promise<string> {

  const saltBytes = Uint8Array.from(
    salt.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)),
  );

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 310000,
      hash: 'SHA-256',
    },
    key,
    256,
  );

  return Array.from(new Uint8Array(bits))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

// =====================================================
// REGISTER NEW STUDENT
// =====================================================

export async function registerStudent(
  input: StudentRegistrationInput,
): Promise<User> {

  if (!ENV.useMocks) {
    throw new Error(
      'Student registration API integration is not available yet.',
    );
  }

  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;
  const studentNumber = input.studentNumber.trim();
  const program = input.program.trim();

  if (!name || !email || !password || !studentNumber || !program) {
    throw new Error(
      'Please complete all required student information.',
    );
  }

  if (password.length < 8) {
    throw new Error(
      'Password must contain at least 8 characters.',
    );
  }

  await delay();

  const accounts = getStudentAccounts();

  // Check duplicate student email.
  const existingAccount = accounts.find(
    (account) =>
      normalizeEmail(account.user.email) === email,
  );

  if (existingAccount) {
    throw new Error(
      'An account with this email address already exists.',
    );
  }

  // Check duplicate student number.
  const existingStudentNumber = accounts.find(
    (account) =>
      account.user.identifier?.trim().toLowerCase() ===
      studentNumber.toLowerCase(),
  );

  if (existingStudentNumber) {
    throw new Error(
      'This student number is already registered.',
    );
  }

  // Create student account.
  const user: User = {
    id: `STU-${crypto.randomUUID()}`,
    name,
    email,
    portal: 'student',
    roleLabel: 'Student',
    identifier: studentNumber,
    program,
  };

  // Generate unique salt and password hash.
  const salt = generateSalt();

  const passwordHash = await hashPassword(
    password,
    salt,
  );

  // Save student account.
  accounts.push({
    user,
    passwordHash,
    salt,
  });

  saveStudentAccounts(accounts);

  return user;
}


function getSupervisorAccounts(): StoredSupervisorAccount[] {
  try { const raw = localStorage.getItem(SUPERVISOR_ACCOUNTS_KEY); const parsed: unknown = raw ? JSON.parse(raw) : []; return Array.isArray(parsed) ? parsed : []; }
  catch { return []; }
}
function saveSupervisorAccounts(accounts: StoredSupervisorAccount[]): void {
  localStorage.setItem(SUPERVISOR_ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function registerSupervisor(input: SupervisorRegistrationInput): Promise<User> {
  if (!ENV.useMocks) throw new Error('Supervisor registration API integration is not available yet.');
  const name = input.name.trim(); const email = normalizeEmail(input.email); const password = input.password;
  if (!name || !email || !password) throw new Error('Full name, email, and password are required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.');
  if (password.length < 8) throw new Error('Password must contain at least 8 characters.');
  await delay();
  const accounts = getSupervisorAccounts();
  if (accounts.some(a => normalizeEmail(a.user.email) === email)) throw new Error('A Supervisor account with this email already exists.');
  const user: User = { id: `SUP-${crypto.randomUUID()}`, name, email, portal: 'supervisor', roleLabel: 'Company Supervisor' };
  const salt = generateSalt(); const passwordHash = await hashPassword(password, salt);
  accounts.push({ user, passwordHash, salt }); saveSupervisorAccounts(accounts);
  return user;
}

// =====================================================
// LOGIN
// =====================================================

export async function login(
  credentials: LoginCredentials,
): Promise<Session> {

  if (!ENV.useMocks) {
    throw new Error(
      'Authentication API integration is not available yet.',
    );
  }

  const email = normalizeEmail(credentials.email);
  const password = credentials.password;

  if (!email || !password) {
    throw new Error(
      'Email and password are required.',
    );
  }

  await delay();

  let user: User;

  // ===================================================
  // STUDENT AUTHENTICATION
  // ===================================================

  if (credentials.portal === 'student') {

    const accounts = getStudentAccounts();

    // Find student using email.
    const account = accounts.find(
      (item) =>
        normalizeEmail(item.user.email) === email,
    );

    if (!account) {
      throw new Error(
        'No student account was found with this email address.',
      );
    }

    // Verify student password.
    const enteredPasswordHash = await hashPassword(
      password,
      account.salt,
    );

    if (enteredPasswordHash !== account.passwordHash) {
      throw new Error(
        'Incorrect email or password.',
      );
    }

    user = { ...account.user };

  }

  // ===================================================
  // SUPERVISOR AUTHENTICATION
  // ===================================================
  else if (credentials.portal === 'supervisor') {
    const account = getSupervisorAccounts().find(item => normalizeEmail(item.user.email) === email);
    if (!account) throw new Error('No Supervisor account was found with this email address. Please register first.');
    const enteredPasswordHash = await hashPassword(password, account.salt);
    if (enteredPasswordHash !== account.passwordHash) throw new Error('Incorrect email or password.');
    user = { ...account.user };
  }

  // ===================================================
  // COORDINATOR AUTHENTICATION
  // ONLY ONE FIXED COORDINATOR ACCOUNT IS ALLOWED
  // ===================================================

  else if (credentials.portal === 'coordinator') {

    const isValidEmail =
      email === normalizeEmail(COORDINATOR_EMAIL);

    const isValidPassword =
      password === COORDINATOR_PASSWORD;

    if (!isValidEmail || !isValidPassword) {
      throw new Error(
        'Invalid coordinator email or password.',
      );
    }

    // Use the official coordinator account.
    user = {
      ...mockCoordinator,
      email: COORDINATOR_EMAIL,
      portal: 'coordinator',
      roleLabel: 'OJT Coordinator',
    };

  }

  else {
    throw new Error('Invalid portal selected.');
  }

  // ===================================================
  // CREATE AUTHENTICATED SESSION
  // ===================================================

  const session: Session = {
    user,
    rememberMe: credentials.rememberMe,
  };

  setSession(session);

  return session;
}

// =====================================================
// SESSION MANAGEMENT
// =====================================================

export function getCurrentSession(): Session | null {
  return getSession();
}

export function logout(): void {
  clearSession();
}

export function getAuthenticatedUser(): User | null {
  return getSession()?.user ?? null;
}
