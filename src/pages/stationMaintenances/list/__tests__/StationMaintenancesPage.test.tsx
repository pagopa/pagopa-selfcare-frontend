import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import StationMaintenancesPage from '../StationMaintenancesPage';
import { store } from '../../../../redux/store';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationMaintenancesPage />', () => {
  test('render component StationMaintenancesPage', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station-maintenances`]}>
          <Route path="/station-maintenances">
            <ThemeProvider theme={theme}>
              <StationMaintenancesPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
