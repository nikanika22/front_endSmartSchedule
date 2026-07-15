export const USER_ROLE = {
  ADMIN: 'admin',
  STUDENT: 'student',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
