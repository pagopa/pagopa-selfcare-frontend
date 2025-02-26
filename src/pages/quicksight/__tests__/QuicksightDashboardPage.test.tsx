import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from '../../../redux/store';
import { pspAdminSignedDirect, pspOperatorSignedDirect } from '../../../services/__mocks__/partyService';
import { getEmbedUrlForAnonymousUser } from '../../../services/quicksightDashboardService';
import { useFlagValue } from '../../../hooks/useFeatureFlags';
import QuicksightDashboardPage from '../QuicksightDashboardPage';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('../../../services/quicksightDashboardService', () => ({
  getEmbedUrlForAnonymousUser: jest.fn(), // mock function
}));

jest.mock('../../../hooks/useFeatureFlags', () => ({
  useFlagValue: jest.fn(), // mock function
}));

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
  const mockUseFlagValue = useFlagValue as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the dashboard embed iframe when conditions are met and dashboard product is present and in status ACTIVE', async () => {
    mockGetEmbedUrlForAnonymousUser.mockResolvedValue({ embedUrl: 'https://example.com' });
    mockUseFlagValue.mockReturnValue(false);

    const payload = pspAdminSignedDirect;
    payload.onboarding = [{productId: "prod-dashboard-psp", status: "ACTIVE"}]
    renderApp({ partyPayload: payload });

    await waitFor(() => {
      expect(screen.getByTitle('Dashboard Embed')).toBeInTheDocument();
    });
  });

  it('should display the dashboard embed iframe when conditions are met and feature flag free trial is true', async () => {
    mockGetEmbedUrlForAnonymousUser.mockResolvedValue({ embedUrl: 'https://example.com' });
    mockUseFlagValue.mockReturnValue(true);

    renderApp({ partyPayload: pspAdminSignedDirect });

    await waitFor(() => {
      expect(screen.getByTitle('Dashboard Embed')).toBeInTheDocument();
    });
  });

  it('should display an attention message with PSP operator', async () => {
    renderApp({ partyPayload: pspOperatorSignedDirect });

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
      expect(screen.queryByTestId('confirm-button-test')).toBeInTheDocument();
    });
  });

  it('should display an attention message with error 403 on api call', async () => {
    mockGetEmbedUrlForAnonymousUser.mockRejectedValue({});
    renderApp({ partyPayload: pspAdminSignedDirect });

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
      expect(screen.queryByTestId('confirm-button-test')).toBeInTheDocument();
    });
  });

  it('should display an attention message with generic error on api call', async () => {
    mockGetEmbedUrlForAnonymousUser.mockRejectedValue({status: 500});
    renderApp({ partyPayload: pspAdminSignedDirect });

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
      expect(screen.queryByTestId('confirm-button-test')).toBeInTheDocument();
    });
  });
});
