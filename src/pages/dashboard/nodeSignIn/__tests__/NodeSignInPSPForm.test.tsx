import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, store } from '../../../../redux/store';
import NodeSignInPSPForm from '../NodeSignInPSPForm';
import { PortalApi } from '../../../../api/PortalApiClient';
import { CreditorInstitutionDetailsResource } from '../../../../api/generated/portal/CreditorInstitutionDetailsResource';
import { PaymentServiceProviderDetailsResource } from '../../../../api/generated/portal/PaymentServiceProviderDetailsResource';

let createPSPDirectMocked: jest.SpyInstance;
let useSigninDataMocked: jest.SpyInstance;
let updatePSPInfoMocked: jest.SpyInstance;

jest.mock('../../../../decorators/withSelectedParty');

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>,
  pspNodeData?: PaymentServiceProviderDetailsResource
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <NodeSignInPSPForm goBack={jest.fn()} pspNodeData={pspNodeData} />
        </Router>
      </ThemeProvider>
    </Provider>
  );
  return { store, history };
};

const setupFormAndSubmit = async (store) => {
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: pspPartySelected,
    })
  );
  const name = screen.getByTestId('name-test') as HTMLInputElement;
  const businessName = screen.getByTestId('businessName-test') as HTMLInputElement;
  const fiscalCode = screen.getByTestId('fiscalCode-test') as HTMLSelectElement;
  const abiCode = screen.getByTestId('abiCode-test') as HTMLInputElement;
  const pspCode = screen.getByTestId('pspCode-test') as HTMLInputElement;
  const bicCode = screen.getByTestId('bicCode-test') as HTMLInputElement;
  const digitalStampRadioTrue = screen.getByTestId('digitalStamp-true-test');

  fireEvent.change(bicCode, { target: { value: '1234' } });
  expect(bicCode.value).toBe('1234');

  fireEvent.click(digitalStampRadioTrue);

  const confirmBtn = await screen.findByTestId('continue-button-test');
  fireEvent.click(confirmBtn);
};

beforeEach(() => {
  createPSPDirectMocked = jest.spyOn(
    require('../../../../services/nodeService'),
    'createPSPDirect'
  );
  useSigninDataMocked = jest.spyOn(require('../../../../hooks/useSigninData'), 'useSigninData');
  updatePSPInfoMocked = jest.spyOn(require('../../../../services/nodeService'), 'updatePSPInfo');

  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('NodeSignInPSPForm', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test rendering NodeSignInPSPForm and Sumbit', async () => {
    const { store } = renderApp();

    await setupFormAndSubmit(store);

    await waitFor(() => expect(createPSPDirectMocked).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(useSigninDataMocked).toHaveBeenCalled());
  });

  test('Test rendering NodeSignInPSPForm with pspNodeData and Sumbit the update', async () => {
    const { store } = renderApp(undefined, undefined, pspNodeData);

    await setupFormAndSubmit(store);

    await waitFor(() => expect(createPSPDirectMocked).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(updatePSPInfoMocked).toHaveBeenCalled());
  });
});

const pspNodeData: PaymentServiceProviderDetailsResource = {
  abi: '12345',
  agid_psp: true,
  bic: '10101',
  my_bank_code: '',
  stamp: true,
  tax_code: '123123',
  vat_number: '12312312',
  business_name: 'PSP S.r.l',
  enabled: true,
  psp_code: '12312312',
};

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
