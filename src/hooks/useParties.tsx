import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { Party } from '../model/Party';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchParties } from '../services/partyService';

/** A custom hook to retrieve the logged user's available parties making use of redux in order to cache these info */
export const useParties = (): (() => Promise<Array<Party>>) =>
  useReduxCachedValue(
    'PARTIES',
    fetchParties,
    partiesSelectors.selectPartiesList,
    partiesActions.setPartiesList
  );
