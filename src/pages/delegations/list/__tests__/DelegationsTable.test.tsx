import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import DelegationsTable from '../DelegationsTable';
import * as BrokerService from '../../../../services/brokerService';
import {
  getCIBrokerDelegationMock
} from '../../../../services/__mocks__/brokerService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const mock = jest.spyOn(BrokerService, 'getCIBrokerDelegation');

afterEach(cleanup);

describe('<DelegationsTable />', () => {
  test('render component DelegationsTable with CI delegation list', async () => {
    mock.mockReturnValueOnce(new Promise((resolve) => resolve(getCIBrokerDelegationMock())));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/delegations-list`]}>
          <Route path="/delegations-list">
            <ThemeProvider theme={theme}>
              <DelegationsTable filterByName={''} />
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
  
  test('render component DelegationsTable without CI delegation list', async () => {
    mock.mockReturnValueOnce(new Promise((resolve) => resolve({})));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/delegations-list`]}>
          <Route path="/delegations-list">
            <ThemeProvider theme={theme}>
              <DelegationsTable filterByName={''} />
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

  test('render component DelegationsTable with CI delegation list and click on delegation detail', async () => {
    mock.mockReturnValueOnce(new Promise((resolve) => resolve(getCIBrokerDelegationMock())));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/delegations-list`]}>
          <Route path="/delegations-list">
            <ThemeProvider theme={theme}>
              <DelegationsTable filterByName={''} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
    });

    const goToDelegationDetailButton = screen.queryAllByTestId('column-go-to-delegation-detail')[0] as HTMLInputElement;
    fireEvent.click(goToDelegationDetailButton);
  });
});
