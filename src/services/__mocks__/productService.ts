import { Product } from '../../model/Product';

export const mockedPartyProducts: Array<Product> = [
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-io/logo.png',
    title: 'App IO',
    description: 'App IO description',
    id: 'prod-io',
    authorized: true,
    status: 'ACTIVE',
    selfcareRole: 'ADMIN',
    roles: [
      {
        partyRole: 'MANAGER',
        roleKey: 'referente-legale', // TODO use real product role
      },
    ],
    activationDateTime: new Date(2021, 1, 1),
    urlPublic: 'https://io.italia.it/ ',
    urlBO: 'https://io.selfcare.pagopa.it/path/acs?token=<IdentityToken>',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [{ id: 'prod-io-premium', title: 'Premium', status: 'ACTIVE' }],
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pn/logo.png',
    id: 'prod-pn',
    title: 'Piattaforma Notifiche',
    description: 'Piattaforma Notifiche description',
    authorized: false,
    status: 'ACTIVE',
    selfcareRole: 'LIMITED',
    roles: [
      {
        partyRole: 'OPERATOR',
        roleKey: 'referente-dei-pagamenti', // TODO use real product role
      },
    ],
    urlBO: 'http://notifiche/bo?token=<IdentityToken>',
    activationDateTime: new Date(2021, 1, 2),
    urlPublic: 'http://notifiche/public',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [],
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pagopa/logo.png',
    id: 'prod-pagopa',
    title: 'Pagamenti pagoPA',
    description: 'Pagamenti pagoPA description',
    authorized: true,
    status: 'ACTIVE',
    selfcareRole: 'ADMIN',
    roles: [
      {
        partyRole: 'SUB_DELEGATE',
        roleKey: 'incaricato-ente-creditore', // TODO use real product role
      },
    ],
    urlBO: 'http://pagopa/bo#token=<IdentityToken>',
    activationDateTime: new Date(2021, 1, 3),
    urlPublic: 'http://pagopa/public',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [],
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-ciban/logo.png',
    title: 'Check-IBAN',
    description: "Verifica l'abbinamento di un IBAN ad un CF di un cittadino o di un'impresa.",
    id: 'prod-ciban',
    authorized: false,
    status: 'PENDING',
    selfcareRole: 'ADMIN',
    roles: [
      {
        partyRole: 'SUB_DELEGATE',
        roleKey: 'incaricato-ente-creditore', // TODO use real product role
      },
    ],
    urlBO: 'http://checkiban/bo#token=<IdentityToken>',
    urlPublic: 'http://www.google.it',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [],
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-cgn/logo.png',
    id: 'prod-cgn',
    title: 'Carta Giovani',
    description: 'Richiedi la convenzione e gestisci i dati e le agevolazioni da offrire.',
    urlBO: 'http://cgn/bo#token=<IdentityToken>',
    authorized: false,
    status: 'INACTIVE',
    selfcareRole: 'ADMIN',
    roles: [
      {
        partyRole: 'SUB_DELEGATE',
        roleKey: 'incaricato-ente-creditore', // TODO use real product role
      },
    ],
    urlPublic: undefined,
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [],
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-interop/logo.png',
    id: 'prod-interop',
    title: 'PDND',
    description: 'Condividi dati con altri Enti in maniera semplice, sicura ed economica.',
    urlBO: 'http://PDND/bo#token=<IdentityToken>',
    authorized: true,
    selfcareRole: 'ADMIN',
    roles: [
      {
        partyRole: 'SUB_DELEGATE',
        roleKey: 'incaricato-ente-creditore', // TODO use real product role
      },
    ],
    status: 'ACTIVE',
    urlPublic: undefined,
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [],
  },
];

export const verifyFetchPartyProductsMockExecution = (partyProducts: Array<Product>) => {
  expect(partyProducts).toStrictEqual(mockedPartyProducts);
};

export const fetchProducts = () => new Promise((resolve) => resolve(mockedPartyProducts));
