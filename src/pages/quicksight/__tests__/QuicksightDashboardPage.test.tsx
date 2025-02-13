import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from '../../../redux/store';
import { pspAdminSignedDirect } from '../../../services/__mocks__/partyService';
import { getEmbedUrlForAnonymousUser } from '../../../services/quicksightDashboardService';
import QuicksightDashboardPage from '../QuicksightDashboardPage';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('../../../services/quicksightDashboardService');

const renderApp = ({
  injectedStore,
  injectedHistory,
  partyPayload = {},
}: {
  injectedStore?: ReturnType<typeof createStore>;
  injectedHistory?: ReturnType<typeof createMemoryHistory>;
  partyPayload?: any;
}) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  store.dispatch({
    type: 'parties/setPartySelected',
    payload: partyPayload,
  });
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <QuicksightDashboardPage />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );

  return { store, history };
};

describe('QuicksightDashboardPage', () => {
  const mockGetEmbedUrlForAnonymousUser = getEmbedUrlForAnonymousUser as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should display the dashboard embed iframe when conditions are met', async () => {
    mockGetEmbedUrlForAnonymousUser.mockResolvedValue({ embedUrl: 'https://example.com' });

    renderApp({ partyPayload: pspAdminSignedDirect });

    await waitFor(() => {
      expect(screen.getByTitle('Dashboard Embed')).toBeInTheDocument();
    });
  });

  it('should display an attention message when conditions are not met', async () => {
    mockGetEmbedUrlForAnonymousUser.mockResolvedValue({});
    renderApp({ partyPayload: pspAdminSignedDirect });

    await waitFor(() => {
      expect(screen.queryByTestId('no-dashboard-message-id')).not.toBeInTheDocument();
    });
  });
});
