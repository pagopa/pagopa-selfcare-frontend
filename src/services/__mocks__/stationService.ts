import {
  RedirectProtocolEnum,
  StationDetailsDto,
} from '../../api/generated/portal/StationDetailsDto';
import { StationStatusEnum } from '../../api/generated/portal/StationResource';
import { StationsResource } from '../../api/generated/portal/StationsResource';
import { StationDetail } from '../../model/Station';

export const mockedStation: StationDetailsDto = {
  stationCode: '97735020584_01',
  primitiveVersion: '12345',
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
  pageInfo: 'infotest0',
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

const mockedStationsDetail: Array<StationDetail> = [
  {
    anagraphic: {
      status: 'ACTIVE',
      stationId: '97735020584_01',
      version: 'testversion01',
      primitiveVersion: 'testPrimitiveVersion01',
      password: 'PASSWORD',
      redirectUrl: 'esempiolink1.it',
      activationDate: '23/02/2023',
    },
    target: {
      address: 'lab.link1.it',
      service: '/govpay/api/pagopa/PagamentiTelematiciCCPservice1',
      port: '80',
    },
    associatesEC: {
      associates: '0',
    },
    changes: {
      lastChangesDate: '19/02/2023',
      operatedBy: 'Nome Cognome/Matricola operatore',
    },
  },
  {
    anagraphic: {
      status: 'REVIEW',
      stationId: '97735020584_02',
      version: 'testversion02',
      primitiveVersion: 'testPrimitiveVersion02',
      password: 'PASSWORD',
      redirectUrl: 'esempiolink2.it',
      activationDate: '24/02/2023',
    },
    target: {
      address: 'lab.link2.it',
      service: '/govpay/api/pagopa/PagamentiTelematiciCCPservice2',
      port: '80',
    },
    associatesEC: {
      associates: '0',
    },
    changes: {
      lastChangesDate: '20/02/2023',
      operatedBy: 'Nome Cognome/Matricola operatore',
    },
  },
  {
    anagraphic: {
      status: 'TO_EDIT',
      stationId: '97735020584_03',
      version: 'testversion03',
      primitiveVersion: 'testPrimitiveVersion03',
      password: 'XXXXXXXXXXXXXX',
      redirectUrl: 'esempiolink3.it',
      activationDate: '25/02/2023',
    },
    target: {
      address: 'lab.link3.it',
      service: '/govpay/api/pagopa/PagamentiTelematiciCCPservice2',
      port: '80',
    },
    associatesEC: {
      associates: '0',
    },
    changes: {
      lastChangesDate: '20/03/2023',
      operatedBy: 'Nome Cognome/Matricola operatore',
    },
  },
];

export const createStationMocked = (_station: StationDetailsDto): Promise<StationDetailsDto> =>
  new Promise((resolve) => resolve(mockedStation));

export const getStations = (_page: number): Promise<StationsResource> =>
  new Promise((resolve) => resolve(mockedStations));

export const getStationDetail = (stationId: string): Promise<StationDetail> => {
  const matchedStationByStationID = mockedStationsDetail.find(
    (s) => s.anagraphic.stationId === stationId
  );
  if (matchedStationByStationID) {
    return new Promise((resolve) => resolve(matchedStationByStationID));
  } else {
    return new Promise((resolve) => resolve(mockedStationsDetail[0]));
  }
};
