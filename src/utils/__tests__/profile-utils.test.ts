import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { Party } from '../../model/Party';
import {
  applyTokenRolesToParty,
  currentSessionTokenHasRoles,
  getActiveRoleKeyFromCurrentToken,
  getActiveTokenRole,
  getJwtPayload,
  getPartyProfileContext,
  getProfileContext,
  getProfileInitials,
  getProfileLabel,
  getProfileOptions,
  getRoleLabelKey,
  getTokenRoles,
} from '../profile-utils';

const buildToken = (payload: Record<string, unknown>): string =>
  `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`;

afterEach(() => {
  window.localStorage.clear();
});

describe('getJwtPayload', () => {
  test('returns null when no token is provided', () => {
    expect(getJwtPayload(undefined)).toBeNull();
  });

  test('decodes a valid token payload', () => {
    const token = buildToken({ uid: '1', name: 'Mario' });
    expect(getJwtPayload(token)).toEqual({ uid: '1', name: 'Mario' });
  });
});

describe('getTokenRoles', () => {
  test('returns an empty array when there is no roles claim', () => {
    expect(getTokenRoles(undefined)).toEqual([]);
    expect(getTokenRoles({} as any)).toEqual([]);
  });

  test('reads roles from an array claim', () => {
    const roles = getTokenRoles({
      roles: [
        { partyRole: 'MANAGER', role: 'admin' },
        { partyRole: 'OPERATOR', role: 'operator' },
      ],
    } as any);
    expect(roles).toEqual([
      { partyRole: 'MANAGER', role: 'admin' },
      { partyRole: 'OPERATOR', role: 'operator' },
    ]);
  });

  test('reads a single role object claim', () => {
    const roles = getTokenRoles({ roles: { partyRole: 'MANAGER', role: 'admin' } } as any);
    expect(roles).toEqual([{ partyRole: 'MANAGER', role: 'admin' }]);
  });

  test('parses a JSON-stringified roles claim', () => {
    const roles = getTokenRoles({
      roles: JSON.stringify([{ partyRole: 'MANAGER', role: 'admin' }]),
    } as any);
    expect(roles).toEqual([{ partyRole: 'MANAGER', role: 'admin' }]);
  });

  test('falls back to organization.roles when the roles claim is missing', () => {
    const roles = getTokenRoles({
      organization: { roles: [{ partyRole: 'MANAGER', role: 'admin' }] },
    } as any);
    expect(roles).toEqual([{ partyRole: 'MANAGER', role: 'admin' }]);
  });

  test('filters out malformed role entries', () => {
    const roles = getTokenRoles({
      roles: [
        { partyRole: 'MANAGER', role: 'admin' },
        { role: 'missingPartyRole' },
        'not-an-object',
        42,
      ],
    } as any);
    expect(roles).toEqual([{ partyRole: 'MANAGER', role: 'admin' }]);
  });
});

describe('getActiveTokenRole', () => {
  const roles = [
    { partyRole: 'MANAGER', role: 'admin' },
    { partyRole: 'OPERATOR', role: 'operator' },
  ];

  test('returns undefined when payload is missing', () => {
    expect(getActiveTokenRole(undefined)).toBeUndefined();
  });

  test('returns the first role when org_role is not present', () => {
    expect(getActiveTokenRole({ roles } as any)).toEqual(roles[0]);
  });

  test('returns the role matching org_role', () => {
    expect(getActiveTokenRole({ roles, org_role: 'operator' } as any)).toEqual(roles[1]);
  });

  test('builds a fallback role when org_role does not match any known role', () => {
    expect(
      getActiveTokenRole({ roles, org_role: 'admin-psp', org_party_role: 'MANAGER' } as any)
    ).toEqual({ partyRole: 'MANAGER', role: 'admin-psp' });
  });

  test('falls back to the first known role partyRole when org_party_role is missing', () => {
    expect(getActiveTokenRole({ roles, org_role: 'admin-psp' } as any)).toEqual({
      partyRole: 'MANAGER',
      role: 'admin-psp',
    });
  });
});

describe('getActiveRoleKeyFromCurrentToken', () => {
  test('returns undefined when there is no stored token', () => {
    expect(getActiveRoleKeyFromCurrentToken()).toBeUndefined();
  });

  test('reads the active role from the stored session token', () => {
    storageTokenOps.write(
      buildToken({ org_role: 'operator', roles: [{ partyRole: 'OPERATOR', role: 'operator' }] })
    );
    expect(getActiveRoleKeyFromCurrentToken()).toBe('operator');
  });
});

describe('getProfileContext', () => {
  test.each([
    ['operator-pt', undefined, 'PT'],
    [undefined, 'PT', 'PT'],
    ['admin-psp', undefined, 'PSP'],
    ['operator-psp', undefined, 'PSP'],
    [undefined, 'PSP', 'PSP'],
    ['admin', undefined, 'EC'],
    ['operator', undefined, 'EC'],
    [undefined, 'EC', 'EC'],
    [undefined, undefined, 'UNKNOWN'],
    ['unknown-role', 'EC', 'EC'],
  ] as const)('roleKey=%s institutionType=%s => %s', (roleKey, institutionType, expected) => {
    expect(getProfileContext(roleKey, institutionType)).toBe(expected);
  });
});

describe('getPartyProfileContext', () => {
  test('derives the context from the first role, which takes priority over institution type', () => {
    const party = {
      roles: [{ partyRole: 'MANAGER', roleKey: 'admin-psp', roleLabel: '' }],
      institutionType: 'EC',
    } as Party;
    expect(getPartyProfileContext(party)).toBe('PSP');
  });

  test('returns UNKNOWN when party is undefined', () => {
    expect(getPartyProfileContext(undefined)).toBe('UNKNOWN');
  });
});

describe('getProfileLabel', () => {
  test.each([
    ['operator-pt', undefined, 'Partner Tecnologico'],
    ['admin-psp', undefined, 'Prestatore Servizi di Pagamento'],
    ['admin', 'EC', 'Ente Creditore'],
    ['something-else', undefined, 'something-else'],
  ] as const)('roleKey=%s institutionType=%s => %s', (roleKey, institutionType, expected) => {
    expect(getProfileLabel(roleKey, institutionType)).toBe(expected);
  });
});

describe('getProfileInitials', () => {
  test.each([
    ['admin', 'EC', 'EC'],
    ['admin-psp', undefined, 'PSP'],
    ['operator-pt', undefined, 'PT'],
    [undefined, undefined, 'AR'],
  ] as const)('roleKey=%s institutionType=%s => %s', (roleKey, institutionType, expected) => {
    expect(getProfileInitials(roleKey, institutionType)).toBe(expected);
  });
});

describe('getRoleLabelKey', () => {
  test.each([
    ['operator-pt', undefined, 'roles.ptOperator'],
    ['admin-psp', undefined, 'roles.pspAdmin'],
    ['admin', 'PSP', 'roles.pspAdmin'],
    ['operator-psp', undefined, 'roles.pspOperator'],
    ['operator', 'PSP', 'roles.pspOperator'],
    ['admin', undefined, 'roles.ecAdmin'],
    ['operator', undefined, 'roles.ecOperator'],
    ['unmapped', undefined, 'unmapped'],
  ] as const)('roleKey=%s institutionType=%s => %s', (roleKey, institutionType, expected) => {
    expect(getRoleLabelKey(roleKey, institutionType)).toBe(expected);
  });
});

describe('applyTokenRolesToParty', () => {
  const party: Party = {
    partyId: 'p1',
    externalId: 'e1',
    originId: 'o1',
    origin: 'SELC',
    description: 'Test',
    digitalAddress: 'a@b.it',
    status: 'ACTIVE',
    roles: [{ partyRole: 'MANAGER', roleKey: 'admin', roleLabel: '' }],
    fiscalCode: 'FC',
    registeredOffice: 'Via Test',
    institutionType: 'EC',
  };

  test('returns the party unchanged when the token has no roles', () => {
    const token = buildToken({ uid: '1' });
    expect(applyTokenRolesToParty(party, token)).toEqual(party);
  });

  test('rebuilds party roles from the token, putting the active role first', () => {
    const token = buildToken({
      org_role: 'operator',
      roles: [
        { partyRole: 'MANAGER', role: 'admin' },
        { partyRole: 'OPERATOR', role: 'operator' },
      ],
    });

    const updated = applyTokenRolesToParty(party, token);

    expect(updated.roles).toEqual([
      { partyRole: 'OPERATOR', roleKey: 'operator', roleLabel: 'roles.ecOperator' },
      { partyRole: 'MANAGER', roleKey: 'admin', roleLabel: 'roles.ecAdmin' },
    ]);
    expect(updated.partyId).toBe(party.partyId);
  });

  test('falls back to reading the stored session token when none is provided explicitly', () => {
    storageTokenOps.write(
      buildToken({ org_role: 'admin', roles: [{ partyRole: 'MANAGER', role: 'admin' }] })
    );

    const updated = applyTokenRolesToParty(party);

    expect(updated.roles).toEqual([
      { partyRole: 'MANAGER', roleKey: 'admin', roleLabel: 'roles.ecAdmin' },
    ]);
  });

  test('uses the active role alone when the roles claim is empty but org_role is set', () => {
    const token = buildToken({ org_role: 'admin', org_party_role: 'MANAGER' });

    const updated = applyTokenRolesToParty(party, token);

    expect(updated.roles).toEqual([
      { partyRole: 'MANAGER', roleKey: 'admin', roleLabel: 'roles.ecAdmin' },
    ]);
  });
});

describe('getProfileOptions', () => {
  test('returns an empty array when there is no token', () => {
    expect(getProfileOptions(undefined, 'EC')).toEqual([]);
  });

  test('deduplicates roles and marks the active one as selected', () => {
    const token = buildToken({
      org_role: 'admin',
      roles: [
        { partyRole: 'MANAGER', role: 'admin' },
        { partyRole: 'MANAGER', role: 'admin' },
        { partyRole: 'OPERATOR', role: 'operator' },
      ],
    });

    const options = getProfileOptions(token, 'EC');

    expect(options).toEqual([
      {
        partyRole: 'MANAGER',
        roleKey: 'admin',
        label: 'Ente Creditore',
        roleLabelKey: 'roles.ecAdmin',
        initials: 'EC',
        selected: true,
      },
      {
        partyRole: 'OPERATOR',
        roleKey: 'operator',
        label: 'Ente Creditore',
        roleLabelKey: 'roles.ecOperator',
        initials: 'EC',
        selected: false,
      },
    ]);
  });
});

describe('currentSessionTokenHasRoles', () => {
  test('returns false when there is no session token', () => {
    expect(currentSessionTokenHasRoles()).toBe(false);
  });

  test('returns true when the stored token has roles', () => {
    storageTokenOps.write(buildToken({ roles: [{ partyRole: 'MANAGER', role: 'admin' }] }));
    expect(currentSessionTokenHasRoles()).toBe(true);
  });

  test('returns false when the stored token has an empty roles claim', () => {
    storageTokenOps.write(buildToken({ roles: [] }));
    expect(currentSessionTokenHasRoles()).toBe(false);
  });
});
