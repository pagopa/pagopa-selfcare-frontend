import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import DelegationsPage from '../DelegationsPage';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<DelegationsPage />', () => {
  test('render component DelegationsPage', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/delegations-list`]}>
          <Route path="/delegations-list">
            <ThemeProvider theme={theme}>
              <DelegationsPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByTestId('alert-test')).not.toBeInTheDocument();
    const downloadCSVButton = screen.getByTestId('download-list-button');

    fireEvent.click(downloadCSVButton);

    await waitFor(() => {
      expect(screen.queryByTestId('alert-test')).toBeInTheDocument();
    });
  });
});
