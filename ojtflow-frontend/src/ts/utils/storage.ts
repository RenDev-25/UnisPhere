
// src/ts/utils/storage.ts

export function saveToStorage(
  key: string,
  value: unknown
): void {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function readFromStorage<T>(key: string): T | null {
  const raw = sessionStorage.getItem(key);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
}

export function removeFromStorage(key: string): void {
  sessionStorage.removeItem(key);
}
