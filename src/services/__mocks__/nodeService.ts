import { BrokerAndEcDetailsResource } from '../../api/generated/portal/BrokerAndEcDetailsResource';
import { BrokerDetailsResource } from '../../api/generated/portal/BrokerDetailsResource';
import { BrokerDto } from '../../api/generated/portal/BrokerDto';
import { BrokerOrPspDetailsResource } from '../../api/generated/portal/BrokerOrPspDetailsResource';
import { BrokerPspDetailsDto } from '../../api/generated/portal/BrokerPspDetailsDto';
import { BrokerPspDetailsResource } from '../../api/generated/portal/BrokerPspDetailsResource';
import { BrokerResource } from '../../api/generated/portal/BrokerResource';
import { CreditorInstitutionDetailsResource } from '../../api/generated/portal/CreditorInstitutionDetailsResource';
import { CreditorInstitutionDto } from '../../api/generated/portal/CreditorInstitutionDto';
import { PaymentServiceProviderDetailsDto } from '../../api/generated/portal/PaymentServiceProviderDetailsDto';
import { PaymentServiceProviderDetailsResource } from '../../api/generated/portal/PaymentServiceProviderDetailsResource';
import { PaymentServiceProviderResource } from '../../api/generated/portal/PaymentServiceProviderResource';
import { PaymentServiceProvidersResource } from '../../api/generated/portal/PaymentServiceProvidersResource';
import { UpdateCreditorInstitutionDto } from '../../api/generated/portal/UpdateCreditorInstitutionDto';
import { NodeOnSignInPSP } from '../../model/Node';
import { PSPDirectDTO } from '../../model/PSP';

const pspDirect: PSPDirectDTO = {
  abi: 'abi',
  agid_psp: false,
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
  agid_psp: false,
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
      countryCode: 'MY',
      location: 'Via Ernesto Calindri 4',
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

export const ecDirectUpdated: CreditorInstitutionDetailsResource = {
  address: {
    city: 'Monza',
    countryCode: 'MB',
    location: 'Via Liberta 64',
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

export const pspListOfABroker: PaymentServiceProvidersResource = {
  page_info: {
    items_found: 2,
    limit: 10,
    page: 0,
    total_pages: 1,
  },
  payment_service_providers: [
    {
      business_name: 'businessName',
      enabled: true,
      psp_code: '112233445566',
    },
    {
      business_name: 'businessName',
      enabled: false,
      psp_code: '112233445566',
    },
  ],
};

export const pspListOfABrokerEmpty: PaymentServiceProvidersResource = {
  page_info: {
    items_found: 0,
    limit: 10,
    page: 0,
    total_pages: 1,
  },
  payment_service_providers: [],
};

const mapPspCode2BrokerOrPspDetailsResource = (pspCode: string) => {
  if (pspCode.toUpperCase().includes('UNSIGNED')) {
    return brokerOrPspDetailsResource_Empty;
  }
  if (pspCode.toUpperCase().includes('SIGNED_DIRECT')) {
    return brokerOrPspDetailsResource_PSPAndBroker;
  }
  if (pspCode.toUpperCase().includes('SIGNED_UNDIRECT')) {
    return brokerOrPspDetailsResource_PSPOnly;
  }
  return brokerOrPspDetailsResource_Empty;
};

const mapECCode2BrokerAndECDetailsResource = (ecCode: string) => {
  if (ecCode.toUpperCase().includes('UNSIGNED')) {
    return brokerAndEcDetailsResource_Empty;
  }
  if (ecCode.toUpperCase().includes('PT_PSP_SIGNED')) {
    return brokerAndEcDetailsResource_Empty;
  }
  if (ecCode.toUpperCase().includes('SIGNED_DIRECT')) {
    return brokerAndEcDetailsResource_ECAndBroker;
  }
  if (ecCode.toUpperCase().includes('SIGNED_UNDIRECT')) {
    return brokerAndEcDetailsResource_ECOnly;
  }
  return brokerAndEcDetailsResource_Empty;
};

const mapPSPBrokerDetailsResource = (pspBrokerCode: string) => {
  if (
    pspBrokerCode.toUpperCase().includes('UNSIGNED') ||
    pspBrokerCode.toUpperCase().includes('UNDIRECT') ||
    pspBrokerCode.toUpperCase().includes('PT_EC_SIGNED')
  ) {
    return {};
  } else {
    return pspBrokerDetails;
  }
};

const mapPaymentServiceProviders = (taxcode?: string) => {
  if (taxcode && taxcode.toUpperCase().includes('UNSIGNED')) {
    return pspListOfABrokerEmpty;
  } else {
    return pspListOfABroker;
  }
};

export const createPSPDirect = (_psp: NodeOnSignInPSP): Promise<PSPDirectDTO> =>
  new Promise((resolve) => resolve(pspDirect));

export const createPspBroker = (
  _broker: BrokerPspDetailsDto
): Promise<BrokerPspDetailsResource> => {
  return new Promise((resolve) => resolve(pspBrokerDetails));
};

export const createPSPIndirect = (_psp: NodeOnSignInPSP): Promise<PSPDirectDTO> =>
  new Promise((resolve) => resolve(pspDirect));

export const updatePSPInfo = (_pspcode: string, _psp: NodeOnSignInPSP): Promise<PSPDirectDTO> =>
  new Promise((resolve) => resolve(pspDirect));

export const getBrokerAndPspDetails = (pspcode: string): Promise<BrokerOrPspDetailsResource> => {
  return new Promise((resolve) => resolve(mapPspCode2BrokerOrPspDetailsResource(pspcode)));
};

export const getPSPBrokerDetails = (pspBrokerCode: string): Promise<BrokerPspDetailsResource> => {
  // @ts-ignore
  return new Promise((resolve) => resolve(mapPSPBrokerDetailsResource(pspBrokerCode)));
};

export const getPSPDetails = (_pspCode: string): Promise<PaymentServiceProviderDetailsResource> => {
  return new Promise((resolve) => resolve(pspDetails));
};

export const getPaymentServiceProviders = (
  _page: number,
  _name?: string,
  _limit?: number,
  _pspCode?: string,
  taxCode?: string
): Promise<PaymentServiceProvidersResource> => {
  return new Promise((resolve) => resolve(mapPaymentServiceProviders(taxCode)));
};

export const getBrokerAndEcDetails = (ecCode: string): Promise<BrokerAndEcDetailsResource> => {
  return new Promise((resolve) => resolve(mapECCode2BrokerAndECDetailsResource(ecCode)));
};

export const createECAndBroker = (
  ec: CreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> =>
  new Promise((resolve) => resolve({ ...ec, broadcast: true }));

export const createEcBroker = (_broker: BrokerDto): Promise<BrokerResource> => {
  return new Promise((resolve) => resolve(ecBrokerDetails));
};

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
