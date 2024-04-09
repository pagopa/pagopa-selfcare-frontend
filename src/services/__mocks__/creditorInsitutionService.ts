import { CIPaymentContact } from '../../api/generated/portal/CIPaymentContact';
import { CreditorInstitutionContactsResource } from '../../api/generated/portal/CreditorInstitutionContactsResource';
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

export const getCreditorInstitutionContactsMock =
  (): Promise<CreditorInstitutionContactsResource> =>
    Promise.resolve({
      ci_payment_contacts: mockedCIContacts,
      operative_table: mockedCIOperativeTable,
    });
