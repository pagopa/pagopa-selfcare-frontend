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
  vat_number: 'vat_number',
};

const pspDetails: Array<PaymentServiceProviderDetailsResource> = [
  {
    abi: '36042',
    agid_psp: true,
    bic: '10101',
    my_bank_code: '',
    stamp: true,
    tax_code: '123123',
    vat_number: '12312312',
    business_name: 'PSP S.r.l',
    enabled: true,
    psp_code: 'ABI36042',
  },
];

const ecDetails: Array<CreditorInstitutionDetailsResource> = [
  {
    address: {
      city: 'Milano',
      countryCode: 'Via Ernesto Calindri 4',
      location: 'MI',
      taxDomicile: 'Via Ernesto Calindri 4',
      zipCode: '20143',
    },
    businessName: 'businessName',
    creditorInstitutionCode: '1122334455',
    enabled: true,
    pspPayment: false,
    reportingFtp: false,
    reportingZip: false,
    broadcast: true,
  },
];

const ecDirectUpdated: CreditorInstitutionDetailsResource = {
  address: {
    city: 'Monza',
    countryCode: 'Via Liberta 64',
    location: 'MB',
    taxDomicile: 'Via Ernesto Calindri 4',
    zipCode: '20900',
  },
  businessName: 'businessName',
  creditorInstitutionCode: '1122334455',
  enabled: true,
  pspPayment: false,
  reportingFtp: false,
  reportingZip: false,
  broadcast: false,
};

export const createPSPDirect = (_psp: NodeOnSignInPSP): Promise<PSPDirectDTO> =>
  new Promise((resolve) => resolve(pspDirect));

export const updatePSPInfo = (_psp: NodeOnSignInPSP): Promise<PSPDirectDTO> =>
  new Promise((resolve) => resolve(pspDirect));

export const getPSPDetails = (pspcode: string): Promise<PaymentServiceProviderDetailsResource> => {
  const pspDetail = pspDetails.find((pd) => pd.psp_code === pspcode);
  if (pspDetail === undefined) {
    return new Promise((resolve) => resolve({}));
  }
  return new Promise((resolve) => resolve(pspDetail));
};

export const createECAndBroker = (
  ec: CreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> =>
  new Promise((resolve) => resolve({ ...ec, broadcast: true }));

export const createECDirect = (
  ec: CreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> =>
  new Promise((resolve) => resolve({ ...ec, broadcast: true }));

export const getECDetails = (
  ecCode: string
): Promise<CreditorInstitutionDetailsResource | undefined> => {
  const ecDetail = ecDetails.find((ec) => ec.creditorInstitutionCode === ecCode);
  if (ecDetail === undefined) {
    return new Promise((resolve) => resolve(undefined));
  }
  return new Promise((resolve) => resolve(ecDetail));
};

export const updateECDirect = (
  _ecCode: string,
  _ec: UpdateCreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> =>
  new Promise((resolve) => resolve(ecDirectUpdated));
