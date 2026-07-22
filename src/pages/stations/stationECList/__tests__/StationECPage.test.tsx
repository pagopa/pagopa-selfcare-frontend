import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { partiesActions } from '../../../../redux/slices/partiesSlice';
import { store } from '../../../../redux/store';
import { mockedCreditorInstitutionInfoArray } from '../../../../services/__mocks__/creditorInstitutionService';
import { ecAdminSignedDirect } from '../../../../services/__mocks__/partyService';
import * as creditorInsitutionService from '../../../../services/creditorInstitutionService';
import StationECPage from '../StationECPage';

let getAvailableCreditorInstitutionsForStationSpy: jest.SpyInstance;

beforeEach(() => {
  getAvailableCreditorInstitutionsForStationSpy = jest.spyOn(
    creditorInsitutionService,
    'getAvailableCreditorInstitutionsForStation'
  );
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.resetModules();
});
afterEach(cleanup);

describe('<StationECTable />', () => {
  const stationId = 'XPAY_03_ONUS';
  test('render component StationECTable', async () => {
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
    getAvailableCreditorInstitutionsForStationSpy.mockResolvedValue(
      mockedCreditorInstitutionInfoArray
    );

    await waitFor(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/stations/${stationId}/ec-list`]}>
            <Route path="/stations/:stationId/ec-list">
              <ThemeProvider theme={theme}>
                <StationECPage />
              </ThemeProvider>
            </Route>
          </MemoryRouter>
        </Provider>
      );
    });
  });

  test('render component StationECTable with Alert', async () => {
    const state = { alertSuccessMessage: 'testAlertMessage' };
    const history = createMemoryHistory({
      initialEntries: [{ pathname: `/stations/${stationId}/ec-list`, state: state }],
    });
    getAvailableCreditorInstitutionsForStationSpy.mockResolvedValue(
        mockedCreditorInstitutionInfoArray
      );
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

    await waitFor(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/stations/:stationId/ec-list">
              <ThemeProvider theme={theme}>
                <StationECPage />
              </ThemeProvider>
            </Route>
          </Router>
        </Provider>
      );
    });

    const alertSuccessMessage = await screen.getAllByText(/testAlertMessage/i);
    expect(alertSuccessMessage.length).toBe(1);
  });

  test('render component StationECTable no more delegation available', async () => {
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
    getAvailableCreditorInstitutionsForStationSpy.mockResolvedValue({
      creditor_institution_info_list: [],
    });

    await waitFor(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/stations/${stationId}/ec-list`]}>
            <Route path="/stations/:stationId/ec-list">
              <ThemeProvider theme={theme}>
                <StationECPage />
              </ThemeProvider>
            </Route>
          </MemoryRouter>
        </Provider>
      );
    });

    const alert = screen.getByTestId('alert-warning-test');
    await waitFor(() => {
      expect(alert).toBeInTheDocument();
    });
  });

  test('render component StationECTable error', async () => {
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
    getAvailableCreditorInstitutionsForStationSpy.mockRejectedValue('');

    await waitFor(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/stations/${stationId}/ec-list`]}>
            <Route path="/stations/:stationId/ec-list">
              <ThemeProvider theme={theme}>
                <StationECPage />
              </ThemeProvider>
            </Route>
          </MemoryRouter>
        </Provider>
      );
    });
  });
});
