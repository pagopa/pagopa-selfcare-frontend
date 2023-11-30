import { ProductModel } from '../../model/Product';

export const mockedPartyProducts: Array<ProductModel> = [
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-io/logo.png',
    title: 'App IO',
    description: 'App IO description',
    id: 'prod-io',
    authorized: true,
    status: 'ACTIVE',
    selfcareRole: 'ADMIN',
    roles: [],
    activationDateTime: new Date(2021, 1, 1),
    urlPublic: 'http://appio/public',
    urlBO: 'http://appio/bo#<IdentityToken>',
    imageUrl: '',
    subProducts: [],
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pn/logo.png',
    id: 'prod-pn',
    title: 'Piattaforma Notifiche',
    description: 'Piattaforma Notifiche description',
    authorized: true,
    status: 'ACTIVE',
    selfcareRole: 'ADMIN',
    roles: [],
    urlBO: 'http://notifiche/bo?token=<IdentityToken>',
    activationDateTime: new Date(2021, 1, 2),
    urlPublic: 'http://notifiche/public',
    imageUrl: '',
    subProducts: [],
  },
];

export const verifyFetchPartyProductsMockExecution = (partyProducts: Array<ProductModel>) => {
  expect(partyProducts).toStrictEqual(mockedPartyProducts);
};

export const fetchProducts = () => new Promise((resolve) => resolve(mockedPartyProducts));
