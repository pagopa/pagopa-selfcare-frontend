import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import * as PaymentsReceiptsService from '../../../../services/paymentsReceiptsService';
import PaymentsReceiptsTable from '../PaymentsReceiptsTable';
import { mockedPaymentsReceiptsList } from '../../../../services/__mocks__/paymentsReceiptsService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const mock = jest.spyOn(PaymentsReceiptsService, 'getPaymentsReceipts');

afterEach(cleanup);

describe('<PaymentsReceiptsTable />', () => {
  test('render component PaymentsReceiptsTable with receipt list', async () => {
    mock.mockReturnValueOnce(new Promise((resolve) => resolve(mockedPaymentsReceiptsList)));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/payments-receipts`]}>
          <Route path="/payments-receipts">
            <ThemeProvider theme={theme}>
              <PaymentsReceiptsTable filterInput={''} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
    });

    mock.mockReset();
  });

  test('render component PaymentsReceiptsTable without receipt list', async () => {
    mock.mockReturnValueOnce(new Promise((resolve) => resolve({})));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/payments-receipts`]}>
          <Route path="/payments-receipts">
            <ThemeProvider theme={theme}>
              <PaymentsReceiptsTable filterInput={''} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('data-grid')).not.toBeInTheDocument();
      expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
    });

    mock.mockReset();
  });
});
