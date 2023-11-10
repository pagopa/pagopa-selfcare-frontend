import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, MemoryRouter, Route } from 'react-router-dom';
import { createStore, store } from '../../../redux/store';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import StationDetailPage from '../detail/StationDetailPage';
import { isOperator } from '../../components/commonFunctions';
import { Trans } from 'react-i18next';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { ecAdminSignedDirect } from '../../../services/__mocks__/partyService';

jest.mock('../../components/commonFunctions');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const renderApp = (
  stationId: string,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/stations/${stationId}`]}>
        <Route path="/stations/:stationId">
          <ThemeProvider theme={theme}>
            <StationDetailPage />
          </ThemeProvider>
        </Route>
      </MemoryRouter>
    </Provider>
  );
  return { store, history };
};

describe('<StationDetailPage />', () => {
  const stationId = '81001870922_06';

  test('render component StationDetailPage', async () => {
    const { store } = renderApp(stationId);

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecAdminSignedDirect,
      })
    );

    expect(screen.getByText('stationDetailPage.associates')).toBeInTheDocument();
  });

  test('Test Render station detail with role operator', async () => {
    (isOperator as jest.Mock).mockReturnValue(true);
    const { store } = renderApp(stationId);

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecAdminSignedDirect,
      })
    );
    expect(
      screen.getByText('stationDetailPageValidation.infoToComplete.timeoutC')
    ).toBeInTheDocument();
  });
});
