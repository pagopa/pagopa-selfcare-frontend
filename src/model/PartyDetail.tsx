import { InstitutionDetailResource } from '../api/generated/portal/InstitutionDetailResource';

export type PartyDetail = {
  partyId: string;
  externalId: string;
  originId: string;
  origin: string;
  description: string;
  digitalAddress?: string;
  address?: string;
  zipCode: string;
  fiscalCode: string;
  institutionType?: string;
};

export const institutionDetailResource2PartyDetail = (
  institutionDetailResource: InstitutionDetailResource
): PartyDetail => ({
  partyId: institutionDetailResource.id,
  externalId: institutionDetailResource.externalId,
  originId: institutionDetailResource.originId,
  origin: institutionDetailResource.origin,
  description: institutionDetailResource.description,
  digitalAddress: institutionDetailResource.digitalAddress,
  address: institutionDetailResource.address,
  zipCode: institutionDetailResource.zipCode,
  fiscalCode: institutionDetailResource.taxCode,
  institutionType: institutionDetailResource.institutionType,
});
