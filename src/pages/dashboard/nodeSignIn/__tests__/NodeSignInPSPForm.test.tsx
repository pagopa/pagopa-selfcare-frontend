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

beforeEach(() => {
  createPSPDirectMocked = jest.spyOn(
    require('../../../../services/nodeService'),
    'createPSPDirect'
  );
  useSigninDataMocked = jest.spyOn(require('../../../../hooks/useSigninData'), 'useSigninData');

  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('NodeSignInPSPForm', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test rendering NodeSignInPSPForm and Sumbit', async () => {
    renderApp();

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

    await waitFor(() => expect(createPSPDirectMocked).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(useSigninDataMocked).toHaveBeenCalled());
  });

  test('Test rendering NodeSignInPSPForm with pspNodeData and Sumbit', async () => {
    renderApp(undefined, undefined, pspNodeData);

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
    await waitFor(() => expect(createPSPDirectMocked).toHaveBeenCalled());
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
