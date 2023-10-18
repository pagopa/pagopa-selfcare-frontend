import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '../../../locale';
import { BrowserRouter, Router } from 'react-router-dom';

import DashboardPage from '../DashboardPage';
import { store } from '../../../redux/store';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { brokerAndEcDetailsResource_ECAndBroker } from '../../../services/__mocks__/nodeService';
import { createMemoryHistory } from 'history';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

jest.mock('../../../decorators/withLogin');
jest.mock('../../../decorators/withParties');
jest.mock('../../../decorators/withSelectedParty');
jest.mock('../../../decorators/withSelectedPartyProducts');

const renderApp = () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <DashboardPage />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

test('Test rendering PSP', async () => {
  renderApp();
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspPartySelected,
    })
  );
  expect(screen.getByText(/istituti di pagamento/i)).toBeVisible();
});

test('Test rendering EC', async () => {
  renderApp();
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: ecPartySelected,
    })
  );
  expect(screen.getAllByText(/Ente Creditore S.r.l./i)[0]).toBeVisible();
});

test('Test rendering button', async () => {
  renderApp();
  store.dispatch({
    type: 'parties/setPartySelected',
    payload: pspUnsignedAdmin,
  });
  expect(
    screen.getByRole('link', {
      name: /completa registrazione/i,
    })
  ).toBeVisible();
});

test('Test - PSP unsigned - not admin', async () => {
  renderApp();
  store.dispatch({
    type: 'parties/setPartySelected',
    payload: pspUnsignedOperator,
  });
  expect(
    screen.queryByRole('link', {
      name: /Completa registrazione/i,
    })
  ).toBeNull();
});

test('Test - EC unsigned - not admin', async () => {
  renderApp();
  store.dispatch({
    type: 'parties/setPartySelected',
    payload: ecUsnignedOperator,
  });
  expect(
    screen.queryByRole('link', {
      name: /Completa registrazione/i,
    })
  ).toBeNull();
});

test('Test - EC signed - admin', async () => {
  renderApp();
  store.dispatch({
    type: 'parties/setPartySelected',
    payload: ecAdminSigned,
  });

  store.dispatch({
    type: 'parties/setSignInData',
    payload: brokerAndEcDetailsResource_ECAndBroker,
  });

  expect(
    screen.queryByText(/Completa la registrazione sul Nodo inserendo i dati mancanti./i)
  ).toBeVisible();
});

test('render component with alert message', () => {
  const history = createMemoryHistory();
  history.location.state = { alertSuccessMessage: 'Success!' };

  render(
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <DashboardPage />
        </ThemeProvider>
      </Router>
    </Provider>
  );
});

const pspPartySelected = {
  partyId: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944',
  externalId: '15376371009',
  originId: 'PAGOPASPA',
  origin: 'SELC',
  description: 'PagoPA S.p.A.',
  fiscalCode: '15376371009',
  digitalAddress: 'selfcare@pec.pagopa.it',
  status: 'ACTIVE',
  registeredOffice: 'Piazza Colonna, 370',
  institutionType: 'PSP',
  roles: [
    {
      partyRole: 'DELEGATE',
      roleKey: 'admin',
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/26a0aabf-ce6a-4dfa-af4e-d4f744a8b944/logo.png',
  typology: 'TODO',
  pspData: {
    businessRegisterNumber: '00000000000',
    legalRegisterName: 'ISTITUTI DI PAGAMENTO',
    legalRegisterNumber: '09878',
    abiCode: '36042',
    vatNumberGroup: false,
  },
};

const ecPartySelected = {
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
  urlLogo: 'http://checkout.selfcare/institutions/6b82300e-4fad-459d-a75b-91b5e7ae4f04/logo.png',
};

const pspUnsignedOperator = mockedParties.find(
  (party) => party.description === 'PSP Operator unsigned'
);

const ecUsnignedOperator = mockedParties.find((party) => party.description === 'EC unsigned');

const ecAdminSigned = mockedParties.find((party) => party.description === 'Ente Creditore S.r.l.');

const pspUnsignedAdmin = mockedParties.find((party) => party.description === 'PSP Admin unsigned');
