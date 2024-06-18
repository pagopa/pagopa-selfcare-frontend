import { GridColDef } from '@mui/x-data-grid';
import { cleanup } from '@testing-library/react';
import { buildColumnDefs } from '../StationECTableColumns';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const mockTFunction = (key: string) => {
  switch (key) {
    case 'stationECList.stationsTableColumns.headerFields.name':
      return 'Nome EC';
    case 'stationECList.stationsTableColumns.headerFields.fiscalCode':
      return 'Codice Fiscale';
    case 'stationECList.stationsTableColumns.headerFields.auxdigit':
      return 'Auxdigit';
    case 'stationECList.stationsTableColumns.headerFields.segregationCode':
      return 'Segregation code';
    case 'stationECList.stationsTableColumns.headerFields.appCode':
      return 'Application code';
    case 'stationECList.stationsTableColumns.headerFields.broadcast':
      return 'Broadcast';
    default:
      return '';
  }
};

describe('<StationECTableColumns />', () => {
  test('Test of all the functions inside StationsTableColumns', () => {
    const ArrayBuildColumnDefs = [
      {
        field: 'businessName',
        cellClassName: 'justifyContentBold',
        headerName: 'Nome EC',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'fiscalCode',
        cellClassName: 'justifyContentBold',
        headerName: 'Codice Fiscale',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'auxDigit',
        cellClassName: 'justifyContentNormal',
        headerName: 'Auxdigit',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 3,
      },
      {
        field: 'segregationCode',
        cellClassName: 'justifyContentNormal',
        headerName: 'Segregation code',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 3,
      },
      {
        field: 'applicationCode',
        cellClassName: 'justifyContentNormal',
        headerName: 'Application code',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 3,
      },
      {
        field: 'broadcast',
        cellClassName: 'justifyContentNormal',
        headerName: 'Broadcast',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 2,
      },
      {
        field: 'actions',
        cellClassName: 'justifyContentNormalRight',
        headerName: '',
        align: 'right',
        disableColumnMenu: true,
        editable: false,
        flex: 1,
        renderCell: expect.any(Function),
        hideSortIcons: true,
        sortable: false,
      },
    ] as Array<GridColDef>;

    expect(buildColumnDefs(mockTFunction, () => jest.fn())).toEqual(ArrayBuildColumnDefs);
  });
});
