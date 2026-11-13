
// src/ts/core/session.ts

import type { Session } from '../types/user.types';

import {
  saveToStorage,
  readFromStorage,
  removeFromStorage
} from '../utils/storage';

const KEY = 'ojtflow_session';

export function getSession(): Session | null {
  return readFromStorage<Session>(KEY);
}

export function setSession(session: Session): void {
  saveToStorage(KEY, session);
}

export function clearSession(): void {
  removeFromStorage(KEY);
}
