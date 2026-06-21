export const USER_ROLE = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
