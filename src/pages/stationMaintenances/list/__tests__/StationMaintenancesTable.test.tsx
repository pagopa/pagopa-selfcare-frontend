import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import StationMaintenancesTable from '../StationMaintenancesTable';
import * as StationMaintenanceService from '../../../../services/stationMaintenancesService';
import {
  getMockMaintenanceFinished,
  getMockMaintenanceInProgress,
  getMockMaintenanceScheduled,
  mockStationMaintenancesList,
} from '../../../../services/__mocks__/stationMaintenancesService';

jest.mock('../../../../hooks/useOrganizationType');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const mockGetStationMaintenances = jest.spyOn(StationMaintenanceService, 'getStationMaintenances');
const mockTerminateMaintenance = jest.spyOn(StationMaintenanceService, 'finishStationMaintenance');
const mockDeleteMaintenance = jest.spyOn(StationMaintenanceService, 'deleteStationMaintenance');

afterEach(cleanup);

describe('<StationMaintenancesTable />', () => {
  test('render component StationMaintenancesTable SCHEDULED', async () => {
    const alertFn = jest.fn();
    const list = mockStationMaintenancesList;
    list.station_maintenance_list = [...getMockMaintenanceScheduled(1)];
    mockGetStationMaintenances.mockResolvedValue(list);
    mockDeleteMaintenance.mockResolvedValueOnce();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station-maintenances`]}>
          <Route path="/station-maintenances">
            <ThemeProvider theme={theme}>
              <StationMaintenancesTable setAlertMessage={alertFn} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
    const stateSelect = screen.getByTestId('state-select') as HTMLInputElement;
    const yearSelect = screen.getByTestId('select-year') as HTMLInputElement;
    const searchButton = screen.getByTestId('button-search');
    const resetFilter = screen.getByTestId('reset-filter-button');

    expect(screen.queryByTestId('tab-scheduled')).toBeInTheDocument();
    expect(screen.queryByTestId('tab-finished')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetStationMaintenances).toBeCalledTimes(1);
      expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('tab-finished'));

    await waitFor(() => {
      expect(mockGetStationMaintenances).toBeCalledTimes(2);
      expect(screen.queryByTestId('state-select')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('tab-scheduled'));

    await waitFor(() => {
      expect(mockGetStationMaintenances).toBeCalledTimes(3);
    });

    fireEvent.change(searchInput, { target: { value: 'search' } });
    fireEvent.change(stateSelect, { target: { value: 'In programma' } });
    fireEvent.change(yearSelect, { target: { value: new Date('01/01/2025').getFullYear() } });

    await waitFor(() => {
      expect(searchInput.value).toBe('search');
      expect(stateSelect.value).toBe('In programma');
      expect(yearSelect.value).toBe(new Date('01/01/2025').getFullYear().toString());
    });

    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockGetStationMaintenances).toBeCalledTimes(4);
    });

    fireEvent.click(resetFilter);

    await waitFor(() => {
      expect(searchInput.value).toBe('');
      expect(yearSelect.value).toBe(new Date().getFullYear().toString());
    });

    await waitFor(() => {
      expect(mockGetStationMaintenances).toBeCalledTimes(5);
    });

    const menuButton = await screen.findByRole('menuitem');

    fireEvent.click(menuButton);

    let deleteAction;
    await waitFor(() => {
      expect(screen.queryByTestId('detail-action')).toBeInTheDocument();
      expect(screen.queryByTestId('edit-action')).toBeInTheDocument();
      deleteAction = screen.getByTestId('delete-action');
      expect(screen.queryByTestId('terminate-action')).not.toBeInTheDocument();
    });

    fireEvent.click(deleteAction);

    let confirmButton;
    await waitFor(() => {
      confirmButton = screen.getByRole('button', {
        name: /general.confirm/i,
      });
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteMaintenance).toBeCalledTimes(1);
      expect(mockGetStationMaintenances).toBeCalledTimes(6);
    });

    expect(alertFn).toBeCalled();

    mockGetStationMaintenances.mockReset();
  });
  test('render component StationMaintenancesTable IN_PROGRESS', async () => {
    const alertFn = jest.fn();
    const list = mockStationMaintenancesList;
    list.station_maintenance_list = [...getMockMaintenanceInProgress(1)];
    mockGetStationMaintenances.mockResolvedValue(list);
    mockTerminateMaintenance.mockResolvedValueOnce();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station-maintenances`]}>
          <Route path="/station-maintenances">
            <ThemeProvider theme={theme}>
              <StationMaintenancesTable setAlertMessage={alertFn} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const menuButton = await screen.findByRole('menuitem');

    fireEvent.click(menuButton);

    let terminateAction;
    await waitFor(() => {
      expect(screen.queryByTestId('detail-action')).toBeInTheDocument();
      expect(screen.queryByTestId('edit-action')).toBeInTheDocument();
      terminateAction = screen.getByTestId('terminate-action');
      expect(screen.queryByTestId('delete-action')).not.toBeInTheDocument();
    });

    fireEvent.click(terminateAction);

    let confirmButton;
    await waitFor(() => {
      confirmButton = screen.getByRole('button', {
        name: /general.confirm/i,
      });
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockTerminateMaintenance).toBeCalledTimes(1);
      expect(mockGetStationMaintenances).toBeCalledTimes(2);
    });

    expect(alertFn).toBeCalled();

    mockGetStationMaintenances.mockReset();
  });
  test('render component StationMaintenancesTable FINISHED', async () => {
    const alertFn = jest.fn();
    const list = mockStationMaintenancesList;
    list.station_maintenance_list = [...getMockMaintenanceFinished(1)];
    mockGetStationMaintenances.mockResolvedValue(list);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station-maintenances`]}>
          <Route path="/station-maintenances">
            <ThemeProvider theme={theme}>
              <StationMaintenancesTable setAlertMessage={alertFn} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const menuButton = await screen.findByRole('menuitem');

    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.queryByTestId('detail-action')).toBeInTheDocument();
      expect(screen.queryByTestId('edit-action')).not.toBeInTheDocument();
      expect(screen.queryByTestId('terminate-action')).not.toBeInTheDocument();
      expect(screen.queryByTestId('delete-action')).not.toBeInTheDocument();
    });

    mockGetStationMaintenances.mockReset();
  });
  test('render component StationMaintenancesTable error getStationMaintenances', async () => {
    const alertFn = jest.fn();
    const list = mockStationMaintenancesList;
    list.station_maintenance_list = [...getMockMaintenanceScheduled(1)];
    mockGetStationMaintenances.mockRejectedValueOnce('error');

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station-maintenances`]}>
          <Route path="/station-maintenances">
            <ThemeProvider theme={theme}>
              <StationMaintenancesTable setAlertMessage={alertFn} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(mockGetStationMaintenances).toBeCalledTimes(1);
      expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
    });
  });
  test('render component StationMaintenancesTable error deleteMaintenance', async () => {
    const alertFn = jest.fn();
    const list = mockStationMaintenancesList;
    list.station_maintenance_list = [...getMockMaintenanceScheduled(1)];
    mockGetStationMaintenances.mockResolvedValue(list);
    mockDeleteMaintenance.mockRejectedValueOnce('error');

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station-maintenances`]}>
          <Route path="/station-maintenances">
            <ThemeProvider theme={theme}>
              <StationMaintenancesTable setAlertMessage={alertFn} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const menuButton = await screen.findByRole('menuitem');

    fireEvent.click(menuButton);

    let deleteAction;
    await waitFor(() => {
      deleteAction = screen.getByTestId('delete-action');
    });

    fireEvent.click(deleteAction);

    let confirmButton;
    await waitFor(() => {
      confirmButton = screen.getByRole('button', {
        name: /general.confirm/i,
      });
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteMaintenance).toBeCalledTimes(1);
      expect(mockGetStationMaintenances).toBeCalledTimes(1);
    });

    expect(alertFn).not.toBeCalled();

    mockGetStationMaintenances.mockReset();
  });
  test('render component StationMaintenancesTable error terminateMaintenance', async () => {
    const alertFn = jest.fn();
    const list = mockStationMaintenancesList;
    list.station_maintenance_list = [...getMockMaintenanceInProgress(1)];
    mockGetStationMaintenances.mockResolvedValue(list);
    mockDeleteMaintenance.mockRejectedValueOnce('error');

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station-maintenances`]}>
          <Route path="/station-maintenances">
            <ThemeProvider theme={theme}>
              <StationMaintenancesTable setAlertMessage={alertFn} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const menuButton = await screen.findByRole('menuitem');

    fireEvent.click(menuButton);

    let terminateAction;
    await waitFor(() => {
      terminateAction = screen.getByTestId('terminate-action');
    });

    fireEvent.click(terminateAction);

    let confirmButton;
    await waitFor(() => {
      confirmButton = screen.getByRole('button', {
        name: /general.confirm/i,
      });
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockTerminateMaintenance).toBeCalledTimes(1);
      expect(mockGetStationMaintenances).toBeCalledTimes(1);
    });

    expect(alertFn).not.toBeCalled();

    mockGetStationMaintenances.mockReset();
  });
});
