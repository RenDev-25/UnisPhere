import { ENV } from '../core/env';

import {
  mockStudent,
  mockCoordinator,
} from '../mocks/user.mock';

import type {
  Portal,
  Session,
  User,
} from '../types/user.types';

import { getSession, setSession, clearSession } from '../core/session';

const delay = (ms = 250): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

export interface LoginCredentials {
  email: string;
  password: string;
  portal: Portal;
  rememberMe: boolean;
}

export async function login(
  credentials: LoginCredentials,
): Promise<Session> {
  if (!ENV.useMocks) {
    throw new Error(
      'Authentication API integration is not available yet.',
    );
  }

  const email = credentials.email.trim();

  if (!email || !credentials.password.trim()) {
    throw new Error('Email and password are required.');
  }

  await delay();

  const user: User =
    credentials.portal === 'student'
      ? mockStudent
      : mockCoordinator;

  const session: Session = {
    user: { ...user },
    rememberMe: credentials.rememberMe,
  };

  setSession(session);

  return session;
}

export function getCurrentSession(): Session | null {
  return getSession();
}

export function logout(): void {
  clearSession();
}

export function getAuthenticatedUser(): User | null {
  return getSession()?.user ?? null;
}