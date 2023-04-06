import { CreditorInstitutionDetailsResource } from '../../api/generated/portal/CreditorInstitutionDetailsResource';
import { CreditorInstitutionDto } from '../../api/generated/portal/CreditorInstitutionDto';
import { PaymentServiceProviderDetailsResource } from '../../api/generated/portal/PaymentServiceProviderDetailsResource';
import { NodeOnSignInPSP } from '../../model/Node';
import { PSPDirectDTO } from '../../model/PSP';

const pspDirect: PSPDirectDTO = {
  abi: 'abi',
  agid_psp: true,
  bic: 'bic',
  business_name: 'business_name',
  enabled: true,
  my_bank_code: 'my_bank_code',
  psp_code: 'psp_code',
  stamp: true,
  tax_code: 'tax_code',
  transfer: true,
  vat_number: 'vat_number',
};

const pspDetails: PaymentServiceProviderDetailsResource = {
  abi: '12345',
  agid_psp: true,
  bic: '10101',
  my_bank_code: '',
  stamp: true,
  tax_code: '123123',
  transfer: true,
  vat_number: '12312312',
  business_name: 'PSP S.r.l',
  enabled: true,
  psp_code: '12312312',
};

// const ecDirect: CreditorInstitutionDetailsResource = {
//   address: {
//     city: 'città',
//     countryCode: 'indirizzo',
//     location: 'provincia',
//     taxDomicile: 'Domicilio Fiscale',
//     zipCode: 'CAP',
//   },
//   businessName: 'businessName',
//   creditorInstitutionCode: 'creditorInstitutionCode',
//   enabled: false,
//   pspPayment: false,
//   reportingFtp: false,
//   reportingZip: false,
// };

export const createPSPDirect = (_psp: NodeOnSignInPSP): Promise<PSPDirectDTO> =>
  new Promise((resolve) => resolve(pspDirect));

export const getPSPDetails = (_pspcode: string): Promise<PaymentServiceProviderDetailsResource> =>
  new Promise((resolve) => resolve(pspDetails));

export const createECDirect = (
  ec: CreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> => new Promise((resolve) => resolve(ec));
