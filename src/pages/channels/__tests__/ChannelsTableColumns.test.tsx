import {
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridStateColDef,
} from '@mui/x-data-grid';
import { cleanup } from '@testing-library/react';
import {
  renderCell,
  showCustomHeader,
  showChannelCode,
  showStatus,
  buildColumnDefs,
} from '../list/ChannelsTableColumns';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<ChannelsTableColumns />', () => {
  test('Test of all the functions inside the component', () => {
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
      field: 'channel_Code',
      type: '',
      hasBeenResized: undefined,
      groupPath: undefined,
      headerName: 'Channel Name',
    };

    const params: GridRenderCellParams<any, any, any> = {
      value: 'some value',
      row: {
        channel_code: '123456',
      },
      api: undefined,
      id: '',
      field: '',
      rowNode: rowNode[0],
      colDef: colDefMocked[0],
      cellMode: 'edit',
      hasFocus: false,
      tabIndex: 0,
      getValue: () => jest.fn(),
    };

    // const ArrayBuildColumnDefs = [
    //   {
    //     field: 'channel_code',
    //     cellClassName: 'justifyContentBold',
    //     headerName: 'Channel Name',
    //     align: 'left',
    //     headerAlign: 'left',
    //     width: 403,
    //     editable: false,
    //     disableColumnMenu: true,
    //     renderHeader: showCustomHeader,
    //     renderCell: (params: any) => showChannelCode(params),
    //     sortable: true,
    //     flex: 4,
    //   },
    //   {
    //     field: 'broker_description',
    //     cellClassName: 'justifyContentNormal',
    //     headerName: 'Creation Date',
    //     align: 'left',
    //     headerAlign: 'left',
    //     width: 404,
    //     editable: false,
    //     disableColumnMenu: true,
    //     renderHeader: showCustomHeader,
    //     renderCell: (params) => renderCell(params, undefined),
    //     sortable: false,
    //     flex: 4,
    //   },
    //   {
    //     field: 'enabled',
    //     cellClassName: 'justifyContentNormal',
    //     headerName: 'Status',
    //     align: 'left',
    //     headerAlign: 'left',
    //     width: 404,
    //     editable: false,
    //     disableColumnMenu: true,
    //     renderHeader: showCustomHeader,
    //     renderCell: (params) => renderCell(params, undefined),
    //     sortable: false,
    //     flex: 4,
    //   },
    //   {
    //     field: 'actions',
    //     cellClassName: 'justifyContentNormalRight',
    //     type: 'actions',
    //     headerName: '',
    //     align: 'center',
    //     hideSortIcons: true,
    //     disableColumnMenu: true,
    //     editable: false,

    //     getActions: () => jest.fn(),
    //     sortable: false,
    //     flex: 1,
    //   },
    // ] as Array<GridColDef>;

    const mockTFunction = (key: string) => {
      switch (key) {
        case 'channelsPage.channelsTableColumns.headerFields.name':
          return 'Channel Name';
        case 'channelsPage.channelsTableColumns.headerFields.description':
          return 'Creation Date';
        case 'channelsPage.channelsTableColumns.headerFields.status':
          return 'Status';
        default:
          return '';
      }
    };

    const customHeader: GridColumnHeaderParams = {
      field: 'channel_code',
      colDef: colDefMocked,
    };

    renderCell(params, params.value);
    showChannelCode(params);
    showStatus(params);
    showCustomHeader(customHeader);

    expect(buildColumnDefs(mockTFunction, jest.fn())).toBeInstanceOf(Array);
    expect(buildColumnDefs(mockTFunction, jest.fn())).toHaveLength(4);
  });
});
