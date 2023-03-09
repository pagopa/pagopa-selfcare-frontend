import { fetchParties, fetchPartyDetails } from '../partyService';
import {
  institutionDetailResource2Party,
  institutionResource2Party,
  Party,
} from '../../model/Party';
import { PortalApi } from '../../api/PortalApiClient';
import {
  mockedInstitutionDetailResource,
  mockedInstitutionResources,
} from '../../api/__mocks__/PortalApiClient';

jest.mock('../../api/PortalApiClient');

let portalApiGetInstitutionSpy;
let portalApiGetInstitutionsSpy;

beforeEach(() => {
  portalApiGetInstitutionSpy = jest.spyOn(PortalApi, 'getInstitution');
  portalApiGetInstitutionsSpy = jest.spyOn(PortalApi, 'getInstitutions');
});

test('Test fetchParties', async () => {
  const parties = await fetchParties();

  expect(parties).toMatchObject(mockedInstitutionResources.map(institutionResource2Party));

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

  test('Test no parties as cache', async () => {
    const party = await fetchPartyDetails(expectedPartyId);
    checkSelectedParty(party);
    checkPortalApiInvocation(0);
  });

  test('Test parties as cache', async () => {
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
