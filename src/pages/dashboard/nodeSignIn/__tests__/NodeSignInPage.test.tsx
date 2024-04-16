import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
// import { mockedParties } from '../services/__mocks__/partyService';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '../../../../locale';
import { BrowserRouter } from 'react-router-dom';

import NodeSignInPage from '../NodeSignInPage';
import { createStore } from '../../../../redux/store';
import { Party } from '../../../../model/Party';
import { PTECSigned, pspAdminSignedDirect } from '../../../../services/__mocks__/partyService';
import { pspDetails } from '../../../../services/__mocks__/nodeService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

jest.mock('../../../../decorators/withSelectedParty');

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  const store = injectedStore ? injectedStore : createStore();
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <NodeSignInPage />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
  return { store, history };
};

test('Test rendering with psp', async () => {
  const { store } = renderApp();
  await waitFor(() => {
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspAdminSignedDirect,
    });

    store.dispatch({
      type: 'parties/setSigninData',
      payload: pspDetails,
    });
  });
  expect(screen.getByText(/Marca da bollo digitale/i)).toBeVisible();
});

test('Test rendering with ec', async () => {
  const { store } = renderApp();
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: ecPartySelected,
    })
  );
  expect(screen.getAllByText(/Domicilio Fiscale/i).length).toBeGreaterThan(0);
});

test('Test rendering with pt', async () => {
  const { store } = renderApp();
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: PTECSigned,
    })
  );
  expect(screen.getByText(/Che tipologia di ente vuoi intermediare?/i)).toBeVisible();
  fireEvent.click(screen.getByText(/Esci/i));
});

const ecPartySelected: Party = {
  partyId: '6b82300e-4fad-459d-a75b-91b5e7ae4f04',
  externalId: '1122334455',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PA',
  description: 'Ente Creditore S.r.l.',
  category: 'Gestori di Pubblici Servizi',
  fiscalCode: '1122334455',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'DELEGATE',
      roleKey: 'admin',
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/6b82300e-4fad-459d-a75b-91b5e7ae4f04/logo.png',
};
