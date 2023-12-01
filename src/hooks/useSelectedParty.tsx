import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { Party } from '../model/Party';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchParties } from '../services/partyService';
import { LOADING_TASK_SEARCH_PARTY } from '../utils/constants';
import { parseJwt } from '../utils/jwt-utils';
import { ENV } from '../utils/env';
import { JWTUser } from '../model/JwtUser';
import { useSigninData } from './useSigninData';

export type PartyJwtConfig = {
  partyId: string;
  /* roles: Array<{
    partyRole: PartyRole;
    roleKey: string;
  }>; */
};

export const retrieveSelectedPartyIdConfig = (): PartyJwtConfig | null => {
  const organizationId = (parseJwt(storageTokenOps.read()) as JWTUser)?.org_id;
  if (organizationId) {
    return {
      partyId: organizationId,
      /* roles: organization.roles.map((r) => ({
        partyRole: r.partyRole,
        roleKey: r.role,
      })), */
    };
  } else {
    return null;
  }
};

/** A custom hook to read the current partyId from JWT and then fetch its information, caching the result into redux */
export const useSelectedParty = (): (() => Promise<Party>) => {
  const dispatch = useAppDispatch();
  const partyJwtConfig: PartyJwtConfig | null = retrieveSelectedPartyIdConfig();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setParty = (party?: Party) => dispatch(partiesActions.setPartySelected(party));
  const updateSigninData = useSigninData();
  const setLoadingDetails = useLoading(LOADING_TASK_SEARCH_PARTY);
  const fetchParty = (partyId: string): Promise<Party> =>
    fetchParties().then((parties) => {
      const party = parties.find((p) => p.partyId === partyId);
      if (party) {
        if (party.status !== 'ACTIVE') {
          throw new Error(`INVALID_PARTY_STATE_${party.status}`);
        }
        const partyToSave = {
          ...party,
          /* roles:
            partyJwtConfig?.roles.map((r) => ({
              partyRole: r.partyRole,
              roleKey: r.roleKey,
            })) ?? [], */
        };
        setParty(partyToSave);
        void updateSigninData(party);
        return partyToSave;
      } else {
        throw new Error(`Cannot find partyId ${partyId}`);
      }
    });

  return () => {
    if (partyJwtConfig == null) {
      trackEvent('PARTY_ID_NOT_IN_TOKEN');
      window.location.assign(ENV.URL_FE.LOGOUT);
      return new Promise<Party>((_, reject) => reject());
    } else if (!selectedParty || selectedParty.partyId !== partyJwtConfig.partyId) {
      setLoadingDetails(true);
      return fetchParty(partyJwtConfig.partyId)
        .finally(() => setLoadingDetails(false))
        .catch((e) => {
          setParty(undefined);
          throw e;
        });
    } else {
      
      return new Promise<Party>((resolve) => resolve(selectedParty));
    }
  };
};
