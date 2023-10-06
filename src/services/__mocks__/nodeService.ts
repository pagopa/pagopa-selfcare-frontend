import { BrokerAndEcDetailsResource } from '../../api/generated/portal/BrokerAndEcDetailsResource';
import { BrokerOrPspDetailsResource } from '../../api/generated/portal/BrokerOrPspDetailsResource';
import { BrokerPspDetailsResource } from '../../api/generated/portal/BrokerPspDetailsResource';
import { BrokerResource } from '../../api/generated/portal/BrokerResource';
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

export const pspDetails: PaymentServiceProviderDetailsResource = {
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
};

export const pspBrokerDetails: BrokerPspDetailsResource = {
  broker_psp_code: '12312312',
  description: 'descrizione broker',
  enabled: true,
  extended_fault_bean: true,
};

export const ecBrokerDetails: BrokerResource = {
  broker_code: '12312312',
  description: 'descrizione broker ec',
  enabled: true,
  extended_fault_bean: true,
};

export const ecDetails: Array<CreditorInstitutionDetailsResource> = [
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

export const brokerOrPspDetailsResource_Empty: BrokerOrPspDetailsResource = {};

export const brokerOrPspDetailsResource_PSPOnly: BrokerOrPspDetailsResource = {
  paymentServiceProviderDetailsResource: pspDetails,
};

export const brokerOrPspDetailsResource_PSPAndBroker: BrokerOrPspDetailsResource = {
  paymentServiceProviderDetailsResource: pspDetails,
  brokerPspDetailsResource: pspBrokerDetails,
};

export const brokerAndEcDetailsResource_Empty: BrokerAndEcDetailsResource = {};

export const brokerAndEcDetailsResource_ECOnly: BrokerAndEcDetailsResource = {
  creditorInstitutionDetailsResource: ecDirectUpdated,
};

export const brokerAndEcDetailsResource_ECAndBroker: BrokerAndEcDetailsResource = {
  brokerDetailsResource: ecBrokerDetails,
  creditorInstitutionDetailsResource: ecDirectUpdated,
};

const mapPspCode2BrokerOrPspDetailsResource = (pspCode: string) => {
  if (pspCode.toUpperCase().includes('UNSIGNED')) {
    return brokerOrPspDetailsResource_Empty;
  }
  if (pspCode.toUpperCase().includes('SIGNED')) {
    return brokerOrPspDetailsResource_PSPAndBroker;
  }
  return brokerOrPspDetailsResource_Empty;
};

export const createPSPDirect = (_psp: NodeOnSignInPSP): Promise<PSPDirectDTO> =>
  new Promise((resolve) => resolve(pspDirect));

export const createPSPIndirect = (_psp: NodeOnSignInPSP): Promise<PSPDirectDTO> =>
  new Promise((resolve) => resolve(pspDirect));

export const updatePSPInfo = (_psp: NodeOnSignInPSP): Promise<PSPDirectDTO> =>
  new Promise((resolve) => resolve(pspDirect));

export const getBrokerAndPspDetails = (pspcode: string): Promise<BrokerOrPspDetailsResource> => {
  return new Promise((resolve) => resolve(mapPspCode2BrokerOrPspDetailsResource(pspcode)));
};

export const getBrokerAndEcDetails = (ecCode: string): Promise<BrokerAndEcDetailsResource> => {
  return new Promise((resolve) => resolve(brokerAndEcDetailsResource_ECAndBroker));
};

export const createECAndBroker = (
  ec: CreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> =>
  new Promise((resolve) => resolve({ ...ec, broadcast: true }));

export const createECIndirect = (
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
