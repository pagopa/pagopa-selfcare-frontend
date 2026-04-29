import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import CIEReceiptsPage from '../CIEReceiptsPage';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<CIEReceiptsPage />', () => {
  test('render component CIEReceiptsPage', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/cie-receipts`]}>
          <Route path="/cie-receipts">
            <ThemeProvider theme={theme}>
              <CIEReceiptsPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const fromDate = screen.getByTestId('select-from-date') as HTMLInputElement;

    fireEvent.change(fromDate, { target: { value: '2023' } });
    await waitFor(() => {
      expect(fromDate.value).toBe('2023');
    });

    fireEvent.change(fromDate, { target: { value: null } });
    await waitFor(() => {
      expect(fromDate.value).toBe('');
    });

    const toDate = screen.getByTestId('select-to-date') as HTMLInputElement;

    fireEvent.change(toDate, { target: { value: '2023' } });
    await waitFor(() => {
      expect(toDate.value).toBe('2023');
    });

    fireEvent.change(toDate, { target: { value: null } });
    await waitFor(() => {
      expect(toDate.value).toBe('');
    });

    const searchTrigger = screen.getByTestId('button-search');
    fireEvent.click(searchTrigger);
  });
});
