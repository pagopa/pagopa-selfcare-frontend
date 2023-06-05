import { CreditorInstitutionStationDto } from '../../api/generated/portal/CreditorInstitutionStationDto';
import { CreditorInstitutionStationEditResource } from '../../api/generated/portal/CreditorInstitutionStationEditResource';
import { CreditorInstitutionsResource } from '../../api/generated/portal/CreditorInstitutionsResource';
import { StationCodeResource } from '../../api/generated/portal/StationCodeResource';
import { StationDetailResource } from '../../api/generated/portal/StationDetailResource';
import {
  RedirectProtocolEnum,
  StationDetailsDto,
} from '../../api/generated/portal/StationDetailsDto';
import { StationStatusEnum } from '../../api/generated/portal/StationResource';
import { StationsResource } from '../../api/generated/portal/StationsResource';
import { WrapperStatusEnum } from '../../api/generated/portal/WrapperStationResource';
import { WrapperStationsResource } from '../../api/generated/portal/WrapperStationsResource';

export const mockedStation: StationDetailResource = {
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
      stationStatus: 'ACTIVE' as StationStatusEnum,
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
      stationStatus: 'ON_REVISION' as StationStatusEnum,
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
      stationStatus: 'TO_BE_CORRECTED' as StationStatusEnum,
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
      stationStatus: 'TO_BE_CORRECTED' as StationStatusEnum,
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
      stationStatus: 'TO_BE_CORRECTED' as StationStatusEnum,
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
      stationStatus: 'TO_BE_CORRECTED' as StationStatusEnum,
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
      stationStatus: 'TO_BE_CORRECTED' as StationStatusEnum,
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
      stationStatus: 'TO_BE_CORRECTED' as StationStatusEnum,
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
      stationStatus: 'TO_BE_CORRECTED' as StationStatusEnum,
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
      stationStatus: 'TO_BE_CORRECTED' as StationStatusEnum,
      brokerDescription: 'test3',
      version: 3,
      associatedCreditorInstitutions: 3,
      enabled: true,
      wrapperStatus: WrapperStatusEnum.TO_FIX,
    },
  ],
};

export const mockedStationsMerged2: WrapperStationsResource = {
  pageInfo: { page: 0, limit: 10, items_found: 14, total_pages: 2 },
  stationsList: [
    {
      stationCode: 'serenissima',
      version: 2,
      stationStatus: 'ACTIVE' as StationStatusEnum,
      associatedCreditorInstitutions: 0,
      activationDate: new Date('2023-04-27T14:16:11.145Z'),
      createdAt: new Date('2023-04-27T14:16:11.272Z'),
      wrapperStatus: WrapperStatusEnum.APPROVED,
      enabled: true,
    },
    {
      stationCode: '555555555_01',
      stationStatus: 'ACTIVE' as StationStatusEnum,
      associatedCreditorInstitutions: 0,
      activationDate: new Date('2023-05-11T10:52:39.336Z'),
      createdAt: new Date('2023-05-11T10:52:39.336Z'),
      wrapperStatus: WrapperStatusEnum.APPROVED,
      enabled: true,
    },
    {
      stationCode: '55555555555_09',
      stationStatus: 'ACTIVE' as StationStatusEnum,
      associatedCreditorInstitutions: 0,
      activationDate: new Date('2023-05-11T11:10:50.245Z'),
      createdAt: new Date('2023-05-11T11:10:50.245Z'),
      wrapperStatus: WrapperStatusEnum.APPROVED,
      enabled: true,
    },
    {
      stationCode: '81001870922_03',
      stationStatus: 'ACTIVE' as StationStatusEnum,
      associatedCreditorInstitutions: 0,
      activationDate: new Date('2023-05-25T14:55:08.250Z'),
      createdAt: new Date('2023-05-25T14:55:08.415Z'),
      wrapperStatus: WrapperStatusEnum.APPROVED,
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
    // operatedBy: 'Nome Cognome/Matricola operatore',
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
    // operatedBy: 'Nome Cognome/Matricola operatore',
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
    // operatedBy: 'Nome Cognome/Matricola operatore',
  },
];

export const mockedStationECs: CreditorInstitutionsResource = {
  creditor_institutions: [
    { creditorInstitutionCode: '12345678901', enabled: true, businessName: 'EC1 S.p.A' },
    { creditorInstitutionCode: '12345678902', enabled: true, businessName: 'EC2 S.p.A' },
    { creditorInstitutionCode: '12345678903', enabled: false, businessName: 'EC3 S.p.A' },
    { creditorInstitutionCode: '12345678904', enabled: true, businessName: 'EC4 S.p.A' },
    { creditorInstitutionCode: '12345678905', enabled: true, businessName: 'EC5 S.p.A' },
    { creditorInstitutionCode: '12345678906', enabled: true, businessName: 'EC6 S.p.A' },
    { creditorInstitutionCode: '12345678907', enabled: true, businessName: 'EC7 S.p.A' },
    { creditorInstitutionCode: '12345678908', enabled: true, businessName: 'EC8 S.p.A' },
    { creditorInstitutionCode: '12345678909', enabled: true, businessName: 'EC9 S.p.A' },
    { creditorInstitutionCode: '12345678910', enabled: true, businessName: 'EC10 S.p.A' },
  ],
  page_info: { page: 0, limit: 10, items_found: 11, total_pages: 2 },
};

export const mockedStationECsPage2: CreditorInstitutionsResource = {
  creditor_institutions: [
    { creditorInstitutionCode: '12345678911', enabled: true, businessName: 'EC11 S.p.A' },
  ],
  page_info: { page: 1, limit: 10, items_found: 11, total_pages: 2 },
};

const mockedStationCode = { stationCode: '1122334455_01' };

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
];

export const createStationMocked = (_station: StationDetailsDto): Promise<StationDetailResource> =>
  new Promise((resolve) => resolve(mockedStation));

export const getStations = (_page: number): Promise<StationsResource> =>
  new Promise((resolve) => resolve(mockedStations));

export const getStationsMerged = (page: number): Promise<WrapperStationsResource> =>
  new Promise((resolve) => resolve(page === 0 ? mockedStationsMerged : mockedStationsMerged2));

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

export const getECListByStationCode = (
  _stationcode: string,
  page: number,
  _limit?: number
): Promise<CreditorInstitutionsResource> =>
  new Promise((resolve) => resolve(page === 0 ? mockedStationECs : mockedStationECsPage2));

export const dissociateECfromStation = (_stationcode: string, _eccode: string): Promise<void> =>
  new Promise((resolve) => resolve());

export const getStationAvailableEC = (): Promise<Array<any>> =>
  new Promise((resolve) => resolve(mockedStationAvailableEC));

export const associateEcToStation = (
  _code: string,
  _station: CreditorInstitutionStationDto
): Promise<CreditorInstitutionStationEditResource> =>
  new Promise((resolve) => resolve({ stationCode: '123' }));
