import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import PaymentsReceiptsPage from '../PaymentsReceiptsPage';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<PaymentsReceiptsPage />', () => {
  test('render component PaymentsReceiptsPage', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/payments-receipts`]}>
          <Route path="/payments-receipts">
            <ThemeProvider theme={theme}>
              <PaymentsReceiptsPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const filterDate = screen.getByTestId("select-year") as HTMLInputElement;

    fireEvent.change(filterDate, {target: {value: "2023"}});
    await waitFor(() => {
      expect(filterDate.value).toBe("2023");
    })

    fireEvent.change(filterDate, {target: {value: null}});
    await waitFor(() => {
      expect(filterDate.value).toBe("");
    })
  });
});
