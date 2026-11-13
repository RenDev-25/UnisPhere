
 // src/ts/types/user.types.ts

export type Portal = 'student' | 'coordinator';

// Backward-compatible alias for existing code.
export type Role = Portal;

export interface User {
  id: string;
  name: string;
  email: string;
  portal: Portal;
  roleLabel: string;
  identifier?: string;
  program?: string;
}

export interface Session {
  user: User;
  rememberMe: boolean;
}

// TEMP MOCK — Student login branding
export interface StudentLoginBrand {
  brand: string;
  version: string;
  heading: string;
  subtitle: string;
}
