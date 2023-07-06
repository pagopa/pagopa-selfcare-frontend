import { fetchParties, fetchPartyDetails } from '../partyService';
import {
  institutionDetailResource2Party,
  institutionResource2Party,
  Party,
} from '../../model/Party';

import {
  mockedInstitutionDetailResource,
  mockedInstitutionResources,
  PortalApi,
} from '../../api/__mocks__/PortalApiClient';
import {
  InstitutionResource,
  InstitutionTypeEnum,
} from '../../api/generated/portal/InstitutionResource';

jest.mock('../../api/PortalApiClient');

let portalApiGetInstitutionSpy;
let portalApiGetInstitutionsSpy;

beforeEach(() => {
  portalApiGetInstitutionSpy = jest.spyOn(require('../partyService'), 'fetchPartyDetails');
  portalApiGetInstitutionsSpy = jest.spyOn(require('../partyService'), 'fetchParties');
});

export const mockedInstitution: Array<InstitutionResource> = [
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
    userProductRoles: ['operator'],
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
    externalId: '1122334455',
    originId: 'c_g922',
    origin: 'IPA',
    institutionType: 'PA' as InstitutionTypeEnum,
    name: 'Ente Creditore S.r.l.',
    fiscalCode: '1122334455',
    mailAddress: 'email-ec@test.dummy',
    status: 'ACTIVE',
    address: 'Via degli Enti Creditori 1',
    userProductRoles: ['admin'],
    companyInformations: {},
    assistanceContacts: {},
  },
];

test('Test fetchParties', async () => {
  const parties = await fetchParties();
  expect(parties).toMatchObject(mockedInstitution.map(institutionResource2Party));

  parties.forEach((p) =>
    expect(p.urlLogo).toBe(`http://checkout.selfcare/institutions/${p.partyId}/logo.png`)
  );

  expect(portalApiGetInstitutionsSpy).toBeCalledTimes(1);
});

describe('Test fetchPartyDetails', () => {
  const expectedPartyId: string = '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944';

  const checkSelectedParty = (party: Party | null) => {
    expect(party).not.toBeNull();
    expect(party).toMatchObject(institutionDetailResource2Party(mockedInstitutionDetailResource));
    expect(party!.urlLogo).toBe(
      `http://checkout.selfcare/institutions/${expectedPartyId}/logo.png`
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
    const parties = mockedInstitutionResources.map(institutionResource2Party);
    const party = await fetchPartyDetails(expectedPartyId, parties);
    checkSelectedParty(party);

    checkPortalApiInvocation(0);

    const partialParties = parties.filter((p) => p.partyId !== expectedPartyId);
    const party2 = await fetchPartyDetails(expectedPartyId, partialParties);
    expect(party2).toStrictEqual(party);

    checkPortalApiInvocation(0);
  });
});
