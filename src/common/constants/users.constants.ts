export const ROLE_LIST = ['admin', 'user'] as const;

export type Role = (typeof ROLE_LIST)[number];
