// import { BackofficeApi } from '../api/BackofficeClient';
import { toError } from 'fp-ts/lib/Either';
import {storageTokenOps} from '@pagopa/selfcare-common-frontend/utils/storage';
import { ENV } from '../utils/env';
import { Taxonomies } from '../api/generated/portal/Taxonomies';
import { getTaxonomies as getTaxonomiesMock } from './__mocks__/taxonomyService';



// TODO FIX GENERATED CLIENT AND RE-INTRODUCE BACKOFFICE METHOD
export const getTaxonomies = (): Promise<Taxonomies> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getTaxonomiesMock();
  } else {
    //       return BackofficeApi.getTaxonomies();
    return fetchData();
  }
};

async function fetchData(): Promise<Taxonomies> {
  try {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${storageTokenOps.read()}`);

    const response = await fetch(`${ENV.URL_API.BACKOFFICE}/taxonomies`, {
      method: 'GET',
      headers,
    });
    return await response.json();
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    throw toError(error);
  }
}
