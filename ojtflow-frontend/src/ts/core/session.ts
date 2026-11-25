
import type { Session } from '../types/user.types';

const KEY = 'ojtflow_session';

function isValidSession(value: unknown): value is Session {

  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as Partial<Session>;

  if (
    !session.user ||
    typeof session.user !== 'object'
  ) {
    return false;
  }

  return (
    (session.user.portal === 'student' ||
      session.user.portal === 'coordinator') &&
    typeof session.user.name === 'string' &&
    typeof session.rememberMe === 'boolean'
  );
}

export function getSession(): Session | null {

  const persistent = localStorage.getItem(KEY);
  const temporary = sessionStorage.getItem(KEY);

  const raw = persistent ?? temporary;

  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isValidSession(parsed)) {
      clearSession();
      return null;
    }

    return parsed;

  } catch {
    clearSession();
    return null;
  }
}

export function setSession(session: Session): void {

  clearSession();

  const storage = session.rememberMe
    ? localStorage
    : sessionStorage;

  storage.setItem(KEY, JSON.stringify(session));
}

export function clearSession(): void {

  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}
