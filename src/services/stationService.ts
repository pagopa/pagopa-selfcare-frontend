import { StationDetailsDto } from '../api/generated/portal/StationDetailsDto';
import { PortalApi } from '../api/PortalApiClient';
import { StationOnCreation } from '../model/Station';
import { createStationMocked, mockedStation } from './__mocks__/stationService';

export const createStation = (station: StationOnCreation): Promise<StationDetailsDto> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createStationMocked(mockedStation);
  }
  return PortalApi.createStation(station).then((resources) => resources);
};
