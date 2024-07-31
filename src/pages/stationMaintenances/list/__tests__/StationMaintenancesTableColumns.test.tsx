import { GridColDef } from '@mui/x-data-grid';
import { cleanup, render, screen } from '@testing-library/react';
import { getRowActions, buildColumnDefs, getStatusChip } from '../StationMaintenancesTableColumns';
import { createMemoryHistory } from 'history';
import React from 'react';
import add from 'date-fns/add';
import { StationMaintenanceState } from '../../../../model/StationMaintenance';
import { mockStationMaintenance } from '../../../../services/__mocks__/stationMaintenancesService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const mockTFunction = (key: string) => {
  switch (key) {
    case 'stationMaintenancesPage.table.columns.stationCode':
      return 'Station Code';
    case 'stationMaintenancesPage.table.columns.startDateTime':
      return 'Start Date';
    case 'stationMaintenancesPage.table.columns.endDateTime':
      return 'End Date';
    case 'stationMaintenancesPage.table.columns.state':
      return 'State';
    default:
      return '';
  }
};

describe('<StationMaintenancesTableColumns />', () => {
  const history = createMemoryHistory();
  test('Test columns with maintenance in state IN_PROGRESS', () => {
    const ArrayBuildColumnDefs = [
      {
        field: 'stationCode',
        cellClassName: 'justifyContentBold',
        headerName: 'Station Code',
        align: 'left',
        headerAlign: 'left',
        minWidth: 400,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'startDateTime',
        cellClassName: 'justifyContentNormal',
        headerName: 'Start Date',
        align: 'left',
        headerAlign: 'left',
        minWidth: 300,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'endDateTime',
        cellClassName: 'justifyContentNormal',
        headerName: 'End Date',
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
        field: 'state',
        cellClassName: 'justifyContentNormal',
        headerName: 'State',
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
        minWidth: 170,
        type: 'actions',
      },
    ] as Array<GridColDef>;

    const realColumns = buildColumnDefs(
      mockTFunction,
      StationMaintenanceState.IN_PROGRESS,
      jest.fn()
    ) as Array<any>;
    expect(realColumns).toEqual(ArrayBuildColumnDefs);
  });
  test('Test columns with maintenance in state SCHEDULED', () => {
    const ArrayBuildColumnDefs = [
      {
        field: 'stationCode',
        cellClassName: 'justifyContentBold',
        headerName: 'Station Code',
        align: 'left',
        headerAlign: 'left',
        minWidth: 400,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'startDateTime',
        cellClassName: 'justifyContentNormal',
        headerName: 'Start Date',
        align: 'left',
        headerAlign: 'left',
        minWidth: 300,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'endDateTime',
        cellClassName: 'justifyContentNormal',
        headerName: 'End Date',
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
        field: 'state',
        cellClassName: 'justifyContentNormal',
        headerName: 'State',
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
        minWidth: 170,
        type: 'actions',
      },
    ] as Array<GridColDef>;

    const realColumns = buildColumnDefs(
      mockTFunction,
      StationMaintenanceState.SCHEDULED,
      jest.fn()
    ) as Array<any>;
    expect(realColumns).toEqual(ArrayBuildColumnDefs);
  });
  test('Test columns with maintenance in state FINISHED', () => {
    const ArrayBuildColumnDefs = [
      {
        field: 'stationCode',
        cellClassName: 'justifyContentBold',
        headerName: 'Station Code',
        align: 'left',
        headerAlign: 'left',
        minWidth: 400,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'startDateTime',
        cellClassName: 'justifyContentNormal',
        headerName: 'Start Date',
        align: 'left',
        headerAlign: 'left',
        minWidth: 300,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'endDateTime',
        cellClassName: 'justifyContentNormal',
        headerName: 'End Date',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {},
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
        minWidth: 170,
        type: 'actions',
      },
    ] as Array<GridColDef>;

    const realColumns = buildColumnDefs(
      mockTFunction,
      StationMaintenanceState.FINISHED,
      jest.fn()
    ) as Array<any>;
    expect(realColumns).toEqual(ArrayBuildColumnDefs);
  });
});

describe('Test getStatusChip', () => {
  test('Test getStatusChip in state SCHEDULED', () => {
    const mock = mockStationMaintenance;
    mock.start_date_time = add(new Date(), { days: 1 });
    mock.end_date_time = add(new Date(), { days: 1 });
    render(<>{getStatusChip(mockTFunction, mock)}</>);

    expect(screen.queryByTestId('primary-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('default-state-chip')).toBeInTheDocument();
  });
  test('Test getStatusChip in state IN_PROGRESS', () => {
    const mock = mockStationMaintenance;
    mock.start_date_time = new Date('01/01/2024');
    mock.end_date_time = add(new Date(), { days: 1 });
    render(<>{getStatusChip(mockTFunction, mock)}</>);

    expect(screen.queryByTestId('primary-state-chip')).toBeInTheDocument();
    expect(screen.queryByTestId('default-state-chip')).not.toBeInTheDocument();
  });
});

describe('Test getRowActions', () => {
  test('Test getRowActions in state SCHEDULED', () => {
    const fn = jest.fn();
    const mock = mockStationMaintenance;
    mock.start_date_time = add(new Date(), { days: 1 });
    mock.end_date_time = add(new Date(), { days: 1 });
    render(<>{getRowActions(mockTFunction, mock, fn)}</>);

    expect(screen.queryByTestId('detail-action')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-action')).toBeInTheDocument();
    expect(screen.queryByTestId('delete-action')).toBeInTheDocument();
    expect(screen.queryByTestId('terminate-action')).not.toBeInTheDocument();
  });
  test('Test getRowActions in state IN_PROGRESS', () => {
    const fn = jest.fn();
    const mock = mockStationMaintenance;
    mock.start_date_time = new Date('01/01/2024');
    mock.end_date_time = add(new Date(), { days: 1 });
    render(<>{getRowActions(mockTFunction, mock, fn)}</>);

    expect(screen.queryByTestId('detail-action')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-action')).toBeInTheDocument();
    expect(screen.queryByTestId('delete-action')).not.toBeInTheDocument();
    expect(screen.queryByTestId('terminate-action')).toBeInTheDocument();
  });
  test('Test getRowActions in state FINISHED', () => {
    const fn = jest.fn();
    const mock = mockStationMaintenance;
    mock.start_date_time = new Date('01/01/2024');
    mock.end_date_time = new Date('01/01/2024');
    render(<>{getRowActions(mockTFunction, mock, fn)}</>);

    expect(screen.queryByTestId('detail-action')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-action')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-action')).not.toBeInTheDocument();
    expect(screen.queryByTestId('terminate-action')).not.toBeInTheDocument();
  });
});
