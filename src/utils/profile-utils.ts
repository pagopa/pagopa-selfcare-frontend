import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { JWTOrganizationRole, JWTUser } from '../model/JwtUser';
import { Party, UserRole } from '../model/Party';
import { parseJwt } from './jwt-utils';

export const PROFILE_ITEM_FEATURE_FLAG = 'profile-item';

export type ProfileContext = 'EC' | 'PSP' | 'PT' | 'UNKNOWN';

export type ProfileOption = {
  partyRole: string;
  roleKey: string;
  label: string;
  roleLabelKey: string;
  initials: string;
  selected: boolean;
};

const PT_ROLE_KEY = 'operator-pt';
const PSP_ROLE_KEYS = ['admin-psp', 'operator-psp'];
const EC_ROLE_KEYS = ['admin', 'operator'];

const parseMaybeJson = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (_) {
    return value;
  }
};

const normalizeRole = (role: unknown): JWTOrganizationRole | undefined => {
  const parsedRole = parseMaybeJson(role);
  if (
    typeof parsedRole === 'object' &&
    parsedRole !== null &&
    'partyRole' in parsedRole &&
    'role' in parsedRole &&
    typeof parsedRole.partyRole === 'string' &&
    typeof parsedRole.role === 'string'
  ) {
    return {
      partyRole: parsedRole.partyRole,
      role: parsedRole.role,
    };
  }

  return undefined;
};

export const getJwtPayload = (token?: string): JWTUser | null => {
  if (!token) {
    return null;
  }

  return parseJwt(token) as JWTUser | null;
};

export const getTokenRoles = (payload?: JWTUser | null): Array<JWTOrganizationRole> => {
  const rolesClaim = parseMaybeJson(payload?.roles ?? payload?.organization?.roles);
  const roles = Array.isArray(rolesClaim) ? rolesClaim : rolesClaim ? [rolesClaim] : [];

  return roles.reduce<Array<JWTOrganizationRole>>((acc, role) => {
    const normalizedRole = normalizeRole(role);
    return normalizedRole ? [...acc, normalizedRole] : acc;
  }, []);
};

export const getActiveTokenRole = (payload?: JWTUser | null): JWTOrganizationRole | undefined => {
  const roles = getTokenRoles(payload);

  if (payload?.org_role) {
    return (
      roles.find((role) => role.role === payload.org_role) ?? {
        partyRole: payload.org_party_role ?? roles[0]?.partyRole ?? '',
        role: payload.org_role,
      }
    );
  }

  return roles[0];
};

export const getActiveRoleKeyFromCurrentToken = (): string | undefined =>
  getActiveTokenRole(getJwtPayload(storageTokenOps.read()))?.role;

export const getProfileContext = (
  roleKey?: string,
  institutionType?: string
): ProfileContext => {
  if (roleKey === PT_ROLE_KEY || institutionType === 'PT') {
    return 'PT';
  }

  if (PSP_ROLE_KEYS.includes(roleKey ?? '') || institutionType === 'PSP') {
    return 'PSP';
  }

  if (EC_ROLE_KEYS.includes(roleKey ?? '')) {
    return 'EC';
  }

  return institutionType === undefined ? 'UNKNOWN' : 'EC';
};

export const getPartyProfileContext = (party?: Party): ProfileContext =>
  getProfileContext(party?.roles[0]?.roleKey, party?.institutionType);

export const getProfileLabel = (roleKey?: string, institutionType?: string): string => {
  const context = getProfileContext(roleKey, institutionType);

  if (context === 'PT') {
    return 'Intermediario Tecnologico';
  }

  if (context === 'PSP') {
    return 'Prestatore Servizi di Pagamento';
  }

  if (context === 'EC') {
    return 'Ente Creditore';
  }

  return roleKey ?? '';
};

export const getProfileInitials = (roleKey?: string, institutionType?: string): string => {
  const context = getProfileContext(roleKey, institutionType);
  return context === 'UNKNOWN' ? 'AR' : context;
};

export const getRoleLabelKey = (roleKey?: string, institutionType?: string): string => {
  if (roleKey === PT_ROLE_KEY) {
    return 'roles.ptOperator';
  }

  if (roleKey === 'admin-psp' || (institutionType === 'PSP' && roleKey === 'admin')) {
    return 'roles.pspAdmin';
  }

  if (roleKey === 'operator-psp' || (institutionType === 'PSP' && roleKey === 'operator')) {
    return 'roles.pspOperator';
  }

  if (roleKey === 'admin') {
    return 'roles.ecAdmin';
  }

  if (roleKey === 'operator') {
    return 'roles.ecOperator';
  }

  return roleKey ?? '';
};

const tokenRole2UserRole = (
  role: JWTOrganizationRole,
  institutionType?: string
): UserRole => ({
  partyRole: role.partyRole as UserRole['partyRole'],
  roleKey: role.role,
  roleLabel: getRoleLabelKey(role.role, institutionType),
});

const moveActiveRoleFirst = (
  roles: Array<JWTOrganizationRole>,
  activeRole?: JWTOrganizationRole
): Array<JWTOrganizationRole> => {
  if (!activeRole) {
    return roles;
  }

  const inactiveRoles = roles.filter((role) => role.role !== activeRole.role);
  return [activeRole, ...inactiveRoles];
};

export const applyTokenRolesToParty = (party: Party, token?: string): Party => {
  const payload = getJwtPayload(token ?? storageTokenOps.read());
  const activeRole = getActiveTokenRole(payload);
  const roles = getTokenRoles(payload);
  const sortedRoles = moveActiveRoleFirst(
    roles.length > 0 ? roles : activeRole ? [activeRole] : [],
    activeRole
  );

  if (sortedRoles.length === 0) {
    return party;
  }

  return {
    ...party,
    roles: sortedRoles.map((role) => tokenRole2UserRole(role, party.institutionType)),
  };
};

export const getProfileOptions = (
  token?: string,
  institutionType?: string
): Array<ProfileOption> => {
  const payload = getJwtPayload(token);
  const activeRole = getActiveTokenRole(payload);
  const roles = getTokenRoles(payload);
  const uniqueRoles = roles.filter(
    (role, index) => roles.findIndex((item) => item.role === role.role) === index
  );

  return uniqueRoles.map((role) => ({
    partyRole: role.partyRole,
    roleKey: role.role,
    label: getProfileLabel(role.role, institutionType),
    roleLabelKey: getRoleLabelKey(role.role, institutionType),
    initials: getProfileInitials(role.role, institutionType),
    selected: role.role === activeRole?.role,
  }));
};

export const currentSessionTokenHasRoles = (): boolean =>
  getTokenRoles(getJwtPayload(storageTokenOps.read())).length > 0;
