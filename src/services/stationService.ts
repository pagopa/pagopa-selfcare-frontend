import { BackofficeApi } from '../api/BackofficeClient';
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
import { DelegationResource } from '../api/generated/portal/DelegationResource';

export const createStation = (station: StationOnCreation): Promise<StationDetailResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createStationMocked(station);
  }
  return BackofficeApi.createStation(station).then((resources) => resources);
};

export const getStations = (
  page: number,
  creditorInstitutionCode?: string
): Promise<StationsResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationsMocked(0);
  }
  return BackofficeApi.getStations(page, creditorInstitutionCode).then((resource) => resource);
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
  return BackofficeApi.getStationsMerged(page, brokerCode, stationcode, limit, sorting).then(
    (resource) => resource
  );
};

export const getStation = (stationId: string): Promise<StationDetailResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationDetail(stationId);
  }
  return BackofficeApi.getStation(stationId).then((resource) => resource);
};

export const getStationCode = (code: string): Promise<StationCodeResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationCodeMocked(code);
  }
  return BackofficeApi.getStationCode(code).then((resource) => resource);
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
    return BackofficeApi.getECListByStationCode(stationcode, page, limit).then(
      (resources) => resources
    );
  }
};

export const dissociateECfromStation = (ecCode: string, stationCode: string): Promise<void> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return dissociateECfromStationMocked(ecCode, stationCode);
  } else {
    return BackofficeApi.dissociateECfromStation(ecCode, stationCode).then((resources) => resources);
  }
};

export const associateEcToStation = (
  code: string,
  station: CreditorInstitutionStationDto
): Promise<CreditorInstitutionStationEditResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return associateEcToStationMocked(code, station);
  }
  return BackofficeApi.associateEcToStation(code, station).then((resource) => resource);
};

export const getStationAvailableEC = (
  institutionId?: string,
  brokerId?: string
): Promise<DelegationResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationAvailableECMocked();
  } else {
    return BackofficeApi.getStationAvailableEc(institutionId, brokerId).then((resource) => resource);
  }
};

export const createWrapperStation = (
  station: WrapperStationDetailsDto,
  validationUrl: string
): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createStationWrap(station, validationUrl);
  }
  return BackofficeApi.createWrapperStation(station, validationUrl).then((resources) => resources);
};

export const getWrapperStation = (ecCode: string): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationWrap(ecCode);
  } else {
    return BackofficeApi.getWrapperEntitiesStation(ecCode).then((resources) => resources);
  }
};

export const updateWrapperStationToCheck = (
  station: StationDetailsDto,
  validationUrl: string
): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return updateStationWrap(station, validationUrl);
  } else {
    return BackofficeApi.updateWrapperStationToCheck(station, validationUrl).then(
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
    return BackofficeApi.updateWrapperStationToCheckUpdate(station, validationUrl).then(
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
    return BackofficeApi.updateWrapperStationByOpt(station, validationUrl).then(
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
    return BackofficeApi.updateStation(station, stationCode).then((resources) => resources);
  }
};

export const getStationDetail = (stationId: string): Promise<StationDetailResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getStationDetailMock(stationId);
  } else {
    return BackofficeApi.getStationDetail(stationId).then((resource) => resource);
  }
};

export const getCreditorInstitutionSegregationcodes = (ecCode: string) => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getCreditorInstitutionSegregationcodesMocked(ecCode);
  } else {
    return BackofficeApi.getCreditorInstitutionSegregationcodes(ecCode).then((resource) => resource);
  }
};
