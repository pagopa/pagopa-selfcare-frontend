import { StationStatusEnum } from '../../api/generated/portal/StationResource';
import { StationsResource } from '../../api/generated/portal/StationsResource';

const mockedStations: StationsResource = {
  page_info: 'infotest0',
  stationsList: [
    {
      activationDate: new Date('2023-03-03T12:30:00Z'),
      createdAt: new Date('2023-02-02T12:30:00Z'),
      modifiedAt: new Date('2023-03-04T12:30:00Z'),
      stationId: '97735020584_01',
      stationStatus: 'ACTIVE' as StationStatusEnum,
    },
    {
      activationDate: new Date('2023-03-04T12:31:00Z'),
      createdAt: new Date('2023-02-02T12:30:00Z'),
      modifiedAt: new Date('2023-03-03T12:34:00Z'),
      stationId: '97735020584_02',
      stationStatus: 'ON_REVISION' as StationStatusEnum,
    },
    {
      activationDate: new Date('2023-03-05T12:32:00Z'),
      createdAt: new Date('2023-01-03T12:30:00Z'),
      modifiedAt: new Date('2023-01-06T12:55:00Z'),
      stationId: '97735020584_03',
      stationStatus: 'TO_BE_CORRECTED' as StationStatusEnum,
    },
  ],
};

export const getStations = (_page: number): Promise<StationsResource> =>
  new Promise((resolve) => resolve(mockedStations));
