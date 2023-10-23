import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '../../../locale';
import { Router } from 'react-router-dom';

import { createStore } from '../../../redux/store';
import {
  PTECPSPSigned,
  ecAdminSignedDirect,
  pspAdminSignedDirect,
  pspAdminUnsigned,
} from '../../../services/__mocks__/partyService';
import PSPRegistrationData from '../components/PSPRegistrationData';
import { SigninData } from '../../../model/Node';
import { brokerOrPspDetailsResource_PSPAndBroker } from '../../../services/__mocks__/nodeService';
import ROUTES from '../../../routes';

const signInData: SigninData = {};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <PSPRegistrationData />
        </Router>
      </ThemeProvider>
    </Provider>
  );
  return { store, history };
};

test('Test rendering ', async () => {
  const { store } = renderApp();
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspAdminUnsigned,
    })
  );
  expect(screen.queryByText('PSP Admin unsigned')).toBeVisible();
});

test('Test rendering digitalStamp false, bic undefined ', async () => {
  const { store } = renderApp();
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspAdminUnsigned,
    })
  );
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setSigninData',
      payload: {
        paymentServiceProviderDetailsResource: {
          stamp: false,
          bic: '123',
        },
      },
    })
  );
  expect(screen.queryAllByText('No').length).toBe(1);
});

test('Test rendering digitalStamp undefined ', async () => {
  const { store } = renderApp();
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspAdminUnsigned,
    })
  );
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setSigninData',
      payload: {
        paymentServiceProviderDetailsResource: {},
      },
    })
  );

  expect(screen.queryAllByText('-').length).toBe(3);
});

test('Test onClick modify button', async () => {
  const { store, history } = renderApp();
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspAdminSignedDirect,
    })
  );

  await waitFor(() =>
    store.dispatch({
      type: 'parties/setSigninData',
      payload: brokerOrPspDetailsResource_PSPAndBroker,
    })
  );

  const modifyBtn = screen.getByTestId('modify-data-test');
  fireEvent.click(modifyBtn);

  expect(history.location.pathname).toBe(ROUTES.NODE_SIGNIN);
});
