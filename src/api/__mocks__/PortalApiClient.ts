import { ChannelOnCreation } from '../../model/Channel';
import {
  mockedPaymentTypes,
  mockedPSPChannels,
  mockedChannelDetail,
} from '../../services/__mocks__/channelService';
import { ChannelDetailsResource } from '../generated/portal/ChannelDetailsResource';
import {
  InstitutionDetailResource,
  InstitutionTypeEnum,
} from '../generated/portal/InstitutionDetailResource';
import { InstitutionResource } from '../generated/portal/InstitutionResource';
import { PaymentTypesResource } from '../generated/portal/PaymentTypesResource';

import { ProductsResource } from '../generated/portal/ProductsResource';
import { PspChannelPaymentTypes } from '../generated/portal/PspChannelPaymentTypes';
import { PspChannelPaymentTypesResource } from '../generated/portal/PspChannelPaymentTypesResource';

export const mockedInstitutionResources: Array<InstitutionResource> = [
  {
    id: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944',
    externalId: '15376371009',
    originId: 'PAGOPASPA',
    origin: 'SELC',
    name: 'PagoPA S.p.A.',
    fiscalCode: '15376371009',
    mailAddress: 'selfcare@pec.pagopa.it',
    status: 'ACTIVE',
    address: 'Piazza Colonna, 370',
    userProductRoles: ['admin'],
    companyInformations: {},
    assistanceContacts: {},
    pspData: {
      businessRegisterNumber: '00000000000',
      legalRegisterName: 'ISTITUTI DI PAGAMENTO',
      legalRegisterNumber: '09878',
      abiCode: '36042',
      vatNumberGroup: false,
    },
    dpoData: {
      address: 'selfcare@pec.pagopa.it',
      pec: 'selfcare@pec.pagopa.it',
      email: 'selfcare@pec.pagopa.it',
    },
  },
  {
    id: '640a1b30-9515-4cdb-ae27-3a90e2d9af78',
    externalId: '01199250000',
    originId: 'PSP_01199250000',
    origin: 'SELC',
    name: 'Banca che banca',
    fiscalCode: '01199250000',
    mailAddress: 'pecpecpec@test.it',
    status: 'ACTIVE',
    address: 'milano',
    userProductRoles: ['admin'],
    companyInformations: {},
    assistanceContacts: {},
    pspData: {
      businessRegisterNumber: '00487105721',
      legalRegisterName: 'Energia',
      legalRegisterNumber: '77168',
      abiCode: '39849',
      vatNumberGroup: false,
    },
    dpoData: {
      address: 'via sesto san giovanni, 5167',
      pec: 'dpo@testpec.it',
      email: 'dpo@email.test.it',
    },
  },
  {
    id: '46ef5b6b-7ee4-4dab-b8bc-fb5e30111239',
    externalId: '15376371009',
    originId: 'PAGOPASPA',
    origin: 'static',
    name: 'PagoPA S.p.A.',
    fiscalCode: '15376371009',
    mailAddress: 'selfcare@pec.pagopa.it',
    status: 'ACTIVE',
    address: 'Piazza Colonna, 370',
    userProductRoles: ['admin'],
    companyInformations: {},
    assistanceContacts: {},
  },
];

export const mockedInstitutionDetailResource: InstitutionDetailResource = {
  id: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944',
  externalId: '15376371009',
  originId: 'PSP_15376371009',
  description: 'PagoPA S.p.A.',
  digitalAddress: 'selfcare@pec.pagopa.it',
  address: 'Piazza Colonna, 370',
  zipCode: '00161',
  taxCode: '15376371009',
  origin: 'SELC',
  institutionType: 'PSP' as InstitutionTypeEnum,
  attributes: [],
};

export const mockedProductResources: Array<ProductsResource> = [
  {
    title: 'App IO',
    description: 'App IO description',
    id: '1',
    urlBO: 'http://appio/bo#<IdentityToken>',
    urlPublic: 'http://appio/public',
  },
  {
    id: '2',
    title: 'Piattaforma Notifiche',
    description: 'Piattaforma Notifiche description',
    urlBO: 'http://notifiche/bo?token=<IdentityToken>',
    urlPublic: 'http://notifiche/public',
  },
  {
    id: '3',
    title: 'Pagamenti pagoPA',
    description: 'Pagamenti pagoPA description',

    urlBO: 'http://pagopa/bo#token=<IdentityToken>',
    urlPublic: 'http://pagopa/public',
  },
  {
    title: 'Check-IBAN',
    description: "Verifica l'abbinamento di un IBAN ad un CF di un cittadino o di un'impresa.",
    id: '4',

    urlPublic: 'http://www.google.it',
    urlBO: 'http://checkiban/bo#token=<IdentityToken>',
  },
  {
    id: '5',
    title: 'Carta Giovani',
    description: 'Richiedi la convenzione e gestisci i dati e le agevolazioni da offrire.',

    urlPublic: undefined,
    urlBO: 'http://cgn/bo#token=<IdentityToken>',
  },
  {
    id: '6',
    title: 'PDND',
    description: 'Condividi dati con altri Enti in maniera semplice, sicura ed economica.',

    urlPublic: undefined,
    urlBO: 'http://PDND/bo#token=<IdentityToken>',
  },
];

export const PortalApi = {
  getInstitutions: async (_productId: string): Promise<Array<InstitutionResource>> =>
    new Promise((resolve) => resolve(mockedInstitutionResources)),

  getInstitution: async (_institutionId: string): Promise<InstitutionDetailResource> =>
    new Promise((resolve) => resolve(mockedInstitutionDetailResource)),

  getProducts: async (): Promise<Array<ProductsResource>> =>
    new Promise((resolve) => resolve(mockedProductResources)),

  createChannel: async (_channel: ChannelOnCreation): Promise<ChannelDetailsResource> =>
    new Promise((resolve) => resolve(mockedPSPChannels)),

  associatePSPtoChannel: async (
    _channelcode: string,
    _pspcode: string,
    _payment_type: PspChannelPaymentTypes
  ): Promise<PspChannelPaymentTypesResource> =>
    new Promise((resolve) => resolve({ payment_types: ['ptype_test'] })),

  updateChannel: async (_channel: ChannelOnCreation): Promise<ChannelDetailsResource> =>
    new Promise((resolve) => resolve(mockedPSPChannels)),

  getPaymentTypes: async (): Promise<PaymentTypesResource> =>
    new Promise((resolve) => resolve(mockedPaymentTypes)),

  getChannelDetail: async (_channelcode: string): Promise<ChannelDetailsResource> =>
    new Promise((resolve) => resolve(mockedChannelDetail('12345'))),
};
