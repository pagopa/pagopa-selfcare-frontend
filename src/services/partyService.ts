import { PortalApi } from '../api/PortalApiClient';
import { institutionResource2Party, Party } from '../model/Party';
import { mockedParties } from './__mocks__/partyService';

export const fetchParties = (): Promise<Array<Party>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return new Promise((resolve) => resolve(mockedParties));
  } else {
    return PortalApi.getInstitutions('prod-pagopa').then((institutionResources) =>
      institutionResources ? institutionResources.map(institutionResource2Party) : []
    );
  }
};

export const fetchPartyDetails = (
  partyId: string,
  parties?: Array<Party>
): Promise<Party | null> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return new Promise((resolve) =>
      resolve(mockedParties.find((p) => p.partyId === partyId) ?? null)
    );
  }

  return retrieveParty(partyId, parties);
};

// check inside parties as first
const retrieveParty = (
  partyId: string,
  parties: Array<Party> | undefined
): Promise<Party | null> => {
  if (parties) {
    const selected = parties.filter((p) => p.partyId === partyId);
    if (selected && selected.length > 0) {
      return new Promise((resolve) => resolve(selected[0]));
    } else {
      return retrieveParty_fetch(partyId);
    }
  } else {
    return retrieveParty_fetch(partyId);
  }
};

const retrieveParty_fetch = (partyId: string): Promise<Party | null> =>
  PortalApi.getInstitutions('prod-pagopa').then((institutionResources) =>
    institutionResources.filter((iR) => iR.id === partyId)
      ? institutionResource2Party(institutionResources.filter((iR) => iR.id === partyId)[0])
      : null
  );
