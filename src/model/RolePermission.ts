export enum ROLE {
  PAGOPA_OPERATOR = 'PAGOPA_OPERATOR',
  PSP_ADMIN = 'PSP_ADMIN',
  PSP_OPERATOR = 'PSP_OPERATOR',
  EC_ADMIN = 'EC_ADMIN',
  EC_OPERATOR = 'EC_OPERATOR',
  PT_ADMIN = 'PT_ADMIN',
  PT_OPERATOR = 'PT_OPERATOR',
}

export const permissions = {
  'node-signin': [ROLE.EC_ADMIN, ROLE.PSP_ADMIN, ROLE.PT_ADMIN, ROLE.PT_OPERATOR],
  'iban.view': [ROLE.EC_ADMIN],
  'iban.add': [ROLE.EC_ADMIN],
};

export type PermissionName = keyof typeof permissions;
