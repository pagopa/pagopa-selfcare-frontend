import {BackofficeApi} from '../api/BackofficeClient';
import {AvailableCodes} from '../api/generated/portal/AvailableCodes';
import {CreditorInstitutionStationDto} from '../api/generated/portal/CreditorInstitutionStationDto';
import {CreditorInstitutionStationEditResource} from '../api/generated/portal/CreditorInstitutionStationEditResource';
import {CreditorInstitutionsResource} from '../api/generated/portal/CreditorInstitutionsResource';
import {Delegation} from '../api/generated/portal/Delegation';
import {ProblemJson} from '../api/generated/portal/ProblemJson';
import {StationCodeResource} from '../api/generated/portal/StationCodeResource';
import {StationDetailResource} from '../api/generated/portal/StationDetailResource';
import {StationDetailsDto} from '../api/generated/portal/StationDetailsDto';
import {TestStationTypeEnum} from '../api/generated/portal/StationTestDto';
import {TestStationResource} from '../api/generated/portal/TestStationResource';
import {WrapperEntities} from '../api/generated/portal/WrapperEntities';
import {WrapperStationDetailsDto} from '../api/generated/portal/WrapperStationDetailsDto';
import {WrapperStationsResource} from '../api/generated/portal/WrapperStationsResource';
import {ConfigurationStatus, StationOnCreation} from '../model/Station';
import {
    associateEcToStation as associateEcToStationMocked,
    createStationMocked,
    createWrapperStation as createStationWrap,
    dissociateECfromStation as dissociateECfromStationMocked,
    getCreditorInstitutionSegregationcodes as getCreditorInstitutionSegregationcodesMocked,
    getECListByStationCode as getECListByStationCodeMocked,
    getStationAvailableEC as getStationAvailableECMocked,
    getStationCodeMocked,
    getStationCodeV2Mocked,
    getStationDetail as getStationDetailMock,
    getStations as getStationsMocked,
    getStationsMerged as getStationsMergedMocked,
    getWrapperStation as getStationWrap,
    testStation as testStationMocked,
    updateStation as UpdateStationMocked,
    updateWrapperStation as updateStationWrap,
    updateWrapperStationByOpt as updateStationWrapByOpt,
} from '../services/__mocks__/stationService';

export const createStation = (station: StationOnCreation): Promise<StationDetailResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return createStationMocked(station);
    }
    return BackofficeApi.createStation(station).then((resources) => resources);
};

export const getStations = ({
                                page,
                                brokerCode,
                                status,
                                stationCode,
                                limit,
                            }: {
    page: number;
    brokerCode: string;
    status: ConfigurationStatus;
    stationCode?: string;
    limit?: number;
}): Promise<WrapperStationsResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getStationsMocked(0);
    }
    return BackofficeApi.getStations({
        page,
        brokerCode,
        status,
        stationCode,
        limit,
    }).then((resource) => resource);
};

export const getStationsMerged = (
    page: number,
    brokerCode: string,
    stationcode?: string,
    limit?: number,
    sorting?: string
): Promise<WrapperStationsResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getStationsMergedMocked(page, brokerCode, stationcode, limit, sorting);
    }
    return BackofficeApi.getStationsMerged(page, brokerCode, stationcode, limit, sorting).then(
        (resource) => resource
    );
};

export const getStation = (stationId: string): Promise<StationDetailResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getStationDetail(stationId);
    }
    return BackofficeApi.getStation(stationId).then((resource) => resource);
};

export const getStationCode = (code: string): Promise<StationCodeResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getStationCodeMocked(code);
    }
    return BackofficeApi.getStationCode(code).then((resource) => resource);
};

export const getStationCodeV2 = (code: string): Promise<StationCodeResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getStationCodeV2Mocked(code);
    }
    return BackofficeApi.getStationCodeV2(code).then((resource) => resource);
};

export const getECListByStationCode = (
    stationcode: string,
    ciName: string | undefined,
    page: number,
    limit?: number
): Promise<CreditorInstitutionsResource> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getECListByStationCodeMocked(stationcode, page, limit);
    } else {
        return BackofficeApi.getECListByStationCode(stationcode, ciName, page, limit).then(
            (resources) => resources
        );
    }
};

export const dissociateECfromStation = (ecCode: string, stationCode: string): Promise<void> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return dissociateECfromStationMocked(ecCode, stationCode);
    } else {
        return BackofficeApi.dissociateECfromStation(ecCode, stationCode).then(
            (resources) => resources
        );
    }
};

export const associateEcToStation = (
    code: string,
    station: CreditorInstitutionStationDto
): Promise<CreditorInstitutionStationEditResource | ProblemJson> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return associateEcToStationMocked(code, station);
    }
    return BackofficeApi.associateEcToStation(code, station).then((resource) => resource);
};

export const getStationAvailableEC = (
    institutionId?: string,
    brokerId?: string
): Promise<Delegation> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getStationAvailableECMocked();
    } else {
        return BackofficeApi.getStationAvailableEc(institutionId!).then((resource) => resource);
    }
};

export const createWrapperStation = (
    station: WrapperStationDetailsDto
): Promise<WrapperEntities> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return createStationWrap(station);
    }
    return BackofficeApi.createWrapperStation(station).then((resources) => resources);
};

export const getWrapperStation = (ecCode: string): Promise<WrapperEntities> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getStationWrap(ecCode);
    } else {
        return BackofficeApi.getWrapperEntitiesStation(ecCode).then((resources) => resources);
    }
};

export const updateWrapperStationToCheck = (
    station: StationDetailsDto
): Promise<WrapperEntities> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return updateStationWrap(station);
    } else {
        return BackofficeApi.updateWrapperStationToCheck(station.stationCode, station).then(
            (resources) => resources
        );
    }
};

export const updateWrapperStationToCheckUpdate = (
    station: StationDetailsDto
): Promise<WrapperEntities> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return updateStationWrap(station);
    } else {
        return BackofficeApi.updateWrapperStationToCheckUpdate(station.stationCode, station).then(
            (resources) => resources
        );
    }
};

export const updateWrapperStationWithOperatorReview = ({
                                                           stationCode,
                                                           ciTaxCode,
                                                           note,
                                                       }: {
    stationCode: string;
    ciTaxCode: string;
    note: string;
}): Promise<StationDetailResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return updateStationWrapByOpt();
    } else {
        return BackofficeApi.updateWrapperStationWithOperatorReview({
            stationCode,
            ciTaxCode,
            note,
        }).then((resources) => resources);
    }
};

export const updateStation = (
    station: StationDetailsDto,
    stationCode: string
): Promise<StationDetailResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return UpdateStationMocked(station, stationCode);
    } else {
        return BackofficeApi.updateStation(station, stationCode).then((resources) => resources);
    }
};

export const getStationDetail = (stationId: string): Promise<StationDetailResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getStationDetailMock(stationId);
    } else {
        return BackofficeApi.getStationDetail(stationId).then((resource) => resource);
    }
};

export const getCreditorInstitutionSegregationCodes = (ecCode: string, targetCITaxCode: string): Promise<AvailableCodes> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getCreditorInstitutionSegregationcodesMocked(ecCode, targetCITaxCode);
    } else {
        return BackofficeApi.getCreditorInstitutionSegregationCodes(ecCode, targetCITaxCode).then(
            (resource) => resource
        );
    }
};

export const testStation = (
    hostProtocol: string,
    hostUrl: string,
    hostPort: number,
    hostPath: string,
    testStationType: TestStationTypeEnum
): Promise<TestStationResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return testStationMocked(hostUrl, hostPort, hostPath);
    } else {
        return BackofficeApi.testStation(
            hostProtocol,
            hostUrl,
            hostPort,
            hostPath,
            testStationType
        ).then((resource) => resource);
    }
};
