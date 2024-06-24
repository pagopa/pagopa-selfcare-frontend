<<<<<<< HEAD
import {InstitutionDetail} from '../api/generated/portal/InstitutionDetail';

=======
>>>>>>> 3f32cfc3 (Formatting (#542))
export type PartyDetail = {
    partyId: string;
    externalId: string;
    originId: string;
    origin: string;
    description: string;
    digitalAddress: string;
    address: string;
    zipCode: string;
    fiscalCode: string;
    institutionType?: string;
};

// export const institutionDetailResource2PartyDetail = (
//   institutionDetailResource: InstitutionDetail
// ): PartyDetail => ({
//   partyId: institutionDetailResource.id,
//   externalId: institutionDetailResource.external_id,
//   originId: institutionDetailResource.origin_id,
//   origin: institutionDetailResource.origin,
//   description: institutionDetailResource.description,
//   digitalAddress: institutionDetailResource.digitalAddress,
//   address: institutionDetailResource.address,
//   zipCode: institutionDetailResource.zipCode,
//   fiscalCode: institutionDetailResource.tax_code,
//   institutionType: institutionDetailResource.institution_type,
// });
