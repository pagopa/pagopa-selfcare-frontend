import { CIPaymentContact } from '../../api/generated/portal/CIPaymentContact';
import { CreditorInstitutionContactsResource } from '../../api/generated/portal/CreditorInstitutionContactsResource';
import { CreditorInstitutionInfoResource } from '../../api/generated/portal/CreditorInstitutionInfoResource';
import { CreditorInstitutionsResource } from '../../api/generated/portal/CreditorInstitutionsResource';
import { TavoloOpResource } from '../../api/generated/portal/TavoloOpResource';

export const mockedCIContacts: Array<CIPaymentContact> = [
  {
    email: 'referent@dummy.com',
    id: '23453455',
    name: 'referent',
    roles: ['admin'],
    surname: 'surname',
    user_tax_code: '012345678912',
  },
  {
    email: 'referent2@dummy.com',
    id: '23453444',
    name: 'referent2',
    roles: ['admin'],
    surname: 'surname2',
    user_tax_code: '012345678916',
  },
];
export const mockedCIOperativeTable: TavoloOpResource = {
  createdAt: new Date(),
  createdBy: 'ownerUser',
  email: 'ccc@bbb.dummy.it',
  modifiedAt: new Date(),
  modifiedBy: 'modifierUser',
  name: 'CCC s.r.l',
  referent: 'referent',
  taxCode: '012345678912',
  telephone: '0039012345678912',
};

export const mockedCreditorInstitutionContactsResource: CreditorInstitutionContactsResource = {
  ci_payment_contacts: mockedCIContacts,
  operative_table: mockedCIOperativeTable,
};

export const mockedCreditorInstitutionsResource: CreditorInstitutionsResource = {
  creditor_institutions: [
    {
      businessName: 'Ec 1',
      creditorInstitutionCode: '12345678912',
      enabled: true,
      applicationCode: undefined,
      auxDigit: '3',
      broadcast: false,
      cbillCode: '123',
      mod4: 'mod',
      segregationCode: '15',
    },
    {
      businessName: 'Ec 2',
      creditorInstitutionCode: '12345678913',
      enabled: true,
      applicationCode: undefined,
      auxDigit: '3',
      broadcast: false,
      cbillCode: '124',
      mod4: 'mod',
      segregationCode: '16',
    },
  ],
  page_info: {
    items_found: 2,
    limit: 10,
    page: 0,
    total_items: 2,
    total_pages: 1,
  },
};

export const mockedCreditorInstitutionInfoArray: CreditorInstitutionInfoResource = {
  creditor_institution_info_list: [
  {
    businessName: 'EC 1',
    creditorInstitutionCode: '012345678912',
  },
  {
    businessName: 'EC 2',
    creditorInstitutionCode: '012345678913',
  },
  {
    businessName: 'EC 3',
    creditorInstitutionCode: '012345678914',
  },
  ],
};

export const getCreditorInstitutionContactsMock =
  (): Promise<CreditorInstitutionContactsResource> =>
    Promise.resolve(mockedCreditorInstitutionContactsResource);

export const getCreditorInstitutionssMock = (): Promise<CreditorInstitutionsResource> =>
  Promise.resolve(mockedCreditorInstitutionsResource);

export const getAvailableCreditorInstitutionsForStationMock =
  (): Promise<CreditorInstitutionInfoResource> =>
    Promise.resolve(mockedCreditorInstitutionInfoArray);
