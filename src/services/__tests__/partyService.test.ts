import { fetchParties, fetchPartyDetails } from '../partyService';
import {
  institutionDetailResource2Party,
  institutionResource2Party,
  Party,
} from '../../model/Party';

import { mockedInstitutionDetailResource, PortalApi } from '../../api/__mocks__/PortalApiClient';
import {
  InstitutionResource,
  InstitutionTypeEnum,
} from '../../api/generated/portal/InstitutionResource';

jest.mock('../../api/PortalApiClient');

let portalApiGetInstitutionsSpy: jest.SpyInstance<any, unknown[]>;

beforeEach(() => {
  portalApiGetInstitutionsSpy = jest.spyOn(require('../partyService'), 'fetchParties');
});

export const pspAdminSignedInstitution: InstitutionResource = {
  id: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944',
  externalId: 'pspAdminSigned',
  originId: 'PSP_pspAdminSigned',
  origin: 'SELC',
  institutionType: 'PSP' as InstitutionTypeEnum,
  name: 'PSP Admin Signed Direct',
  fiscalCode: 'pspAdminSigned_DIRECT',
  mailAddress: 'pspAdminSigned@test.dummy',
  status: 'ACTIVE',
  address: 'VIA DEI pspAdminSigned 20, ROMA',
  userProductRoles: ['admin'],
  companyInformations: {},
  assistanceContacts: {},
  pspData: {
    businessRegisterNumber: '00000000000',
    legalRegisterName: 'ISTITUTI DI PAGAMENTO',
    legalRegisterNumber: '09879',
    abiCode: 'pspAdminSigned_DIRECT',
    vatNumberGroup: false,
  },
  dpoData: {
    address: 'pectest@pec.pagopa.it',
    pec: 'pectest@pec.pagopa.it',
    email: 'pectest@pec.pagopa.it',
  },
};

export const pspAdminUnsignedInstitution: InstitutionResource = {
  id: 'pspAdminSignedUndirect',
  externalId: 'pspAdminSignedUndirect',
  originId: 'PSP_pspAdminSignedUndirect',
  origin: 'SELC',
  institutionType: 'PSP' as InstitutionTypeEnum,
  name: 'PSP Admin Signed Undirect',
  fiscalCode: 'pspAdminSigned_UNDIRECT',
  mailAddress: 'pspAdminSignedUndirectInstitution@test.dummy',
  status: 'ACTIVE',
  address: 'VIA DEI pspAdminSigned  Undirect 20, ROMA',
  userProductRoles: ['admin'],
  companyInformations: {},
  assistanceContacts: {},
  pspData: {
    businessRegisterNumber: '00000000001',
    legalRegisterName: 'ISTITUTO DI PAGAMENTO',
    legalRegisterNumber: '09880',
    abiCode: 'pspAdminSigned_UNDIRECT',
    vatNumberGroup: true,
  },
  dpoData: {
    address: 'pectestunsigned@pec.pagopa.it',
    pec: 'pectestunsigned@pec.pagopa.it',
    email: 'pectestunsigned@pec.pagopa.it',
  },
};

export const ecAdminSignedInstitution: InstitutionResource = {
  id: 'ecAdminSignedDirect',
  externalId: '1122334455',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PA' as InstitutionTypeEnum,
  name: 'EC Admin Signed Direct',
  fiscalCode: 'ecAdminSigned_DIRECT',
  mailAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  address: 'Via degli Enti Creditori 1',
  userProductRoles: ['admin'],
  companyInformations: {},
  assistanceContacts: {},
};

export const pspOperatorUnsignedInstitution: InstitutionResource = {
  id: 'pspOperatorUnsigned',
  externalId: '14847241010',
  originId: 'PSP_14847241010',
  origin: 'SELC',
  institutionType: 'PSP' as InstitutionTypeEnum,
  name: 'PSP Operator unsigned',
  fiscalCode: '14847241010',
  mailAddress: 'pspspa@test.dummy',
  status: 'ACTIVE',
  address: 'VIA DEI PSP 21, ROMA',
  userProductRoles: ['operator'],
  pspData: {
    businessRegisterNumber: '00000000001',
    legalRegisterName: 'ISTITUTI DI PAGAMENTO',
    legalRegisterNumber: '09880',
    abiCode: 'pspOperatorUnsigned',
    vatNumberGroup: false,
  },
  dpoData: {
    address: 'pectest@pec.pagopa.it',
    pec: 'pectest@pec.pagopa.it',
    email: 'pectest@pec.pagopa.it',
  },
};

export const ecOperatorUnsignedInstitution: InstitutionResource = {
  id: '6b82300e-4fad-459d-a75b-91b5e7ae4f05',
  externalId: '1122334456',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PA' as InstitutionTypeEnum,
  name: 'EC unsigned',
  fiscalCode: '1122334456',
  mailAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  address: 'Via degli Enti Creditori 1',
  userProductRoles: ['operator'],
};

export const mockedInstitutions: Array<InstitutionResource> = [
  pspAdminSignedInstitution,
  pspAdminUnsignedInstitution,
  pspOperatorUnsignedInstitution,
  ecAdminSignedInstitution,
  ecOperatorUnsignedInstitution,
];

test('Test fetchParties', async () => {
  const parties = await fetchParties();
  expect(parties[0]).toMatchObject(mockedInstitutions.map(institutionResource2Party)[0]);
  expect(parties[1]).toMatchObject(mockedInstitutions.map(institutionResource2Party)[1]);
  expect(parties[6]).toMatchObject(mockedInstitutions.map(institutionResource2Party)[3]);

  parties.forEach((p) =>
    expect(p.urlLogo).toBe(`https://checkout.selfcare/institutions/${p.partyId}/logo.png`)
  );

  expect(portalApiGetInstitutionsSpy).toBeCalledTimes(1);
});

describe('Test fetchPartyDetails', () => {
  const expectedPartyId: string = '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944';

  const checkSelectedParty = (party: Party | null) => {
    expect(party).not.toBeNull();
    expect(party).toMatchObject(institutionDetailResource2Party(mockedInstitutionDetailResource));
    expect(party!.urlLogo).toBe(
      `https://checkout.selfcare/institutions/${expectedPartyId}/logo.png`
    );
  };

  const checkPortalApiInvocation = (expectedCallsNumber: number) => {
    expect(PortalApi.getInstitutions).toBeCalledTimes(expectedCallsNumber);
    if (expectedCallsNumber > 0) {
      expect(PortalApi.getInstitutions).toBeCalledWith('prod-pagopa');
    }
  };

  // TODO: to be fixed when fetchPartyDetails will also retrieve roles
  test.skip('Test no parties as cache', async () => {
    const party = await fetchPartyDetails(expectedPartyId);
    checkSelectedParty(party);
    checkPortalApiInvocation(0);
  });

  // TODO: to be fixed when fetchPartyDetails will also retrieve roles
  test.skip('Test parties as cache', async () => {
    const parties = mockedInstitutions.map(institutionResource2Party);
    const party = await fetchPartyDetails(expectedPartyId, parties);
    checkSelectedParty(party);

    checkPortalApiInvocation(0);

    const partialParties = parties.filter((p) => p.partyId !== expectedPartyId);
    const party2 = await fetchPartyDetails(expectedPartyId, partialParties);
    expect(party2).toStrictEqual(party);

    checkPortalApiInvocation(0);
  });
});
