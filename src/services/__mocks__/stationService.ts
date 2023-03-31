import { StationCodeResource } from '../../api/generated/portal/StationCodeResource';
import { StationDetailResource } from '../../api/generated/portal/StationDetailResource';
import {
  RedirectProtocolEnum,
  StationDetailsDto,
} from '../../api/generated/portal/StationDetailsDto';
import { StationStatusEnum } from '../../api/generated/portal/StationResource';
import { StationsResource } from '../../api/generated/portal/StationsResource';

const mockedStation: StationDetailResource = {
  stationCode: '97735020584_01',
  stationStatus: StationStatusEnum.ACTIVE,
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

export const mockedStations: StationsResource = {
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
      stationStatus: 'ACTIVE' as StationStatusEnum,
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
      stationStatus: 'ON_REVISION' as StationStatusEnum,
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
      stationStatus: 'TO_BE_CORRECTED' as StationStatusEnum,
      brokerDescription: 'test3',
      version: 3,
      associatedCreditorInstitutions: 3,
      enabled: true,
    },
  ],
};

const mockedStationsDetail: Array<StationDetailResource> = [
  {
    enabled: true,
    stationStatus: StationStatusEnum.ACTIVE,
    stationCode: '97735020584_01',
    version: 1,
    primitiveVersion: 1,
    password: 'PASSWORD',
    redirectPath: 'esempiolink1.it',
    activationDate: new Date('2023-02-23'),
    targetPath: '/govpay/api/pagopa/PagamentiTelematiciCCPservice1',
    service: 'lab.link1.it',
    port: 80,
    associatedCreditorInstitutions: 0,
    modifiedAt: new Date('2023-02-19'),
    operatedBy: 'Nome Cognome/Matricola operatore',
  },
  {
    enabled: true,
    stationStatus: StationStatusEnum.ON_REVISION,
    stationCode: '97735020584_02',
    version: 2,
    primitiveVersion: 1,
    password: 'PASSWORD',
    redirectPath: 'esempiolink2.it',
    activationDate: new Date('2023-02-24'),
    targetPath: '/govpay/api/pagopa/PagamentiTelematiciCCPservice2',
    service: 'lab.link2.it',
    port: 80,
    associatedCreditorInstitutions: 0,
    modifiedAt: new Date('2023-02-20'),
    operatedBy: 'Nome Cognome/Matricola operatore',
  },
  {
    enabled: true,
    stationStatus: StationStatusEnum.TO_BE_CORRECTED,
    stationCode: '97735020584_03',
    version: 1,
    primitiveVersion: 1,
    password: 'XXXXXXXXXXXXXX',
    redirectPath: 'esempiolink3.it',
    activationDate: new Date('2023-02-25'),
    targetPath: '/govpay/api/pagopa/PagamentiTelematiciCCPservice2',
    service: 'lab.link3.it',
    port: 80,
    associatedCreditorInstitutions: 0,
    modifiedAt: new Date('2023-03-20'),
    operatedBy: 'Nome Cognome/Matricola operatore',
  },
];

const mockedStationCode = { stationCode: '1122334455_01' };

export const createStationMocked = (_station: StationDetailsDto): Promise<StationDetailResource> =>
  new Promise((resolve) => resolve(mockedStation));

export const getStations = (_page: number): Promise<StationsResource> =>
  new Promise((resolve) => resolve(mockedStations));

export const getStationDetail = (stationCode: any): Promise<StationDetailResource> => {
  const matchedStationByStationID = mockedStationsDetail.find((s) => s.stationCode === stationCode);
  if (matchedStationByStationID) {
    return new Promise((resolve) => resolve(matchedStationByStationID));
  } else {
    return new Promise((resolve) => resolve(mockedStationsDetail[0]));
  }
};

export const getStationCodeMocked = (_code: string): Promise<StationCodeResource> =>
  new Promise((resolve) => resolve(mockedStationCode));
