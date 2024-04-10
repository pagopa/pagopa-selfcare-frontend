import { GridColDef } from '@mui/x-data-grid';
import { cleanup } from '@testing-library/react';
import { buildColumnDefs } from '../DelegationStationsTableColumns';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const setDrawerValueSpy = jest.fn();
const mockTFunction = (key: string) => {
  switch (key) {
    case 'delegationDetailPage.column.stationCode':
      return 'Station Code';
    case 'delegationDetailPage.column.auxDigit':
      return 'AuxDigit';
    case 'delegationDetailPage.column.segregationCode':
      return 'Segregation code';
    case 'delegationDetailPage.column.applicationCode':
      return 'Application code';
    default:
      return '';
  }
};

describe('<DelegationsTableColumns /> for PSPs', () => {
  test('Test of all the functions inside the component', () => {
    const ArrayBuildColumnDefs = [
      {
        field: 'stationCode',
        cellClassName: 'justifyContentBold',
        headerName: mockTFunction('delegationDetailPage.column.stationCode'),
        align: 'left',
        headerAlign: 'left',
        minWidth: 400,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: true,
        flex: 4,
      },
      {
        field: 'auxDigit',
        cellClassName: 'justifyContentNormal',
        headerName: mockTFunction('delegationDetailPage.column.auxDigit'),
        align: 'left',
        headerAlign: 'left',
        maxWidth: 250,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: true,
        flex: 4,
      },
      {
        field: 'segregationCode',
        cellClassName: 'justifyContentNormal',
        headerName: mockTFunction('delegationDetailPage.column.segregationCode'),
        align: 'left',
        headerAlign: 'left',
        width: 150,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: true,
        flex: 4,
      },
      {
        field: 'applicationCode',
        cellClassName: 'justifyContentNormal',
        headerName: mockTFunction('delegationDetailPage.column.applicationCode'),
        align: 'left',
        headerAlign: 'left',
        width: 100,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'actions',
        cellClassName: 'justifyContentNormalRight',
        headerName: '',
        align: 'center',
        disableColumnMenu: true,
        editable: false,
        flex: 1,
        getActions: expect.any(Function),
        hideSortIcons: true,
        sortable: false,
        type: 'actions',
      },
    ] as Array<GridColDef>;

    const realColumns = buildColumnDefs(mockTFunction, setDrawerValueSpy) as Array<any>;
    expect(realColumns).toEqual(ArrayBuildColumnDefs);
  });
});
