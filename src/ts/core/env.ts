
export const ENV = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  useMocks: import.meta.env.VITE_USE_MOCKS === 'true',
} as const;
