import { InstitutionDetailResource } from '../api/generated/portal/InstitutionDetailResource';
import { InstitutionResource } from '../api/generated/portal/InstitutionResource';
import { PspDataResource } from '../api/generated/portal/PspDataResource';
import { ENV } from '../utils/env';

export type SelfcareRole = 'ADMIN' | 'LIMITED';
export type PartyRole = 'DELEGATE' | 'MANAGER' | 'OPERATOR' | 'SUB_DELEGATE';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

export type Party = {
  partyId: string;
  externalId: string;
  originId: string;
  origin: string;
  description: string;
  digitalAddress: string;
  status: UserStatus;
  roles: Array<UserRole>;
  category?: string;
  urlLogo?: string;
  fiscalCode: string;
  registeredOffice: string;
  institutionType?: string;
  pspData?: PspDataResource;
};

export type UserRole = {
  partyRole: PartyRole;
  roleKey: string;
};

const buildUrlLog = (partyId: string) =>
  `${ENV.URL_INSTITUTION_LOGO.PREFIX}${partyId}${ENV.URL_INSTITUTION_LOGO.SUFFIX}`;

export const institutionResource2Party = (institutionResource: InstitutionResource): Party => {
  const urlLogo = institutionResource.id && buildUrlLog(institutionResource.id);
  return {
    partyId: institutionResource.id,
    externalId: institutionResource.externalId,
    originId: institutionResource.originId,
    origin: institutionResource.origin,
    description: institutionResource.name,
    digitalAddress: institutionResource.mailAddress,
    status: institutionResource.status as 'ACTIVE' | 'PENDING',
    roles: institutionResource.userProductRoles.map(
      (u) => ({ partyRole: u === 'admin' ? 'DELEGATE' : 'OPERATOR', roleKey: u } as UserRole)
    ),
    urlLogo,
    fiscalCode: institutionResource.fiscalCode,
    registeredOffice: institutionResource.address,
    institutionType: institutionResource.institutionType,
    pspData: institutionResource.pspData,
  };
};

export const institutionDetailResource2Party = (
  institutionResource: InstitutionDetailResource
): Party => {
  const urlLogo = institutionResource.id && buildUrlLog(institutionResource.id);
  return {
    partyId: institutionResource.id,
    externalId: institutionResource.externalId,
    originId: institutionResource.originId,
    origin: institutionResource.origin,
    description: institutionResource.description,
    digitalAddress: institutionResource.digitalAddress,
    status: 'ACTIVE', // 'ACTIVE' | 'PENDING',
    roles: [] /* institutionResource.userProductRoles.map(
      (u) => ({ partyRole: u, roleKey: u } as UserRole)
    ), */,
    urlLogo,
    fiscalCode: institutionResource.taxCode,
    registeredOffice: institutionResource.address,
    institutionType: institutionResource.institutionType,
  };
};
