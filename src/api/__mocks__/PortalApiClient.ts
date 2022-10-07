import { InstitutionResource, InstitutionTypeEnum } from '../generated/portal/InstitutionResource';

import { ProductsResource } from '../generated/portal/ProductsResource';

export const mockedInstitutionResources: Array<InstitutionResource> = [
  {
    name: 'Comune di Bari',
    status: 'ACTIVE',
    id: '1',
    externalId: 'externalId1',
    originId: 'originId1',
    origin: 'IPA',
    mailAddress: 'address',
    fiscalCode: 'fiscalCode',
    // userRole: 'LIMITED',
    institutionType: InstitutionTypeEnum.PA,
    address: 'Piazza della Scala, 2 - 20121 Milano',
    userProductRoles: ['security', 'api'],
  },
  {
    name: 'Comune di Milano',
    status: 'PENDING',
    id: '2',
    externalId: 'externalId2',
    originId: 'originId2',
    origin: 'IPA',
    mailAddress: 'address',
    fiscalCode: 'fiscalCode',
    // userRole: 'ADMIN',
    institutionType: InstitutionTypeEnum.PA,
    address: 'Piazza della Scala, 2 - 20121 Milano',
    userProductRoles: ['security', 'api'],
  },
];

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
  getInstitutions: async (): Promise<Array<InstitutionResource>> =>
    new Promise((resolve) => resolve(mockedInstitutionResources)),

  getInstitution: async (_partyId: string): Promise<InstitutionResource> =>
    new Promise((resolve) => resolve(mockedInstitutionResources[0])),

  getProducts: async (): Promise<Array<ProductsResource>> =>
    new Promise((resolve) => resolve(mockedProductResources)),
};
