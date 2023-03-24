import { GridColDef, GridRenderCellParams, GridRowId, GridStateColDef } from '@mui/x-data-grid';
import { cleanup } from '@testing-library/react';
import {
  buildColumnDefs,
  renderCell,
  showCustomHeader,
  showStationID,
  showStatus,
} from '../list/StationsTableColumns';
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditChannelPage />', () => {
  it('should return an array of column definitions', () => {
    const rowNode = [
      {
        id: '',
        parent: '',
        depth: 0,
        groupingKey: '',
        groupingField: '',
      },
    ];

    const colDef: GridStateColDef<any, any, any> = {
      computedWidth: 0,
      field: 'stationCode',
      type: '',
      hasBeenResized: undefined,
      groupPath: undefined,
    };

    const params: GridRenderCellParams<any, any, any> = {
      value: 'some value',
      row: {
        stationCode: '123456',
      },
      api: undefined,
      id: '',
      field: '',
      rowNode: rowNode[0],
      colDef: colDef[0],
      cellMode: 'edit',
      hasFocus: false,
      tabIndex: 0,
      getValue: () => jest.fn(),
    };

    const ArrayBuildColumnDefs = [
      {
        field: 'stationCode',
        cellClassName: 'justifyContentBold',
        headerName: 'Station Name',
        align: 'left',
        headerAlign: 'left',
        minWidth: 485,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'createdAt',
        cellClassName: 'justifyContentNormal',
        headerName: 'Creation Date',
        align: 'left',
        headerAlign: 'left',
        maxWidth: 200,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'modifiedAt',
        cellClassName: 'justifyContentNormal',
        headerName: 'Last Edit Date',
        align: 'left',
        headerAlign: 'left',
        maxWidth: 200,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'activationDate',
        cellClassName: 'justifyContentNormal',
        headerName: 'Activation Date',
        align: 'left',
        headerAlign: 'left',
        maxWidth: 220,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'stationStatus',
        cellClassName: 'justifyContentNormal',
        headerName: 'Status',
        align: 'left',
        headerAlign: 'left',
        width: 145,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
    ] as Array<GridColDef>;

    const mockTFunction = (key: string) => {
      switch (key) {
        case 'stationsPage.stationsTableColumns.headerFields.name':
          return 'Station Name';
        case 'stationsPage.stationsTableColumns.headerFields.creationDate':
          return 'Creation Date';
        case 'stationsPage.stationsTableColumns.headerFields.lastEditDate':
          return 'Last Edit Date';
        case 'stationsPage.stationsTableColumns.headerFields.activationDate':
          return 'Activation Date';
        case 'stationsPage.stationsTableColumns.headerFields.status':
          return 'Status';
        default:
          return '';
      }
    };

    const renderedCell = renderCell(params, params.value);
    expect(renderedCell).toMatchSnapshot();
    showStationID(params);
    showStatus(params);
    expect(buildColumnDefs(mockTFunction)).toEqual(ArrayBuildColumnDefs);

    // expect(result).toBe('some value');
  });
});
