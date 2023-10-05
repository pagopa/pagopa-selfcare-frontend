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
  ecAdminSigned,
  pspAdminUnsigned,
  pspOperatorSigned,
} from '../../../services/__mocks__/partyService';
import { ecDetails, pspDetails } from '../../../services/__mocks__/nodeService';
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
  expect(
    screen.queryByRole('link', {
      name: /Completa registrazione/i,
    })
  ).toBeVisible();
});

test('Test - EC signed - admin', async () => {
  const { store } = renderApp(ecDetails, ecAdminSigned);
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: ecAdminSigned,
    })
  );

  expect(
    screen.queryByRole('link', {
      name: /Genera API Key/i,
    })
  ).toBeVisible();
});

test('Test - PSP signed - operator', async () => {
  const { store } = renderApp(pspDetails, pspOperatorSigned);

  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspOperatorSigned,
    })
  );

  expect(
    screen.queryByRole('link', {
      name: /Genera API Key/i,
    })
  ).toBeVisible();

  expect(
    screen.queryByText(
      /Genera le API Key di connessione al Nodo per abilitare la creazione dei canali./i
    )
  ).toBeVisible();
});

test('Test - PSP unsigned - operator', async () => {
  const { store } = renderApp(undefined, pspOperatorSigned);

  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspOperatorSigned,
    })
  );

  expect(
    screen.queryByRole('link', {
      name: /Completa registrazione/i,
    })
  ).toBeNull();
});
