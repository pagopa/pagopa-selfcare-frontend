import { GridColDef, GridRenderCellParams, GridStateColDef } from '@mui/x-data-grid';
import { cleanup, render } from '@testing-library/react';
import { showStatus, buildColumnDefs } from '../StationsTableColumns';
import React from 'react';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const rowNode = [
  {
    id: '',
    parent: '',
    depth: 0,
    groupingKey: '',
    groupingField: '',
  },
];

const colDefMocked: GridStateColDef<any, any, any> = {
  computedWidth: 0,
  field: 'stationCode',
  type: '',
  hasBeenResized: undefined,
  groupPath: undefined,
  headerName: 'stationCode',
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
  // @ts-ignore
  colDef: colDefMocked[0],
  cellMode: 'edit',
  hasFocus: false,
  tabIndex: 0,
  getValue: () => jest.fn(),
};

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
      return key;
  }
};

describe('<StationsTableColumns />', () => {
  test('Test of all the functions inside StationsTableColumns', () => {
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
        field: 'connectionType',
        cellClassName: 'justifyContentNormal',
        headerName: "stationsPage.stationsTableColumns.headerFields.connection",
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
        field: 'wrapperStatus',
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

    expect(buildColumnDefs(mockTFunction, false)).toEqual(ArrayBuildColumnDefs);

    render(<>{showStatus(params, false)}</>);
  });

  test('Test of all the functions inside StationsTableColumns as pagopa operator', () => {
    const ArrayBuildColumnDefs = [
      {
        field: 'stationCode',
        cellClassName: 'justifyContentBold',
        headerName: 'Station Name',
        align: 'left',
        headerAlign: 'left',
        minWidth: 900,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'connectionType',
        cellClassName: 'justifyContentNormal',
        headerName: "stationsPage.stationsTableColumns.headerFields.connection",
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
        field: 'wrapperStatus',
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

    expect(buildColumnDefs(mockTFunction, true)).toEqual(ArrayBuildColumnDefs);

    render(<>{showStatus(params, true)}</>);
  });
});
