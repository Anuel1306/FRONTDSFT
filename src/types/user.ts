export const ROLES = ['Admin', 'Committee Member', 'Author'] as const;

export type Role = (typeof ROLES)[number];

export type UserStatus = 'Active' | 'Inactive';

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  status: UserStatus;
  /** ISO date (YYYY-MM-DD) */
  registeredAt: string;
}
