import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../../redux/store';
import { getCIBrokerStationsMock } from '../../../../../services/__mocks__/brokerService';
import * as BrokerService from '../../../../../services/brokerService';
import * as StationService from '../../../../../services/stationService';
import DelegationStationsTable from '../DelegationStationsTable';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const mock = jest.spyOn(BrokerService, 'getCIBrokerStations');
const dissociateStationMock = jest.spyOn(StationService, 'dissociateECfromStation');

afterEach(cleanup);

describe('<DelegationStationsTable />', () => {
  test('render component DelegationStationsTable with CI station list', async () => {
    mock.mockReturnValueOnce(getCIBrokerStationsMock());
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/delegations-list/detail`]}>
          <Route path="/delegations-list/detail">
            <ThemeProvider theme={theme}>
              <DelegationStationsTable ciTaxCode={'ciTaxCode'} filterByStationCode="" />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
    });
  });

  test('render component DelegationStationsTable without CI station list', async () => {
    mock.mockReturnValueOnce(Promise.resolve({}));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/delegations-list/detail`]}>
          <Route path="/delegations-list/detail">
            <ThemeProvider theme={theme}>
              <DelegationStationsTable ciTaxCode={'ciTaxCode'} filterByStationCode="" />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('data-grid')).not.toBeInTheDocument();
      expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
    });
  });

  test('render component DelegationStationsTable with click on dissociate station', async () => {
    mock.mockReturnValueOnce(getCIBrokerStationsMock());
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/delegations-list/detail`]}>
          <Route path="/delegations-list/detail">
            <ThemeProvider theme={theme}>
              <DelegationStationsTable ciTaxCode={'ciTaxCode'} filterByStationCode="" />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
    });

    const goToStationDetailButton = screen.queryAllByTestId('column-station-detail-button');
    expect(goToStationDetailButton.length).toBeTruthy();
    fireEvent.click(goToStationDetailButton[0]);

    await waitFor(() => {
      expect(screen.queryByTestId('station-detail-drawer-column')).toBeInTheDocument();
    });

    const disassociateStation = screen.getByTestId(
      'station-detail-disassociate-station-button'
    ) as HTMLInputElement;
    fireEvent.click(disassociateStation);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });

    const cancelDeleteButton = screen.getByTestId('cancel-button-test');
    fireEvent.click(cancelDeleteButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).not.toBeInTheDocument();
      expect(screen.queryByTestId('station-detail-drawer-column')).not.toBeInTheDocument();
    });

    fireEvent.click(goToStationDetailButton[0]);

    await waitFor(() => {
      expect(screen.queryByTestId('station-detail-drawer-column')).toBeInTheDocument();
    });

    fireEvent.click(disassociateStation);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });

    const confirmDeleteButton = screen.getByTestId('confirm-button-test');
    fireEvent.click(confirmDeleteButton);
    expect(dissociateStationMock).toBeCalledTimes(1);
  });
});
