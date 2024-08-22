import {InstitutionDetail} from '../api/generated/portal/InstitutionDetail';
import {Institution} from '../api/generated/portal/Institution';
import {PspData} from '../api/generated/portal/PspData';
import {ENV} from '../utils/env';
import { InstitutionBase } from '../api/generated/portal/InstitutionBase';

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
    pspData?: PspData;
};

export type UserRole = {
    partyRole: PartyRole;
    roleKey: string;
};

export type BaseParty = {
    partyId: string;
    description: string;
    status: UserStatus;
    roles: Array<UserRole>;
    urlLogo?: string;
    parentDescription?: string;
  };

const buildUrlLog = (partyId: string) =>
    `${ENV.URL_INSTITUTION_LOGO.PREFIX}${partyId}${ENV.URL_INSTITUTION_LOGO.SUFFIX}`;

export const institutionResource2Party = (institutionResource: InstitutionDetail): Party => {

    const urlLogo = institutionResource.id && buildUrlLog(institutionResource.id);
    return {
        partyId: institutionResource.id,
        externalId: institutionResource.external_id,
        originId: institutionResource.origin_id,
        origin: institutionResource.origin,
        description: institutionResource.name,
        digitalAddress: institutionResource.mail_address!,
        status: institutionResource.status as 'ACTIVE' | 'PENDING',
        roles: institutionResource.user_product_roles.map(
            (u) => ({partyRole: u === 'admin' ? 'DELEGATE' : 'OPERATOR', roleKey: u} as UserRole)
        ),
        urlLogo,
        fiscalCode: institutionResource.tax_code,
        registeredOffice: institutionResource.address!,
        institutionType: institutionResource.institution_type,
        pspData: institutionResource.psp_data,
    };
};

export const institutionDetailResource2Party = (
    institutionResource: Institution
): Party => {
    const urlLogo = institutionResource.id && buildUrlLog(institutionResource.id);
    return {
        partyId: institutionResource.id,
        externalId: institutionResource.external_id,
        originId: institutionResource.origin_id,
        origin: institutionResource.origin,
        description: institutionResource.description,
        digitalAddress: institutionResource.digital_address!,
        status: 'ACTIVE', // 'ACTIVE' | 'PENDING',
        roles: [] /* institutionResource.userProductRoles.map(
      (u) => ({ partyRole: u, roleKey: u } as UserRole)
    ), */,
        urlLogo,
        fiscalCode: institutionResource.tax_code,
        registeredOffice: institutionResource.address!,
        institutionType: institutionResource.institution_type,
    };
};

export const institutionBaseResource2BaseParty = (
    institutionResource: InstitutionBase
  ): BaseParty => {
    const urlLogo = institutionResource.id && buildUrlLog(institutionResource.id);
    return {
      partyId: institutionResource.id ?? '',
      description: institutionResource.name ?? '',
      // status: institutionResource.status as 'ACTIVE' | 'PENDING',
      status: 'ACTIVE',
      roles: institutionResource.user_product_roles.map(
        (u) => ({partyRole: u === 'admin' ? 'DELEGATE' : 'OPERATOR', roleKey: u} as UserRole)
      ),      
      urlLogo,
    };
  };