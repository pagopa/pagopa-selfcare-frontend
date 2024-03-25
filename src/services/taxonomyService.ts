import { BackofficeApi } from '../api/BackofficeClient';
import { Taxonomies } from '../api/generated/portal/Taxonomies';
import { TaxonomyGroups } from '../api/generated/portal/TaxonomyGroups';
import { getTaxonomies as getTaxonomiesMock, getTaxonomyGroups as getTaxonomyGroupsMock } from './__mocks__/taxonomyService';


export const getTaxonomies = (ec: string | undefined, area: string | undefined, code: string | undefined, onlyValid: boolean): Promise<Taxonomies> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getTaxonomiesMock();
  } else {
    return BackofficeApi.getTaxonomies(ec, area, code, onlyValid);
  }
};

export const getTaxonomyGroups = (): Promise<TaxonomyGroups> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getTaxonomyGroupsMock();
  } else {
    return BackofficeApi.getTaxonomyGroups();
  }
};
