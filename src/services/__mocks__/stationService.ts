import {AvailableCodes} from '../../api/generated/portal/AvailableCodes';
import {StatusEnum} from '../../api/generated/portal/ChannelDetailsDto';
import {CreditorInstitutionStationDto} from '../../api/generated/portal/CreditorInstitutionStationDto';
import {
    CreditorInstitutionStationEditResource
} from '../../api/generated/portal/CreditorInstitutionStationEditResource';
import {CreditorInstitutionsResource} from '../../api/generated/portal/CreditorInstitutionsResource';
import {StationCodeResource} from '../../api/generated/portal/StationCodeResource';
import {StationDetailResource} from '../../api/generated/portal/StationDetailResource';
import {
    RedirectProtocolEnum,
    StationDetailsDto,
} from '../../api/generated/portal/StationDetailsDto';
import {
    TestResultEnum,
    TestStationResource,
} from '../../api/generated/portal/TestStationResource';
import {TypeEnum, WrapperEntities} from '../../api/generated/portal/WrapperEntities';
import {WrapperStationDetailsDto} from '../../api/generated/portal/WrapperStationDetailsDto';
import {
    WrapperStationResource,
    WrapperStatusEnum,
} from '../../api/generated/portal/WrapperStationResource';
import {WrapperStationsResource} from '../../api/generated/portal/WrapperStationsResource';
import {StationOnCreation} from '../../model/Station';

// @ts-ignore
export const mockedStation: StationDetailResource = {
    stationCode: '97735020584_02',
    brokerCode: '97735020584',
    wrapperStatus: WrapperStatusEnum.APPROVED,
    enabled: true,
    primitiveVersion: 1,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectPort: 3000,
    redirectIp: 'Esempio Ip',
    redirectPath: 'Esempio Pat',
    redirectQueryString: 'Esempio parametri',
    targetHost: 'Esempio indirizzo',
    targetPath: 'Esempio Pat',
    targetPort: 3001,
};

// @ts-ignore
export const mockedWrapperStation: WrapperStationDetailsDto = {
    stationCode: '81001870922_01',
    primitiveVersion: 2,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectPort: 3000,
    redirectIp: 'Esempio Ip',
    redirectPath: 'Esempio Pat',
    redirectQueryString: 'Esempio parametri',
    targetHost: 'Esempio indirizzo',
    targetPath: 'Esempio Pat',
    targetPort: 3001,
};

export const mockedFullStation: StationDetailResource = {
  wrapperStatus: WrapperStatusEnum.TO_CHECK,
  stationCode: '81001870922_04',
  enabled: true,
  brokerDescription: '',
  version: 1,
  password: 'mockPswxxx',
  associatedCreditorInstitutions: 0,
  activationDate: new Date(),
  createdAt: new Date(),
  modifiedAt: new Date(),
  redirectIp: 'ww',
  redirectPath: 'ww',
  redirectPort: 111,
  redirectQueryString: 'www',
  redirectProtocol: RedirectProtocolEnum.HTTPS,
  brokerCode: '81001870922',
  timeoutA: 7,
  timeoutB: 30,
  timeoutC: 120,
  targetHost: '1www',
  targetPort: 11,
  targetPath: 'www',
  primitiveVersion: 1,
};

export const mockedStations: WrapperStationsResource = {
    pageInfo: {
        page: 0,
        limit: 50,
        items_found: 50,
        total_pages: 8,
    },
    stationsList: [
        {
            stationCode: '97735020584_01',
            activationDate: new Date('2023-03-03T12:30:00Z'),
            createdAt: new Date('2023-02-02T12:30:00Z'),
            modifiedAt: new Date('2023-03-04T12:30:00Z'),
            wrapperStatus: WrapperStatusEnum.APPROVED,
            brokerDescription: 'test1',
            version: 1,
            associatedCreditorInstitutions: 1,
            enabled: true,
        },
        {
            stationCode: '97735020584_02',
            activationDate: new Date('2023-03-04T12:31:00Z'),
            createdAt: new Date('2023-02-02T12:30:00Z'),
            modifiedAt: new Date('2023-03-03T12:34:00Z'),
            wrapperStatus: WrapperStatusEnum.TO_CHECK,
            brokerDescription: 'test2',
            version: 2,
            associatedCreditorInstitutions: 2,
            enabled: false,
        },
        {
            stationCode: '97735020584_03',
            activationDate: new Date('2023-03-05T12:32:00Z'),
            createdAt: new Date('2023-01-03T12:30:00Z'),
            modifiedAt: new Date('2023-01-06T12:55:00Z'),
            wrapperStatus: WrapperStatusEnum.TO_FIX,
            brokerDescription: 'test3',
            version: 3,
            associatedCreditorInstitutions: 3,
            enabled: true,
        },
    ],
};

export const mockedStationsMerged: WrapperStationsResource = {
    pageInfo: {
        page: 0,
        limit: 10,
        items_found: 14,
        total_pages: 2,
    },
    stationsList: [
        {
            stationCode: '97735020584_01',
            activationDate: new Date('2023-03-03T12:30:00Z'),
            createdAt: new Date('2023-02-02T12:30:00Z'),
            modifiedAt: new Date('2023-03-04T12:30:00Z'),
            brokerDescription: 'test1',
            version: 1,
            associatedCreditorInstitutions: 1,
            enabled: true,
            wrapperStatus: WrapperStatusEnum.APPROVED,
        },
        {
            stationCode: '97735020584_02',
            activationDate: new Date('2023-03-04T12:31:00Z'),
            createdAt: new Date('2023-02-02T12:30:00Z'),
            modifiedAt: new Date('2023-03-03T12:34:00Z'),
            brokerDescription: 'test2',
            version: 2,
            associatedCreditorInstitutions: 2,
            enabled: false,
            wrapperStatus: WrapperStatusEnum.TO_CHECK,
        },
        {
            stationCode: '97735020584_03',
            activationDate: new Date('2023-03-05T12:32:00Z'),
            createdAt: new Date('2023-01-03T12:30:00Z'),
            modifiedAt: new Date('2023-01-06T12:55:00Z'),
            brokerDescription: 'test3',
            version: 3,
            associatedCreditorInstitutions: 3,
            enabled: true,
            wrapperStatus: WrapperStatusEnum.TO_CHECK_UPDATE,
        },
        {
            stationCode: '97735020584_04',
            activationDate: new Date('2023-03-05T12:32:00Z'),
            createdAt: new Date('2023-01-03T12:30:00Z'),
            modifiedAt: new Date('2023-01-06T12:55:00Z'),
            brokerDescription: 'test3',
            version: 3,
            associatedCreditorInstitutions: 3,
            enabled: true,
            wrapperStatus: WrapperStatusEnum.TO_FIX,
        },
        {
            stationCode: '97735020584_05',
            activationDate: new Date('2023-03-05T12:32:00Z'),
            createdAt: new Date('2023-01-03T12:30:00Z'),
            modifiedAt: new Date('2023-01-06T12:55:00Z'),
            brokerDescription: 'test3',
            version: 3,
            associatedCreditorInstitutions: 3,
            enabled: true,
            wrapperStatus: WrapperStatusEnum.TO_FIX,
        },
        {
            stationCode: '97735020584_06',
            activationDate: new Date('2023-03-05T12:32:00Z'),
            createdAt: new Date('2023-01-03T12:30:00Z'),
            modifiedAt: new Date('2023-01-06T12:55:00Z'),
            brokerDescription: 'test3',
            version: 3,
            associatedCreditorInstitutions: 3,
            enabled: true,
            wrapperStatus: WrapperStatusEnum.TO_FIX,
        },
        {
            stationCode: '97735020584_07',
            activationDate: new Date('2023-03-05T12:32:00Z'),
            createdAt: new Date('2023-01-03T12:30:00Z'),
            modifiedAt: new Date('2023-01-06T12:55:00Z'),
            brokerDescription: 'test3',
            version: 3,
            associatedCreditorInstitutions: 3,
            enabled: true,
            wrapperStatus: WrapperStatusEnum.TO_FIX,
        },
        {
            stationCode: '97735020584_08',
            activationDate: new Date('2023-03-05T12:32:00Z'),
            createdAt: new Date('2023-01-03T12:30:00Z'),
            modifiedAt: new Date('2023-01-06T12:55:00Z'),
            brokerDescription: 'test3',
            version: 3,
            associatedCreditorInstitutions: 3,
            enabled: true,
            wrapperStatus: WrapperStatusEnum.TO_FIX,
        },
        {
            stationCode: '97735020584_09',
            activationDate: new Date('2023-03-05T12:32:00Z'),
            createdAt: new Date('2023-01-03T12:30:00Z'),
            modifiedAt: new Date('2023-01-06T12:55:00Z'),
            brokerDescription: 'test3',
            version: 3,
            associatedCreditorInstitutions: 3,
            enabled: true,
            wrapperStatus: WrapperStatusEnum.TO_FIX,
        },
        {
            stationCode: '97735020584_10',
            activationDate: new Date('2023-03-05T12:32:00Z'),
            createdAt: new Date('2023-01-03T12:30:00Z'),
            modifiedAt: new Date('2023-01-06T12:55:00Z'),
            brokerDescription: 'test3',
            version: 3,
            associatedCreditorInstitutions: 3,
            enabled: true,
            wrapperStatus: WrapperStatusEnum.TO_FIX,
        },
    ],
};

const stationList: Array<WrapperStationResource> = [
    {
        stationCode: '81001870922_01',
        enabled: true,
        brokerDescription: 'Comune di Portoscuso',
        version: 2,
        associatedCreditorInstitutions: 0,
        activationDate: new Date(),
        createdAt: new Date(),
        modifiedAt: new Date(),
        wrapperStatus: WrapperStatusEnum.APPROVED,
    },
    {
        stationCode: '81001870922_02',
        enabled: true,
        brokerDescription: 'Comune di Portoscuso',
        version: 2,
        associatedCreditorInstitutions: 0,
        activationDate: new Date(),
        createdAt: new Date(),
        modifiedAt: new Date(),
        wrapperStatus: WrapperStatusEnum.APPROVED,
    },
    {
        stationCode: '81001870922_03',
        enabled: true,
        brokerDescription: 'Comune di Portoscuso',
        version: 2,
        associatedCreditorInstitutions: 0,
        activationDate: new Date(),
        createdAt: new Date(),
        modifiedAt: new Date(),
        wrapperStatus: WrapperStatusEnum.APPROVED,
    },
    {
        stationCode: '81001870922_04',
        enabled: true,
        brokerDescription: 'Comune di Portoscuso',
        version: 1,
        associatedCreditorInstitutions: 0,
        activationDate: new Date(),
        createdAt: new Date(),
        wrapperStatus: WrapperStatusEnum.TO_CHECK,
    },
];
export const mockedStationsMerged2: WrapperStationsResource = {
    pageInfo: {page: 0, limit: 10, items_found: 4, total_pages: 1, total_items: stationList.length},
    stationsList: stationList,
};

export const mockedStationECs: CreditorInstitutionsResource = {
    creditor_institutions: [
        {
            ciTaxCode: '12345678901',
            enabled: true,
            businessName: 'EC1 S.p.A',
            auxDigit: '3',
            broadcast: true,
            applicationCode: 'Value',
            segregationCode: '02',
        },
        {
            ciTaxCode: '12345678902',
            enabled: true,
            businessName: 'EC2 S.p.A',
            auxDigit: '3',
            broadcast: true,
            applicationCode: 'Value',
            segregationCode: '03',
        },
        {
            ciTaxCode: '12345678903',
            enabled: false,
            businessName: 'EC3 S.p.A',
            auxDigit: '3',
            broadcast: true,
            applicationCode: 'Value',
            segregationCode: '04',
        },
        {
            ciTaxCode: '12345678904',
            enabled: true,
            businessName: 'EC4 S.p.A',
            auxDigit: '3',
            broadcast: true,
            applicationCode: 'Value',
            segregationCode: '05',
        },
        {
            ciTaxCode: '12345678905',
            enabled: true,
            businessName: 'EC5 S.p.A',
            auxDigit: '3',
            broadcast: true,
            applicationCode: 'Value',
            segregationCode: '06',
        },
        {
            ciTaxCode: '12345678906',
            enabled: true,
            businessName: 'EC6 S.p.A',
            auxDigit: '3',
            broadcast: true,
            applicationCode: 'Value',
            segregationCode: '07',
        },
        {
            ciTaxCode: '12345678907',
            enabled: true,
            businessName: 'EC7 S.p.A',
            auxDigit: '3',
            broadcast: true,
            applicationCode: 'Value',
            segregationCode: '08',
        },
        {
            ciTaxCode: '12345678908',
            enabled: true,
            businessName: 'EC8 S.p.A',
            auxDigit: '3',
            broadcast: true,
            applicationCode: 'Value',
            segregationCode: '09',
        },
        {
            ciTaxCode: '12345678909',
            enabled: true,
            businessName: 'EC9 S.p.A',
            auxDigit: '3',
            broadcast: true,
            applicationCode: 'Value',
            segregationCode: '10',
        },
        {
            ciTaxCode: '12345678910',
            enabled: true,
            businessName: 'EC10 S.p.A',
            auxDigit: '3',
            broadcast: true,
            applicationCode: 'Value',
            segregationCode: '11',
        },
    ],
    page_info: {page: 0, limit: 10, items_found: 11, total_pages: 2},
};

export const mockedStationECsPage2: CreditorInstitutionsResource = {
    creditor_institutions: [
        {
            ciTaxCode: '12345678911',
            enabled: true,
            businessName: 'EC11 S.p.A',
            broadcast: false,
        },
    ],
    page_info: {page: 1, limit: 10, items_found: 11, total_pages: 2},
};
export const stationWrapperMockedGet = (code: string): WrapperEntities => ({
    brokerCode: 'string',
    createdAt: new Date('2024-03-12'),
    createdBy: 'EC S.p.A',
    id: 'string',
    modifiedAt: new Date('2024-03-12'),
    modifiedBy: 'string',
    modifiedByOpt: 'string',
    note: 'string',
    status: StatusEnum.TO_CHECK,
    type: TypeEnum.STATION,
    entities: [
        {
            createdAt: new Date('2024-03-12'),
            entity: {
                stationCode: code,
                brokerCode: '97735020584',
                wrapperStatus: WrapperStatusEnum.TO_CHECK,
                enabled: true,
                primitiveVersion: 1,
                redirectProtocol: RedirectProtocolEnum.HTTPS,
                redirectPort: 3000,
                redirectIp: 'Esempio Ip',
                redirectPath: 'Esempio Pat',
                redirectQueryString: 'Esempio parametri',
                targetHost: 'Esempio indirizzo',
                targetPath: 'Esempio Pat',
                targetPort: 3001,
            },
            id: 'string',
            modifiedAt: new Date('2024-03-12'),
            modifiedBy: 'string',
            modifiedByOpt: 'Operatore EC',
            note: 'string',
            status: StatusEnum.TO_CHECK,
            type: TypeEnum.STATION,
        },
    ],
});

export const mockedStationCode = {stationCode: '1122334455_01'};

export const mockedStationAvailableEC: Array<any> = [
    {
        broker_psp_code: '0000001',
        description: 'Intesa San Paolo S.P.A',
        enabled: true,
        extended_fault_bean: true,
    },
    {
        broker_psp_code: '0000002',
        description: 'Sogei',
        enabled: true,
        extended_fault_bean: true,
    },
    {
        broker_psp_code: '0000003',
        description: 'BNP',
        enabled: true,
        extended_fault_bean: true,
    },
    {
        broker_psp_code: '0000004',
        description: 'Banca Nazionale',
        enabled: true,
        extended_fault_bean: true,
    },
    {
        broker_psp_code: '0000005',
        description: 'Banca Regionale',
        enabled: true,
        extended_fault_bean: true,
    },
    {
        broker_psp_code: '0000006',
        description: 'Banca Estera',
        enabled: true,
        extended_fault_bean: true,
    },
    {
        broker_ec_code: '81001870922',
        description: 'Comune di Portoscuso',
        enabled: true,
        extended_fault_bean: true,
    },
    {
        broker_ec_code: '00142300599',
        description: 'Comune di Gaeta',
        enabled: true,
        extended_fault_bean: true,
    },
];

const createFormattedArray = (): string[] => {
    const segregationCodeArray: string[] = [];
    for (let i = 0; i <= 48; i++) {
        const n = (i < 10 ? '0' : '') + i;
        segregationCodeArray.push((i + 1).toString());
    }
    return segregationCodeArray;
};

export const mockedSegregationCodeList: AvailableCodes = {
    availableCodes: createFormattedArray(),
};

export const stationTestErrorMocked: TestStationResource = {
    message: 'ERROR',
    testResult: TestResultEnum.ERROR,
};

export const stationTestMocked: TestStationResource = {
    message: 'OK',
    testResult: TestResultEnum.SUCCESS,
};

export const mockedCreatedStation: StationOnCreation = {
    brokerCode: '',
    proxyConcat: '',
    stationCode: '',
    gdpConcat: '',
    newConnConcat: '',
    redirectConcat: '',
    redirectIp: '',
    redirectPath: '',
    redirectProtocol: RedirectProtocolEnum.HTTP,
    redirectQueryString: '',
    targetConcat: '',
    targetHost: '',
    targetPath: '',
    targetPofConcat: '',
    primitiveVersion: 0
};

export const mockedCreditorInstitutionStationDTO: CreditorInstitutionStationDto = {
    auxDigit: 0,
    broadcast: false,
    segregationCode: '',
    stationCode: ''
};

export const mockedStationDetailsDTO: StationDetailsDto = {
    brokerCode: '',
    primitiveVersion: 2,
    redirectIp: '',
    redirectPath: '',
    redirectPort: 0,
    redirectProtocol: RedirectProtocolEnum.HTTP,
    redirectQueryString: '',
    stationCode: '',
    validationUrl: '',
    version: 0
};

export const createStationMocked = (_station: StationOnCreation): Promise<StationDetailResource> =>
    new Promise((resolve) => resolve(mockedStation));

export const getStations = (_page: number): Promise<WrapperStationsResource> =>
    new Promise((resolve) => resolve(mockedStations));

export const getStationsMerged = (
    _page: number,
    _brokerCode: string,
    _stationcode?: string,
    _limit?: number,
    _sorting?: string
): Promise<WrapperStationsResource> => new Promise((resolve) => resolve(mockedStationsMerged2));

export const getStationDetail = (_stationCode: any): Promise<StationDetailResource> =>
    new Promise((resolve) => resolve(mockedFullStation));

export const getStationCodeMocked = (_code: string): Promise<StationCodeResource> =>
    new Promise((resolve) => resolve(mockedStationCode));

export const getStationCodeV2Mocked = (_code: string): Promise<StationCodeResource> =>
    new Promise((resolve) => resolve(mockedStationCode));

export const createWrapperStation = (
    _station: WrapperStationDetailsDto
): Promise<WrapperStationDetailsDto> => new Promise((resolve) => resolve(mockedWrapperStation));

export const getECListByStationCode = (
    _stationcode: string,
    page: number,
    _limit?: number
): Promise<CreditorInstitutionsResource> =>
    new Promise((resolve) => resolve(page === 0 ? mockedStationECs : mockedStationECsPage2));

export const updateWrapperStation = (_stations: StationDetailsDto): Promise<WrapperEntities> =>
    new Promise((resolve) => resolve(mockedWrapperStation));

export const updateWrapperStationByOpt = (
): Promise<StationDetailResource> => new Promise((resolve) => resolve(mockedFullStation));

export const updateStation = (
    _stations: StationDetailsDto,
    _statonCode: string
): Promise<StationDetailResource> => new Promise((resolve) => resolve(mockedFullStation));

export const dissociateECfromStation = (_stationcode: string, _eccode: string): Promise<void> =>
    new Promise((resolve) => resolve());

export const getStationAvailableEC = (): Promise<Array<any>> =>
    new Promise((resolve) => resolve(mockedStationAvailableEC));

export const associateEcToStation = (
    _code: string,
    _station: CreditorInstitutionStationDto
): Promise<CreditorInstitutionStationEditResource> =>
    new Promise((resolve) => resolve({stationCode: '123'}));

export const getWrapperStation = (ecCode: string): Promise<WrapperEntities> =>
    new Promise((resolve) => resolve(stationWrapperMockedGet(ecCode)));

export const getCreditorInstitutionSegregationcodes = (_ecCode: string, _targetCITaxCode: string): Promise<AvailableCodes> =>
    new Promise((resolve) => resolve(mockedSegregationCodeList));

export const testStation = (
    hostUrl: string,
    hostPort: number,
    hostPath: string
): Promise<TestStationResource> =>
    new Promise((resolve) =>
        resolve(hostPath === '/error' ? stationTestErrorMocked : stationTestMocked)
    );
