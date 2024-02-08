import { BackofficeApi } from "../api/BackofficeClient";
import { Taxonomies } from "../api/generated/portal/Taxonomies";
import {getTaxonomies as getTaxonomiesMock} from "./__mocks__/taxonomyService";

export const getTaxonomies = (): Promise<Taxonomies> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
      return getTaxonomiesMock();
    } else {
      return BackofficeApi.getTaxonomies();
    }
  };