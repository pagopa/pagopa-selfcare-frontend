import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../redux/store';
import Header from '../Header';
import { Party } from '../../model/Party';
import { isOperator } from '../../pages/components/commonFunctions';
import { createStore } from '../../redux/store';
import { BrowserRouter } from 'react-router-dom';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

jest.mock('../../pages/components/commonFunctions.ts');

jest.mock('../../decorators/withLogin');
jest.mock('../../decorators/withParties');
jest.mock('../../decorators/withSelectedParty');
jest.mock('../../decorators/withSelectedPartyProducts');

const renderApp = (
  party: Party,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Header onExit={() => {}} parties={[party]} />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
  return { store, history };
};

test('Test rendering', async () => {
  (isOperator as jest.Mock).mockReturnValue(false);
  const { store } = renderApp(partyMocked);
});

test('Test rendering with role psp admin', async () => {
  (isOperator as jest.Mock).mockReturnValue(false);
  const { store } = renderApp({
    ...partyMocked,
    institutionType: 'PSP',
    roles: [
      {
        partyRole: 'DELEGATE',
        roleKey: 'admin',
      },
    ],
  });
  const role = screen.getByText('roles.pspAdmin');
  expect(role).toBeInTheDocument();
});

test('Test rendering with role psp operator', async () => {
  (isOperator as jest.Mock).mockReturnValue(false);
  const { store } = renderApp({
    ...partyMocked,
    institutionType: 'PSP',
    roles: [
      {
        partyRole: 'DELEGATE',
        roleKey: 'operator',
      },
    ],
  });
  const role = screen.getByText('roles.pspOperator');
  expect(role).toBeInTheDocument();
});

test('Test rendering with role ec admin', async () => {
  (isOperator as jest.Mock).mockReturnValue(false);
  const { store } = renderApp({
    ...partyMocked,
    institutionType: 'PA',
    roles: [
      {
        partyRole: 'DELEGATE',
        roleKey: 'admin',
      },
    ],
  });
  const role = screen.getByText('roles.ecAdmin');
  expect(role).toBeInTheDocument();
});

test('Test rendering with role ec operator', async () => {
  (isOperator as jest.Mock).mockReturnValue(false);
  const { store } = renderApp({
    ...partyMocked,
    institutionType: 'PA',
    roles: [
      {
        partyRole: 'DELEGATE',
        roleKey: 'operator',
      },
    ],
  });
  const role = screen.getByText('roles.ecOperator');
  expect(role).toBeInTheDocument();
});

test('Test rendering with role pagopa operator', async () => {
  (isOperator as jest.Mock).mockReturnValue(true);
  const { store } = renderApp({
    ...partyMocked,
    institutionType: 'PA',
    roles: [
      {
        partyRole: 'DELEGATE',
        roleKey: 'operator',
      },
    ],
  });
  const role = screen.getByText('roles.pagopaOperator');
  expect(role).toBeInTheDocument();
});

const partyMocked: Party = {
  partyId: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944',
  externalId: '15376371009',
  originId: 'PAGOPASPA',
  origin: 'SELC',
  description: 'PagoPA2 S.p.A.',
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
  pspData: {
    businessRegisterNumber: '00000000000',
    legalRegisterName: 'ISTITUTI DI PAGAMENTO',
    legalRegisterNumber: '09878',
    abiCode: '36042',
    vatNumberGroup: false,
  },
};
