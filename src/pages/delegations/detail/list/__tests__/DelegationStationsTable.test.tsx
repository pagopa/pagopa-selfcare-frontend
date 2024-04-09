import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../../redux/store';
import {
  getCIBrokerStationsMock
} from '../../../../../services/__mocks__/brokerService';
import * as BrokerService from '../../../../../services/brokerService';
import DelegationStationsTable from '../DelegationStationsTable';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const mock = jest.spyOn(BrokerService, 'getCIBrokerStations');

afterEach(cleanup);

describe('<DelegationStationsTable />', () => {
  test('render component DelegationStationsTable with CI station list', async () => {
    mock.mockReturnValueOnce(Promise.resolve(getCIBrokerStationsMock()));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/delegations-list/detail`]}>
          <Route path="/delegations-list/detail">
            <ThemeProvider theme={theme}>
              <DelegationStationsTable ciTaxCode={'ciTaxCode'} filterByStationCode='' />
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
              <DelegationStationsTable ciTaxCode={'ciTaxCode'} filterByStationCode='' />
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
});
