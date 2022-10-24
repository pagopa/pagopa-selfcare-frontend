import {
  InstitutionResource,
  InstitutionTypeEnum,
} from '../../api/generated/portal/InstitutionResource';
import { institutionResource2Party } from '../Party';

test('Test institutionResource2Party', () => {
  const institutionResource: InstitutionResource = {
    id: '46ef5b6b-7ee4-4dab-b8bc-fb5e30111239',
    externalId: '15376371009',
    originId: 'PAGOPASPA',
    origin: 'static',
    institutionType: InstitutionTypeEnum.PA,
    name: 'PagoPA S.p.A.',
    fiscalCode: '15376371009',
    mailAddress: 'selfcare@pec.pagopa.it',
    status: 'ACTIVE',
    address: 'Piazza Colonna, 370',
    userProductRoles: ['admin'],
  };

  const party = institutionResource2Party(institutionResource);

  expect(party).toStrictEqual({
    partyId: '46ef5b6b-7ee4-4dab-b8bc-fb5e30111239',
    externalId: '15376371009',
    originId: 'PAGOPASPA',
    origin: 'static',
    description: 'PagoPA S.p.A.',
    digitalAddress: 'selfcare@pec.pagopa.it',
    status: 'ACTIVE',
    roles: [{ partyRole: 'admin', roleKey: 'admin' }],
    urlLogo: 'http://checkout.selfcare/institutions/46ef5b6b-7ee4-4dab-b8bc-fb5e30111239/logo.png',
    fiscalCode: '15376371009',
    registeredOffice: 'Piazza Colonna, 370',
    typology: 'TODO',
    institutionType: 'PA',
  });
});
