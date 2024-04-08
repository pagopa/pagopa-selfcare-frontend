import { cleanup } from '@testing-library/react';
import { buildColumnDefs } from '../StationECTableColumns';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationECTableColumns />', () => {
  test('Test of all the functions inside StationECTableColumns', () => {
    const mockTFunction = (key: string) => {
      switch (key) {
        case 'stationECList.stationsTableColumns.headerFields.name':
          return 'Station Name';
        case 'stationECList.stationsTableColumns.headerFields.referent':
          return 'Creation Date';
        case 'stationECList.stationsTableColumns.headerFields.contact':
          return 'Cration Date 2';
        case 'stationECList.stationsTableColumns.headerFields.status':
          return 'Status';
        default:
          return '';
      }
    };

    buildColumnDefs(mockTFunction, () => jest.fn());
  });
});
