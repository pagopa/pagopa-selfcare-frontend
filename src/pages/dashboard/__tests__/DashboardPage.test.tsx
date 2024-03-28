import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '../../../locale';
import { BrowserRouter } from 'react-router-dom';

import DashboardPage from '../DashboardPage';
import { createStore, store } from '../../../redux/store';
import {
  PTECPSPSigned,
  PTECSigned,
  PTPSPSigned,
  PTUnsigned,
  ecAdminSignedDirect,
  ecOperatorUnsigned,
  pspAdminSignedDirect,
  pspOperatorUnsigned,
} from '../../../services/__mocks__/partyService';
import {
  brokerAndEcDetailsResource_ECAndBroker,
  brokerOrPspDetailsResource_Empty,
  brokerOrPspDetailsResource_PSPAndBroker,
} from '../../../services/__mocks__/nodeService';
import { createMemoryHistory } from 'history';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

jest.mock('../../../decorators/withLogin');
jest.mock('../../../decorators/withParties');
jest.mock('../../../decorators/withSelectedParty');
jest.mock('../../../decorators/withSelectedPartyProducts');

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
          <DashboardPage />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );

  return { store, history };
};

describe('<DashboardPage />', () => {
  test('Test rendering PSP', async () => {
    renderApp({ partyPayload: pspAdminSignedDirect });
    await waitFor(() => expect(screen.getByTestId('psp-registration')).toBeInTheDocument());
  });

  test('Test rendering EC', async () => {
    renderApp({ partyPayload: ecAdminSignedDirect });
    await waitFor(() => expect(screen.getByTestId('ec-registration')).toBeInTheDocument());
  });

  test('Test rendering PT', async () => {
    renderApp({ partyPayload: PTECPSPSigned });
    await waitFor(() => expect(screen.getByTestId('pt-registration')).toBeInTheDocument());
  });

  test('Test - PSP unsigned - not admin', async () => {
    renderApp({ partyPayload: pspOperatorUnsigned });
    await waitFor(() => expect(screen.getByTestId('psp-registration')).toBeInTheDocument());
  });

  test('Test - EC unsigned - not admin', async () => {
    renderApp({ partyPayload: ecOperatorUnsigned });
    await waitFor(() => expect(screen.getByTestId('ec-registration')).toBeInTheDocument());
  });

  test('Test - EC signed - admin', async () => {
    const injectedStore = createStore();
    await waitFor(() => {
      injectedStore.dispatch({
        type: 'parties/setSigninData',
        payload: brokerAndEcDetailsResource_ECAndBroker,
      });
    });

    renderApp({ injectedStore: injectedStore, partyPayload: ecAdminSignedDirect });
    await waitFor(() => expect(screen.getByTestId('ec-registration')).toBeInTheDocument());
  });

  test('Test PT unsigned', async () => {
    renderApp({ partyPayload: PTUnsigned });
    await waitFor(() => expect(screen.getByTestId('pt-registration')).toBeInTheDocument());

    expect(screen.getAllByText(/PT unsigned/i)[0]).toBeInTheDocument();
  });

  test('Test PT - EC/PSP - signed', async () => {
    const injectedStore = createStore();

    await waitFor(() => {
      store.dispatch({
        type: 'parties/setSigninData',
        payload: {
          brokerDetailsResource: brokerAndEcDetailsResource_ECAndBroker.brokerDetailsResource,
          brokerPspDetailsResource: brokerOrPspDetailsResource_Empty.brokerPspDetailsResource,
        },
      });
    });
    renderApp({ injectedStore: injectedStore, partyPayload: PTECPSPSigned });
    await waitFor(() => expect(screen.getByTestId('pt-registration')).toBeInTheDocument());

    expect(screen.getAllByText(/PT ECPSP Signed/i)[0]).toBeVisible();
  });

  test('Test PT - PSP - signed', async () => {
    const injectedStore = createStore();
    await waitFor(() => {
      store.dispatch({
        type: 'parties/setSigninData',
        payload: {
          brokerDetailsResource: {},
          brokerPspDetailsResource:
            brokerOrPspDetailsResource_PSPAndBroker.brokerPspDetailsResource,
        },
      });
    });
    renderApp({ injectedStore: injectedStore, partyPayload: PTPSPSigned });
    await waitFor(() => expect(screen.getByTestId('pt-registration')).toBeInTheDocument());

    expect(screen.getAllByText(/PT PSP Signed/i)[0]).toBeVisible();
  });

  test('Test PT - EC - signed', async () => {
    const injectedStore = createStore();
    await waitFor(() => {
      store.dispatch({
        type: 'parties/setSigninData',
        payload: {
          brokerDetailsResource: brokerAndEcDetailsResource_ECAndBroker.brokerDetailsResource,
          brokerPspDetailsResource: {},
        },
      });
    });
    renderApp({ injectedStore: injectedStore, partyPayload: PTECSigned });
    await waitFor(() => expect(screen.getByTestId('pt-registration')).toBeInTheDocument());

    expect(screen.getAllByText(/PT EC Signed/i)[0]).toBeVisible();
  });
});
