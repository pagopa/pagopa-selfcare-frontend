import { StationDetailsDto } from '../api/generated/portal/StationDetailsDto';
import { PortalApi } from '../api/PortalApiClient';
import { StationOnCreation } from '../model/Station';
import { StationsResource } from '../api/generated/portal/StationsResource';
import { getStations as getStationsMocked } from '../services/__mocks__/stationService';
import { createStationMocked, mockedStation } from './__mocks__/stationService';

export const createStation = (station: StationOnCreation): Promise<StationDetailsDto> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createStationMocked(mockedStation);
  }
  return PortalApi.createStation(station).then((resources) => resources);
};

export const getStations = (page: number): Promise<StationsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationsMocked(page);
  } else {
    return PortalApi.getStations(page).then((resource) => resource);
  }
};
