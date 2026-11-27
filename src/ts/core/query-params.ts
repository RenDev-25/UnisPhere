
// src/ts/core/query-params.ts

export function getQueryParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

export function getRequiredQueryParam(name: string): string {
  const value = getQueryParam(name);

  if (!value || !value.trim()) {
    throw new Error(
      `Missing required URL query parameter: ${name}`
    );
  }

  return value;
}

export function setQueryParam(name: string, value: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set(name, value);

  window.history.replaceState({}, '', url.toString());
}

export function navigateWithQuery(
  path: string,
  params: Record<string, string>
): void {
  const url = new URL(path, window.location.href);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  window.location.href = url.toString();
}
