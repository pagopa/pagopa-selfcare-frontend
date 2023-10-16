import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '../../../locale';
import { BrowserRouter } from 'react-router-dom';

import { createStore } from '../../../redux/store';
import {
  ecAdminSignedDirect,
  pspAdminUnsigned,
  pspOperatorSignedDirect,
} from '../../../services/__mocks__/partyService';
import {
  ecDetails,
  pspDetails,
  brokerAndEcDetailsResource_ECAndBroker,
  brokerOrPspDetailsResource_Empty,
  brokerOrPspDetailsResource_PSPAndBroker,
} from '../../../services/__mocks__/nodeService';
import NextSteps from '../components/NextSteps';
import { SigninData } from '../../../model/Node';
import { Party } from '../../../model/Party';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const renderApp = (
  signinData?: SigninData,
  party?: Party,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <NextSteps signinData={signinData} selectedParty={party} />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
  return { store, history };
};

test('Test rendering - PSP unsigned admin', async () => {
  const { store } = renderApp(undefined, pspAdminUnsigned);
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspAdminUnsigned,
    })
  );

  await waitFor(() =>
    store.dispatch({
      type: 'parties/setSigninData',
      payload: brokerOrPspDetailsResource_Empty,
    })
  );

  expect(
    screen.queryByRole('link', {
      name: /Completa registrazione/i,
    })
  ).toBeVisible();
});

test('Test - EC direct signed - admin', async () => {
  const { store } = renderApp(brokerAndEcDetailsResource_ECAndBroker, ecAdminSignedDirect);

  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: ecAdminSignedDirect,
    })
  );

  await waitFor(() =>
    store.dispatch({
      type: 'parties/setSigninData',
      payload: brokerAndEcDetailsResource_ECAndBroker,
    })
  );

  expect(
    screen.queryByRole('link', {
      name: /Genera API Key/i,
    })
  ).toBeVisible();
});

test('Test - PSP direct signed - operator', async () => {
  const { store } = renderApp(pspDetails, pspOperatorSignedDirect);

  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspOperatorSignedDirect,
    })
  );

  await waitFor(() =>
    store.dispatch({
      type: 'parties/setSigninData',
      payload: brokerOrPspDetailsResource_PSPAndBroker,
    })
  );

  screen.debug(undefined, 9999999);

  expect(
    screen.queryByText(/Completa la registrazione sul Nodo inserendo i dati mancanti./i)
  ).toBeVisible();
});

test('Test - PSP unsigned - operator', async () => {
  const { store } = renderApp(undefined, pspOperatorSignedDirect);

  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspOperatorSignedDirect,
    })
  );

  expect(
    screen.queryByRole('link', {
      name: /Completa registrazione/i,
    })
  ).toBeNull();
});
