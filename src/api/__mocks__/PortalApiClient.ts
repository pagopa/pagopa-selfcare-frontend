import {
  InstitutionDetailResource,
  InstitutionTypeEnum,
} from '../generated/portal/InstitutionDetailResource';
import { InstitutionResource } from '../generated/portal/InstitutionResource';

import { ProductsResource } from '../generated/portal/ProductsResource';

export const mockedInstitutionResources: Array<InstitutionResource> = [
  {
    id: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944',
    externalId: '14847241008',
    originId: 'PSP_14847241008',
    origin: 'SELC',
    institutionType: 'PSP' as InstitutionTypeEnum,
    name: 'PSP S.p.A.',
    fiscalCode: '14847241008',
    mailAddress: 'pspspa@test.dummy',
    status: 'ACTIVE',
    address: 'VIA DEI PSP 20, ROMA',
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
      address: 'pectest@pec.pagopa.it',
      pec: 'pectest@pec.pagopa.it',
      email: 'pectest@pec.pagopa.it',
    },
  },
  {
    id: '6b82300e-4fad-459d-a75b-91b5e7ae4f04',
    externalId: '81001870922',
    originId: 'c_g922',
    origin: 'IPA',
    institutionType: 'PA' as InstitutionTypeEnum,
    name: 'Ente Creditore S.r.l.',
    fiscalCode: '81001870922',
    mailAddress: 'email-ec@test.dummy',
    status: 'ACTIVE',
    address: 'Via degli Enti Creditori 1',
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
};
