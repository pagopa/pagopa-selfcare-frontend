import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import StationDetailPage from '../detail/StationDetailPage';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { ecAdminSigned } from '../../../services/__mocks__/partyService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationDetailPage />', () => {
  const stationId = '81001870922_06';

  test('render component StationDetailPage', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station/${stationId}`]}>
          <Route path="/stations/:stationId">
            <ThemeProvider theme={theme}>
              <StationDetailPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  test('Test Render station detail with role operator', async () => {
    store.dispatch(partiesActions.setPartySelected(ecAdminSigned));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station/${stationId}`]}>
          <Route path="/stations/:stationId">
            <ThemeProvider theme={theme}>
              <StationDetailPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
