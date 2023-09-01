import { PortalApi } from '../api/PortalApiClient';
import { StationsResource } from '../api/generated/portal/StationsResource';
import { WrapperStationsResource } from '../api/generated/portal/WrapperStationsResource';
import {
  createStationMocked,
  getStationCodeMocked,
  getStationDetail as getStationDetailMock,
  getStations as getStationsMocked,
  getStationsMerged as getStationsMergedMocked,
  dissociateECfromStation as dissociateECfromStationMocked,
  getECListByStationCode as getECListByStationCodeMocked,
  getStationAvailableEC as getStationAvailableECMocked,
  associateEcToStation as associateEcToStationMocked,
  createWrapperStation as createStationWrap,
  updateWrapperStation as updateStationWrap,
  updateWrapperStationByOpt as updateStationWrapByOpt,
  getWrapperStation as getStationWrap,
  updateStation as UpdateStationMocked,
  getCreditorInstitutionSegregationcodes as getCreditorInstitutionSegregationcodesMocked,
} from '../services/__mocks__/stationService';
import { StationCodeResource } from '../api/generated/portal/StationCodeResource';
import { CreditorInstitutionStationEditResource } from '../api/generated/portal/CreditorInstitutionStationEditResource';
import { CreditorInstitutionStationDto } from '../api/generated/portal/CreditorInstitutionStationDto';
import { StationDetailResource } from '../api/generated/portal/StationDetailResource';
import { CreditorInstitutionsResource } from '../api/generated/portal/CreditorInstitutionsResource';
import { WrapperStationDetailsDto } from '../api/generated/portal/WrapperStationDetailsDto';
import { WrapperEntitiesOperations } from '../api/generated/portal/WrapperEntitiesOperations';
import { StationOnCreation } from '../model/Station';
import { StationDetailsDto } from '../api/generated/portal/StationDetailsDto';

export const createStation = (station: StationOnCreation): Promise<StationDetailResource> => {
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
    return getStationsMergedMocked(page, brokerCode, stationcode, limit, sorting);
  }
  return PortalApi.getStationsMerged(page, brokerCode, stationcode, limit, sorting).then(
    (resource) => resource
  );
};

export const getStation = (stationId: string): Promise<StationDetailResource> => {
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

export const createWrapperStation = (
  station: WrapperStationDetailsDto,
  validationUrl: string
): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createStationWrap(station, validationUrl);
  }
  return PortalApi.createWrapperStation(station, validationUrl).then((resources) => resources);
};

export const getWrapperStation = (ecCode: string): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationWrap(ecCode);
  } else {
    return PortalApi.getWrapperEntitiesStation(ecCode).then((resources) => resources);
  }
};

export const updateWrapperStationToCheck = (
  station: StationDetailsDto,
  validationUrl: string
): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return updateStationWrap(station, validationUrl);
  } else {
    return PortalApi.updateWrapperStationToCheck(station, validationUrl).then(
      (resources) => resources
    );
  }
};

export const updateWrapperStationToCheckUpdate = (
  station: StationDetailsDto,
  validationUrl: string
): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return updateStationWrap(station, validationUrl);
  } else {
    return PortalApi.updateWrapperStationToCheckUpdate(station, validationUrl).then(
      (resources) => resources
    );
  }
};

export const updateWrapperStationByOpt = (
  station: StationDetailsDto,
  validationUrl: string
): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return updateStationWrapByOpt(station, validationUrl);
  } else {
    return PortalApi.updateWrapperStationByOpt(station, validationUrl).then(
      (resources) => resources
    );
  }
};

export const updateStation = (
  station: StationDetailsDto,
  stationCode: string
): Promise<StationDetailResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return UpdateStationMocked(station, stationCode);
  } else {
    return PortalApi.updateStation(station, stationCode).then((resources) => resources);
  }
};

export const getStationDetail = (stationId: string): Promise<StationDetailResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationDetailMock(stationId);
  } else {
    return PortalApi.getStationDetail(stationId).then((resource) => resource);
  }
};

export const getCreditorInstitutionSegregationcodes = (ecCode: string) => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getCreditorInstitutionSegregationcodesMocked(ecCode);
  } else {
    return PortalApi.getCreditorInstitutionSegregationcodes(ecCode).then((resource) => resource);
  }
};
