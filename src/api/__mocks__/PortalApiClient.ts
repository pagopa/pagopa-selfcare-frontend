// import { EmailString } from '@pagopa/ts-commons/lib/strings';
import { InstitutionResource } from '../generated/portal/InstitutionResource';
import { ProductsResource } from '../generated/portal/ProductsResource';

export const mockedInstitutionResources: Array<InstitutionResource> = [
  {
    address: 'Piazza della Scala, 2 - 20121 Milano',
    externalId: 'externalId1',
    fiscalCode: 'fiscalCode',
    id: '1',
    mailAddress: 'address',
    name: 'Comune di Bari',
    origin: 'IPA',
    originId: 'originId1',
    status: 'ACTIVE',
    userProductRoles: ['ADMIN', 'USER'],
  },
  {
    address: 'Piazza della Scala, 2 - 20121 Milano',
    name: 'Comune di Milano',
    status: 'PENDING',
    id: '2',
    externalId: 'externalId2',
    originId: 'originId2',
    origin: 'IPA',
    mailAddress: 'address',
    fiscalCode: 'fiscalCode',
    userProductRoles: ['ADMIN'],
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
];

/*
export const mockedInstitutionUserResource: Array<InstitutionUserResource> = [
  {
    id: '1',
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    role: 'LIMITED' as RoleEnum,
    email: 'address' as EmailString,
    products: [
      {
        id: 'productId',
        title: 'productTitle',
        roleInfos: [
          {
            relationshipId: 'relId',
            role: 'incaricato-ente-creditore',
            selcRole: SelcRoleEnum.ADMIN,
            status: 'ACTIVE',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Name2',
    surname: 'Surname2',
    status: 'ACTIVE',
    role: 'ADMIN' as RoleEnum,
    email: 'address' as EmailString,
    products: [
      {
        id: 'productId2',
        title: 'productTitle2',
        roleInfos: [
          {
            relationshipId: 'relId',
            role: 'incaricato-ente-creditore',
            selcRole: SelcRoleEnum.ADMIN,
            status: 'ACTIVE',
          },
        ],
      },
    ],
  },
];
*/

/*
export const mockedProductUserResource: Array<ProductUserResource> = [
  {
    id: '1',
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    role: 'LIMITED' as RoleEnum,
    email: 'address' as EmailString,
    product: {
      id: 'prod-io',
      title: 'App IO',
      roleInfos: [
        {
          relationshipId: 'relationshipId',
          role: 'incaricato-ente-creditore',
          selcRole: SelcRoleEnum.ADMIN,
          status: 'ACTIVE',
        },
      ],
    },
  },
  {
    id: '2',
    name: 'Name2',
    surname: 'Surname2',
    status: 'ACTIVE',
    role: 'ADMIN' as RoleEnum,
    email: 'address2' as EmailString,
    product: {
      id: 'prod-io',
      title: 'App IO',
      roleInfos: [
        {
          relationshipId: 'relationshipId2',
          role: 'incaricato-ente-creditore',
          selcRole: SelcRoleEnum.ADMIN,
          status: 'ACTIVE',
        },
      ],
    },
  },
];
*/

/*
export const mockedProductRoles: Array<ProductRoleMappingsResource> = [
  {
    partyRole: PartyRoleEnum.SUB_DELEGATE,
    selcRole: SelcRoleEnum.ADMIN,
    multiroleAllowed: false,
    productRoles: [
      {
        code: 'incaricato-ente-creditore',
        description: 'Descrizione incaricato-ente-creditore',
        label: 'Incaricato Ente Creditore',
      },
    ],
  },
  {
    partyRole: PartyRoleEnum.OPERATOR,
    selcRole: SelcRoleEnum.LIMITED,
    multiroleAllowed: true,
    productRoles: [
      {
        code: 'referente-dei-pagamenti',
        description: 'Descrizione referente-dei-pagamenti',
        label: 'Referente dei Pagamenti',
      },
      {
        code: 'referente-tecnico',
        description: 'Descrizione referente-tecnico',
        label: 'Referente Tecnico',
      },
    ],
  },
];
*/

/* 
export const mockedUserResource: PlainUserResource = {
  id: 'id1',
  fiscalCode: 'AAAAAA11A11A123K',
  name: { certified: true, value: 'Gigi' },
  familyName: { certified: true, value: 'Verdi' },
  email: { certified: true, value: 'gigi.v@email.com' },
}; */

export const PortalApi = {
  getInstitutions: async (): Promise<Array<InstitutionResource>> =>
    new Promise((resolve) => resolve(mockedInstitutionResources)),

  getInstitution: async (_partyId: string): Promise<InstitutionResource> =>
    new Promise((resolve) => resolve(mockedInstitutionResources[0])),

  getProducts: async (): Promise<Array<ProductsResource>> =>
    new Promise((resolve) => resolve(mockedProductResources)),

  /* getTokenExchange: async (_partyId: string, _productId: string): Promise<IdentityTokenResource> =>
    new Promise((resolve) => resolve({ token: 'DUMMYTOKEN' })),

  getProductRoles: async (_productId: string): Promise<Array<ProductRoleMappingsResource>> =>
    new Promise((resolve) => resolve(mockedProductRoles)), */
};
