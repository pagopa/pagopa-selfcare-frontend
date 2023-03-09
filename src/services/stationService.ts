import { StationsResource } from '../api/generated/portal/StationsResource';
import { PortalApi } from '../api/PortalApiClient';
import { getStations as getStationsMocked } from '../services/__mocks__/stationService';

export const getStations = (page: number): Promise<StationsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationsMocked(page);
  } else {
    return PortalApi.getStations(page).then((resource) => resource);
  }
};
