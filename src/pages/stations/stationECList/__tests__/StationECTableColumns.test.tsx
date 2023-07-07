import {GridColumnHeaderParams, GridRenderCellParams, GridStateColDef} from '@mui/x-data-grid';
import {cleanup} from '@testing-library/react';
import {buildColumnDefs, renderCell, showCustomHeader, showEcName, showStatus,} from '../StationECTableColumns';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationECTableColumns />', () => {
  test('Test of all the functions inside StationECTableColumns', () => {
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
      field: 'station_code',
      type: 'string',
      hasBeenResized: undefined,
      groupPath: undefined,
      headerName: 'Station Name',
    };

    const colDefMockedStatus: GridStateColDef<any, any, any> = {
      computedWidth: 0,
      field: 'endabled',
      type: 'string',
      hasBeenResized: undefined,
      groupPath: undefined,
      headerName: 'status',
    };

    const colDefMockedBroker: GridStateColDef<any, any, any> = {
      computedWidth: 0,
      field: 'broker_description',
      type: 'string',
      hasBeenResized: undefined,
      groupPath: undefined,
      headerName: 'Creation Date',
    };

    const colDefMockedBroker2: GridStateColDef<any, any, any> = {
      computedWidth: 0,
      field: 'broker_description2',
      type: 'string',
      hasBeenResized: undefined,
      groupPath: undefined,
      headerName: 'Creation Date',
    };

    const customHeaderStation: GridColumnHeaderParams = {
      field: 'station_code',
      colDef: colDefMocked,
    };

    const customHeaderBroker: GridColumnHeaderParams = {
      field: 'broker_description',
      colDef: colDefMockedBroker,
    };

    const customHeaderBroker2: GridColumnHeaderParams = {
      field: 'broker_description2',
      colDef: colDefMockedBroker2,
    };

    const customHeaderStatus: GridColumnHeaderParams = {
      field: 'enabled',
      colDef: colDefMockedStatus,
    };

    const params: GridRenderCellParams<any, any, any> = {
      value: 'some value',
      row: {
        station_code: '123456',
        status: 'ACTVE',
      },
      api: undefined,
      id: '1',
      field: 'station_code',
      rowNode: rowNode[0],
      colDef: colDefMocked,
      cellMode: 'edit',
      hasFocus: false,
      tabIndex: 0,
      getValue: () => jest.fn(),
    };

    const paramsBroker: any = {
      value: 'broker_description',
      row: { broker_description: 'broker_description' },
      field: 'broker_description',
      api: null,
      getValue: () => '',
      colDef: colDefMockedBroker,
      id: '',
      rowNode: rowNode[0],
      cellMode: 'view',
      hasFocus: true,
      tabIndex: 0,
    };

    const paramsBroker2: any = {
      value: 'broker_description2',
      row: { broker_description2: 'broker_description2' },
      field: 'broker_description2',
      api: null,
      getValue: () => '',
      colDef: colDefMockedBroker,
      id: '',
      rowNode: rowNode[0],
      cellMode: 'view',
      hasFocus: true,
      tabIndex: 0,
    };

    const paramsStatus: any = {
      value: 'status',
      row: { enabled: 'ACTIVE' },
      field: 'enabled',
      api: null,
      getValue: () => '',
      colDef: colDefMockedStatus,
      id: '',
      rowNode: rowNode[0],
      cellMode: 'view',
      hasFocus: true,
      tabIndex: 0,
    };

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

    showEcName(params);
    showStatus(params);
    showCustomHeader(customHeaderStation);
    renderCell(params);

    showEcName(paramsBroker);
    showStatus(paramsBroker);
    showCustomHeader(customHeaderBroker);
    renderCell(paramsBroker, undefined);

    showEcName(paramsBroker2);
    showStatus(paramsBroker2);
    showCustomHeader(customHeaderBroker2);
    renderCell(paramsBroker2, undefined);

    showEcName(paramsStatus);
    showStatus(paramsStatus);
    showCustomHeader(customHeaderStatus);
    renderCell(paramsStatus, undefined);
  });
});
