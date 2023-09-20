import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
// import { mockedParties } from '../services/__mocks__/partyService';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '../../../locale';
import { BrowserRouter } from 'react-router-dom';

import DashboardPage from '../DashboardPage';
import { createStore } from '../../../redux/store';
import { mockedParties } from '../../../services/__mocks__/partyService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

jest.mock('../../../decorators/withLogin');
jest.mock('../../../decorators/withParties');
jest.mock('../../../decorators/withSelectedParty');
jest.mock('../../../decorators/withSelectedPartyProducts');

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
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

test('Test rendering', async () => {
  const { store } = renderApp();
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspPartySelected,
    })
  );
  expect(screen.getByText(/istituti di pagamento/i)).toBeVisible();
});

test('Test rendering button', async () => {
  const { store } = renderApp();
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
  const { store } = renderApp();
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
  urlLogo: 'http://checkout.selfcare/institutions/26a0aabf-ce6a-4dfa-af4e-d4f744a8b944/logo.png',
  typology: 'TODO',
  pspData: {
    businessRegisterNumber: '00000000000',
    legalRegisterName: 'ISTITUTI DI PAGAMENTO',
    legalRegisterNumber: '09878',
    abiCode: '36042',
    vatNumberGroup: false,
  },
};

const pspUnsignedOperator = mockedParties.find(
  (party) => party.description === 'PSP Operator unsigned'
);

const pspUnsignedAdmin = mockedParties.find((party) => party.description === 'PSP Admin unsigned');
