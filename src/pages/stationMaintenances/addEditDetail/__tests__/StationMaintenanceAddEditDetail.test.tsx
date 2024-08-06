import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import StationMaintenanceAddEditDetail from '../StationMaintenanceAddEditDetail';
import * as StationMaintenanceService from '../../../../services/stationMaintenancesService';
import * as StationService from '../../../../services/stationService';
import { MemoryRouter, Route } from 'react-router-dom';
import { StationMaintenanceActionType } from '../../../../model/StationMaintenance';
import { useAppDispatch } from '../../../../redux/hooks';
import { stationMaintenanceActions } from '../../../../redux/slices/stationMaintenancesSlice';
import { StationMaintenanceResource } from '../../../../api/generated/portal/StationMaintenanceResource';
import { mockStationMaintenance } from '../../../../services/__mocks__/stationMaintenancesService';
import { mockedStations } from '../../../../services/__mocks__/stationService';
import { add } from 'date-fns';
import { formatDateToDDMMYYYY } from '../../../../utils/common-utils';

const mockCreate = jest.spyOn(StationMaintenanceService, 'createStationMaintenance');
const mockUpdate = jest.spyOn(StationMaintenanceService, 'updateStationMaintenance');

const mockGetStations = jest.spyOn(StationService, 'getStations');

const ComponentRender = ({
  action,
  hoursRemaining,
  stationMaintenance,
}: {
  action: StationMaintenanceActionType;
  hoursRemaining?: number;
  stationMaintenance?: StationMaintenanceResource;
}) => {
  const dispatch = useAppDispatch();
  dispatch(
    stationMaintenanceActions.setStationMaintenanceState({
      hoursRemaining: hoursRemaining ?? 36,
      stationMaintenance: stationMaintenance ?? mockStationMaintenance,
    })
  );
  return (
    <MemoryRouter initialEntries={[`/station-maintenances/${action}/${'0'}`]}>
      <Route path={'/station-maintenances/:action/:maintenanceId'}>
        <StationMaintenanceAddEditDetail />
      </Route>
    </MemoryRouter>
  );
};

describe('<StationMaintenanceAddEditDetail />', () => {
  test('Render component StationMaintenanceAddEditDetail create mode', async () => {
    mockGetStations.mockResolvedValue(mockedStations);
    mockCreate.mockResolvedValue();
    mockUpdate.mockResolvedValue();
    render(
      <Provider store={store}>
        <ComponentRender action={StationMaintenanceActionType.CREATE} />
      </Provider>
    );

    expect(screen.queryByTestId('alert-info')).toBeInTheDocument();
    expect(screen.queryByTestId('alert-warning')).not.toBeInTheDocument();

    const confirmButton = screen.getByTestId('confirm-button-test');
    expect(confirmButton).toBeDisabled();

    await waitFor(() => {
      expect(mockGetStations).toHaveBeenCalledTimes(1);
    });

    const stationAutocomplete = screen.getByTestId('station-selection')  as HTMLInputElement;
    let stationSearch = within(stationAutocomplete).getByRole('combobox');

    stationAutocomplete.focus();
    fireEvent.change(stationSearch as Element, {
      target: { value: "mockedStations.stationsList[0].stationCode)" },
    });
    await waitFor(() => {
      expect(screen.queryByText(mockedStations.stationsList[0].stationCode)).toBeInTheDocument();
    });
    fireEvent.keyDown(stationAutocomplete as Element, { key: 'ArrowDown' });
    fireEvent.keyDown(stationAutocomplete as Element, { key: 'Enter' });

    //PRE-EXTRA HOURS STANDIN
    const standInYes = screen
      .getByTestId('standIn-test')
      .querySelector('[value="true"]') as HTMLInputElement;
    const standInNo = screen
      .getByTestId('standIn-test')
      .querySelector('[value="false"]') as HTMLInputElement;

    expect(standInYes.checked).toBeTruthy();
    expect(standInNo.checked).toBeFalsy();
    expect(standInYes.disabled).toBeFalsy();
    expect(standInNo.disabled).toBeFalsy();

    fireEvent.click(standInNo);
    expect(standInYes.checked).toBeFalsy();
    expect(standInNo.checked).toBeTruthy();
    expect(standInYes.disabled).toBeFalsy();
    expect(standInNo.disabled).toBeFalsy();

    //TEST HOURS
    const hoursFrom = screen.getAllByTestId('select-hours')[0] as HTMLInputElement;
    const hoursTo = screen.getAllByTestId('select-hours')[1] as HTMLInputElement;

    expect(hoursFrom.disabled).toBeFalsy();
    expect(hoursTo.disabled).toBeFalsy();

    fireEvent.change(hoursFrom, {
      target: { value: '10:00' },
    });
    expect(hoursFrom.value).toBe('10:00');

    fireEvent.change(hoursTo, {
      target: { value: '12:00' },
    });
    expect(hoursTo.value).toBe('12:00');

    const dateFrom = screen.getAllByTestId('date-test')[0] as HTMLInputElement;
    const dateTo = screen.getAllByTestId('date-test')[1] as HTMLInputElement;

    expect(dateFrom.disabled).toBeFalsy();
    expect(dateTo.disabled).toBeFalsy();

    fireEvent.change(dateFrom, {
      target: { value: formatDateToDDMMYYYY(add(new Date(), { days: 3 })) },
    });
    expect(dateFrom.value).toBe(formatDateToDDMMYYYY(add(new Date(), { days: 3 })));

    fireEvent.change(dateTo, {
      target: { value: formatDateToDDMMYYYY(add(new Date(), { days: 22 })) },
    });
    expect(dateTo.value).toBe(formatDateToDDMMYYYY(add(new Date(), { days: 22 })));

    await waitFor(() => {
      expect(screen.queryByTestId('alert-info')).not.toBeInTheDocument();
      expect(screen.queryByTestId('alert-warning')).toBeInTheDocument();
    });

    expect(standInYes.checked).toBeTruthy();
    expect(standInNo.checked).toBeFalsy();
    expect(standInYes.disabled).toBeTruthy();
    expect(standInNo.disabled).toBeTruthy();

    // expect(confirmButton).toBeEnabled();

    // TEST DATE VALIDATION
    fireEvent.change(dateTo, {
      target: { value: formatDateToDDMMYYYY(add(new Date(), { days: 2 })) },
    });
    expect(dateTo.value).toBe(formatDateToDDMMYYYY(add(new Date(), { days: 2 })));

    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mockCreate).not.toHaveBeenCalled();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    // CONCLUDE CREATION
    fireEvent.change(dateTo, {
      target: { value: formatDateToDDMMYYYY(add(new Date(), { days: 10 })) },
    });
    expect(dateTo.value).toBe(formatDateToDDMMYYYY(add(new Date(), { days: 10 })));
  });
  test('Render component StationMaintenanceAddEditDetail edit_in_progress mode', async () => {
    mockGetStations.mockResolvedValue(mockedStations);
    mockCreate.mockResolvedValue();
    mockUpdate.mockResolvedValue();
    render(
      <Provider store={store}>
        <ComponentRender action={StationMaintenanceActionType.EDIT_IN_PROGRESS} />
      </Provider>
    );

    expect(screen.queryByTestId('alert-info')).not.toBeInTheDocument();
    expect(screen.queryByTestId('alert-warning')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetStations).toHaveBeenCalledTimes(1);
    });

    const stationAutocomplete = screen.getByTestId('station-selection');
    let stationSearch = within(stationAutocomplete).getByRole('combobox');
    expect(stationSearch).toBeDisabled();
    expect(screen.getAllByTestId('select-hours')[0]).toBeDisabled();
    expect(screen.getAllByTestId('select-hours')[1]).not.toBeDisabled();
    expect(screen.getAllByTestId('date-test')[0]).toBeDisabled();
    expect(screen.getAllByTestId('date-test')[1]).not.toBeDisabled();

    //PRE-EXTRA HOURS STANDIN
    const standInYes = screen
      .getByTestId('standIn-test')
      .querySelector('[value="true"]') as HTMLInputElement;
    const standInNo = screen
      .getByTestId('standIn-test')
      .querySelector('[value="false"]') as HTMLInputElement;

    expect(standInYes.checked).toBeTruthy();
    expect(standInNo.checked).toBeFalsy();
    expect(standInYes.disabled).toBeTruthy();
    expect(standInNo.disabled).toBeTruthy();
  });
  test('Render component StationMaintenanceAddEditDetail edit_scheduled mode', async () => {
    mockGetStations.mockResolvedValue(mockedStations);
    mockCreate.mockResolvedValue();
    mockUpdate.mockResolvedValue();
    render(
      <Provider store={store}>
        <ComponentRender action={StationMaintenanceActionType.EDIT_SCHEDULED} />
      </Provider>
    );

    expect(screen.queryByTestId('alert-info')).not.toBeInTheDocument();
    expect(screen.queryByTestId('alert-warning')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetStations).toHaveBeenCalledTimes(1);
    });

    const stationAutocomplete = screen.getByTestId('station-selection');
    let stationSearch = within(stationAutocomplete).getByRole('combobox');
    expect(stationSearch).toBeDisabled();
    expect(screen.getAllByTestId('select-hours')[0]).not.toBeDisabled();
    expect(screen.getAllByTestId('select-hours')[1]).not.toBeDisabled();
    expect(screen.getAllByTestId('date-test')[0]).not.toBeDisabled();
    expect(screen.getAllByTestId('date-test')[1]).not.toBeDisabled();

    //PRE-EXTRA HOURS STANDIN
    const standInYes = screen
      .getByTestId('standIn-test')
      .querySelector('[value="true"]') as HTMLInputElement;
    const standInNo = screen
      .getByTestId('standIn-test')
      .querySelector('[value="false"]') as HTMLInputElement;

    expect(standInYes.checked).toBeTruthy();
    expect(standInNo.checked).toBeFalsy();
    expect(standInYes.disabled).toBeFalsy();
    expect(standInNo.disabled).toBeFalsy();
  });
  test('Render component StationMaintenanceAddEditDetail detail mode', async () => {
    mockGetStations.mockResolvedValue(mockedStations);
    mockCreate.mockResolvedValue();
    mockUpdate.mockResolvedValue();
    render(
      <Provider store={store}>
        <ComponentRender action={StationMaintenanceActionType.DETAILS} />
      </Provider>
    );

    expect(screen.queryByTestId('alert-info')).not.toBeInTheDocument();
    expect(screen.queryByTestId('alert-warning')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetStations).toHaveBeenCalledTimes(1);
    });

    const stationAutocomplete = screen.getByTestId('station-selection');
    let stationSearch = within(stationAutocomplete).getByRole('combobox');
    expect(stationSearch).toBeDisabled();
    expect(screen.getAllByTestId('select-hours')[0]).toBeDisabled();
    expect(screen.getAllByTestId('select-hours')[1]).toBeDisabled();
    expect(screen.getAllByTestId('date-test')[0]).toBeDisabled();
    expect(screen.getAllByTestId('date-test')[1]).toBeDisabled();

    //PRE-EXTRA HOURS STANDIN
    const standInYes = screen
      .getByTestId('standIn-test')
      .querySelector('[value="true"]') as HTMLInputElement;
    const standInNo = screen
      .getByTestId('standIn-test')
      .querySelector('[value="false"]') as HTMLInputElement;

    expect(standInYes.checked).toBeTruthy();
    expect(standInNo.checked).toBeFalsy();
    expect(standInYes.disabled).toBeTruthy();
    expect(standInNo.disabled).toBeTruthy();
  });
});
