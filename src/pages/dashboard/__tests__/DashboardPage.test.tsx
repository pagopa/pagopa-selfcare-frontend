import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import * as reduxHooks from '../../../redux/hooks';

import { Provider } from 'react-redux';

import { verifyMockExecution as verifyLoginMockExecution } from '../../../decorators/__mocks__/withLogin';
import { verifyMockExecution as verifyPartiesMockExecution } from '../../../decorators/__mocks__/withParties';
import { verifyMockExecution as verifySelectedPartyProductsMockExecution } from '../../../decorators/__mocks__/withSelectedPartyProducts';
import { createMemoryHistory } from 'history';
// import { mockedParties } from '../services/__mocks__/partyService';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '../../../locale';
import { BrowserRouter } from 'react-router-dom';

import DashboardPage from '../DashboardPage';
import { createStore } from '../../../redux/store';

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
    payload: pspPartySelected,
  });
  expect(
    screen.getByRole('link', {
      name: /completa registrazione/i,
    })
  ).toBeVisible();
});

test('Test not admin', async () => {
  const { store } = renderApp();
  store.dispatch({
    type: 'parties/setPartySelected',
    payload: pspPartyNotAdminSelected,
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

const pspPartyNotAdminSelected = {
  partyId: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944',
  externalId: '15376371009',
  originId: 'PAGOPASPA',
  origin: 'SELC',
  description: 'PagoPA S.p.A.',
  fiscalCode: '15376371009',
  digitalAddress: 'selfcare@pec.pagopa.it',
  status: 'ACTIVE',
  registeredOffice: 'Piazza Colonna, 370',
  roles: [
    {
      partyRole: 'DELEGATE',
      roleKey: 'operator',
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
