import React from 'react';
import {render, screen} from '@testing-library/react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {createStore} from '../../redux/store';
import Header from '../Header';
import {Party} from '../../model/Party';
import {ROLE} from "../../model/RolePermission";
import * as useUserRole from "../../hooks/useUserRole";

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
  jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
    userRole: ROLE.PSP_ADMIN,
    userIsPspAdmin: false,
    userIsEcAdmin: false,
    userIsPspDirectAdmin: false,
    userIsPagopaOperator: false,
    userIsAdmin: true
  });
  const { store } = renderApp(partyMocked);
});

test('Test rendering with role psp admin', async () => {
  jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
    userRole: ROLE.PSP_ADMIN,
    userIsPspAdmin: false,
    userIsEcAdmin: false,
    userIsPspDirectAdmin: false,
    userIsPagopaOperator: false,
    userIsAdmin: true
  });  const { store } = renderApp({
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
  jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
    userRole: ROLE.PSP_ADMIN,
    userIsPspAdmin: false,
    userIsEcAdmin: false,
    userIsPspDirectAdmin: false,
    userIsPagopaOperator: false,
    userIsAdmin: false
  });  const { store } = renderApp({
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
  jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
    userRole: ROLE.PSP_ADMIN,
    userIsPspAdmin: false,
    userIsEcAdmin: false,
    userIsPspDirectAdmin: false,
    userIsPagopaOperator: false,
    userIsAdmin: false,
  });
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
  jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
    userRole: ROLE.PSP_ADMIN,
    userIsPspAdmin: false,
    userIsEcAdmin: false,
    userIsPspDirectAdmin: false,
    userIsPagopaOperator: false,
    userIsAdmin: false,
  });  const { store } = renderApp({
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

// test('Test rendering with role pagopa operator', async () => {
//   (isOperator as jest.Mock).mockReturnValue(true);
//   const { store } = renderApp({
//     ...partyMocked,
//     institutionType: 'PA',
//     roles: [
//       {
//         partyRole: 'DELEGATE',
//         roleKey: 'operator',
//       },
//     ],
//   });
//   const role = screen.getByText('roles.pagopaOperator');
//   expect(role).toBeInTheDocument();
// });

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
  urlLogo: 'https://checkout.selfcare/institutions/26a0aabf-ce6a-4dfa-af4e-d4f744a8b944/logo.png',
  pspData: {
    business_register_number: '00000000000',
    legal_register_name: 'ISTITUTI DI PAGAMENTO',
    legal_register_number: '09878',
    abi_code: '36042',
    vat_number_group: false,
  },
};
