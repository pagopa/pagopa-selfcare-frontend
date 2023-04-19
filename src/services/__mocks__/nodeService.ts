import { CreditorInstitutionDetailsResource } from '../../api/generated/portal/CreditorInstitutionDetailsResource';
import { CreditorInstitutionDto } from '../../api/generated/portal/CreditorInstitutionDto';
import { PaymentServiceProviderDetailsResource } from '../../api/generated/portal/PaymentServiceProviderDetailsResource';
import { UpdateCreditorInstitutionDto } from '../../api/generated/portal/UpdateCreditorInstitutionDto';
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

const ecDirect: CreditorInstitutionDetailsResource = {
  address: {
    city: 'Milano',
    countryCode: 'Via Ernesto Calindri 4',
    location: 'MI',
    taxDomicile: 'Via Ernesto Calindri 4',
    zipCode: '20143',
  },
  businessName: 'businessName',
  creditorInstitutionCode: 'creditorInstitutionCode',
  enabled: true,
  pspPayment: false,
  reportingFtp: false,
  reportingZip: false,
};

const ecDirectUpdated: UpdateCreditorInstitutionDto = {
  address: {
    city: 'Monza',
    countryCode: 'Via Liberta 64',
    location: 'MB',
    taxDomicile: 'Via Ernesto Calindri 4',
    zipCode: '20900',
  },
  businessName: 'businessName',
  creditorInstitutionCode: 'creditorInstitutionCode',
  enabled: true,
  pspPayment: false,
  reportingFtp: false,
  reportingZip: false,
};

export const createPSPDirect = (_psp: NodeOnSignInPSP): Promise<PSPDirectDTO> =>
  new Promise((resolve) => resolve(pspDirect));

export const getPSPDetails = (_pspcode: string): Promise<PaymentServiceProviderDetailsResource> =>
  new Promise((resolve) => resolve(pspDetails));

export const createECDirect = (
  ec: CreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> => new Promise((resolve) => resolve(ec));

export const getECDetails = (_ecCode: string): Promise<CreditorInstitutionDetailsResource> =>
  new Promise((resolve) => resolve(ecDirect));

export const updateECDirect = (
  _ecCode: string,
  _ec: UpdateCreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> =>
  new Promise((resolve) => resolve(ecDirectUpdated));
