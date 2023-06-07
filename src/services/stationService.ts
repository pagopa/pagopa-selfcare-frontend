import { PortalApi } from '../api/PortalApiClient';
import { StationsResource } from '../api/generated/portal/StationsResource';
import { WrapperStationsResource } from '../api/generated/portal/WrapperStationsResource';
import {
  createStationMocked,
  getStationCodeMocked,
  getStationDetail,
  getStations as getStationsMocked,
  getStationsMerged as getStationsMergedMocked,
  dissociateECfromStation as dissociateECfromStationMocked,
  getECListByStationCode as getECListByStationCodeMocked,
  getStationAvailableEC as getStationAvailableECMocked,
  associateEcToStation as associateEcToStationMocked,
} from '../services/__mocks__/stationService';
import { StationCodeResource } from '../api/generated/portal/StationCodeResource';
import { CreditorInstitutionStationEditResource } from '../api/generated/portal/CreditorInstitutionStationEditResource';
import { CreditorInstitutionStationDto } from '../api/generated/portal/CreditorInstitutionStationDto';
import { StationDetailsDto } from '../api/generated/portal/StationDetailsDto';
import { StationDetailResource } from '../api/generated/portal/StationDetailResource';
import { CreditorInstitutionsResource } from '../api/generated/portal/CreditorInstitutionsResource';

export const createStation = (station: StationDetailsDto): Promise<StationDetailResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createStationMocked(station);
  }
  return PortalApi.createStation(station).then((resources) => resources);
};

export const getStations = (
  page: number,
  creditorInstitutionCode?: string
): Promise<StationsResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationsMocked(0);
  }
  return PortalApi.getStations(page, creditorInstitutionCode).then((resource) => resource);
};

export const getStationsMerged = (
  page: number,
  brokerCode: string,
  stationcode?: string,
  limit?: number,
  sorting?: string
): Promise<WrapperStationsResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationsMergedMocked(page);
  }
  return PortalApi.getStationsMerged(page, brokerCode, stationcode, limit, sorting).then(
    (resource) => resource
  );
};

export const getStationDetails = (stationId: string): Promise<StationDetailResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationDetail(stationId);
  }
  return PortalApi.getStation(stationId).then((resource) => resource);
};

export const getStationCode = (code: string): Promise<StationCodeResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationCodeMocked(code);
  }
  return PortalApi.getStationCode(code).then((resource) => resource);
};

export const getECListByStationCode = (
  stationcode: string,
  page: number,
  limit?: number
): Promise<CreditorInstitutionsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getECListByStationCodeMocked(stationcode, page, limit);
  } else {
    return PortalApi.getECListByStationCode(stationcode, page, limit).then(
      (resources) => resources
    );
  }
};

export const dissociateECfromStation = (ecCode: string, stationCode: string): Promise<void> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return dissociateECfromStationMocked(ecCode, stationCode);
  } else {
    return PortalApi.dissociateECfromStation(ecCode, stationCode).then((resources) => resources);
  }
};

export const associateEcToStation = (
  code: string,
  station: CreditorInstitutionStationDto
): Promise<CreditorInstitutionStationEditResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return associateEcToStationMocked(code, station);
  }
  return PortalApi.associateEcToStation(code, station).then((resource) => resource);
};

export const getStationAvailableEC = (): Promise<Array<any>> =>
  /* istanbul ignore if */
  /* if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    TODO: fix when real service rollout
    return getChannelAvailablePSPMocked(page);
  } else {
    return PortalApi.getChannelAvailablePSP(page).then((resources) => resources);
  } */
  getStationAvailableECMocked();
