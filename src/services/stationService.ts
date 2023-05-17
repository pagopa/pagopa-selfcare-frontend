import { PortalApi } from '../api/PortalApiClient';
import { StationsResource } from '../api/generated/portal/StationsResource';
import {
  createStationMocked,
  getStationCodeMocked,
  getStationDetail,
  getStations as getStationsMocked,
  dissociateECfromStation as dissociateECfromStationMocked,
  getStationECs as getStationECsMocked,
  getStationAvailableEC as getStationAvailableECMocked,
} from '../services/__mocks__/stationService';
import { StationCodeResource } from '../api/generated/portal/StationCodeResource';
import { CreditorInstitutionStationEditResource } from '../api/generated/portal/CreditorInstitutionStationEditResource';
import { CreditorInstitutionStationDto } from '../api/generated/portal/CreditorInstitutionStationDto';
import { StationDetailsDto } from '../api/generated/portal/StationDetailsDto';
import { StationDetailResource } from '../api/generated/portal/StationDetailResource';

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

export const getStationECs = (stationcode: string, page: number, limit?: number): Promise<any> =>
  getStationECsMocked(stationcode, page, limit);
/*
TODO: fix when real service rollout
{
  /* istanbul ignore if */
/*
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationECsMocked(page);
  } else {
    return PortalApi.getStationECs(stationcode, page, limit).then((resources) => resources);
  }
};
*/

export const dissociateECfromStation = (stationcode: string, pspcode: string): Promise<void> =>
  dissociateECfromStationMocked(stationcode, pspcode);
/* 
  TODO: fix when real service rollout
  {
  /* istanbul ignore if */
/*
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return dissociateECfromStationMocked(stationcode, pspcode);
  } else {
    return PortalApi.dissociateECfromStation(stationcode, pspcode).then((resources) => resources);
  } 
}; */

export const associateEcToStation = (
  code: string,
  station: CreditorInstitutionStationDto
): Promise<CreditorInstitutionStationEditResource> =>
  PortalApi.associateEcToStation(code, station).then((resource) => resource);

export const getStationAvailableEC = (): Promise<Array<any>> =>
  /* istanbul ignore if */
  /* if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    TODO: fix when real service rollout
    return getChannelAvailablePSPMocked(page);
  } else {
    return PortalApi.getChannelAvailablePSP(page).then((resources) => resources);
  } */
  getStationAvailableECMocked();
