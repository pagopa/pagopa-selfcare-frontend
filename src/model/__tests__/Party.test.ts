import {
  InstitutionResource,
  InstitutionTypeEnum,
} from '../../api/generated/portal/InstitutionResource';
import { institutionResource2Party } from '../Party';

test('Test institutionResource2Party', () => {
  const institutionResource: InstitutionResource = {
    name: 'Comune di Bari',
    status: 'PENDING',
    id: '1',
    externalId: 'externalId1',
    originId: 'originId1',
    origin: 'IPA',
    category: 'Ente locale',
    mailAddress: 'address',
    fiscalCode: 'fiscalCode',
    userRole: 'LIMITED',
    institutionType: InstitutionTypeEnum.PA,
    address: 'address',
  };

  const party = institutionResource2Party(institutionResource);
  expect(party).toStrictEqual({
    roles: [
      {
        partyRole: undefined,
        roleKey: 'LIMITED',
      },
    ],
    description: 'Comune di Bari',
    status: 'PENDING',
    partyId: '1',
    fiscalCode: 'fiscalCode',
    digitalAddress: 'address',
    category: 'Ente locale',
    urlLogo: 'http://checkout.selfcare/institutions/1/logo.png',
    externalId: 'externalId1',
    originId: 'originId1',
    origin: 'IPA',
    institutionType: 'PA',
    registeredOffice: 'address',
    typology: 'TODO',
  });
});
