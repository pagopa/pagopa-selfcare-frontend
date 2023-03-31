import { PortalApi } from '../api/PortalApiClient';
import { StationsResource } from '../api/generated/portal/StationsResource';
import {
  createStationMocked,
  getStationCodeMocked,
  getStationDetail,
  getStations as getStationsMocked,
} from '../services/__mocks__/stationService';
import { StationCodeResource } from '../api/generated/portal/StationCodeResource';
import { CreditorInstitutionStationEditResource } from '../api/generated/portal/CreditorInstitutionStationEditResource';
import { CreditorInstitutionStationDto } from '../api/generated/portal/CreditorInstitutionStationDto';
import { StationDetailsDto } from '../api/generated/portal/StationDetailsDto';
import { StationDetailResource } from '../api/generated/portal/StationDetailResource';

export const createStation = (station: StationDetailsDto): Promise<StationDetailResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL !== 'true') {
    return createStationMocked(station);
  }
  return PortalApi.createStation(station).then((resources) => resources);
};

export const getStations = (
  page: number,
  creditorInstitutionCode?: string
): Promise<StationsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL !== 'true') {
    return getStationsMocked(0);
  }
  return PortalApi.getStations(page, creditorInstitutionCode).then((resource) => resource);
};

export const getStationDetails = (stationId: string): Promise<StationDetailResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL !== 'true') {
    return getStationDetail(stationId);
  }
  return PortalApi.getStation(stationId).then((resource) => resource);
};

export const getStationCode = (code: string): Promise<StationCodeResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL !== 'true') {
    return getStationCodeMocked(code);
  }
  return PortalApi.getStationCode(code).then((resource) => resource);
};

export const associateEcToStation = (
  code: string,
  station: CreditorInstitutionStationDto
): Promise<CreditorInstitutionStationEditResource> =>
  PortalApi.associateEcToStation(code, station).then((resource) => resource);
