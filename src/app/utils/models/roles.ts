type RoleModel<T extends string> = { [K in T]: K };

export type RequestRole = 'admin' | 'user';
export type Role = 'ROLE_ADMIN' | 'ROLE_USER';

export const RequestRoles: RoleModel<RequestRole> = {
  admin: 'admin',
  user: 'user'
} as const;

export const Roles: RoleModel<Role> = {
  ROLE_ADMIN: 'ROLE_ADMIN',
  ROLE_USER: 'ROLE_USER',
} as const;
