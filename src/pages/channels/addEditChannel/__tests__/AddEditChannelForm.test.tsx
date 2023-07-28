import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { FormAction } from '../../../../model/Channel';
import { store } from '../../../../redux/store';
import AddEditChannelForm from '../AddEditChannelForm';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import {
  ChannelDetailsDto,
  ProtocolEnum,
  Redirect_protocolEnum,
  StatusEnum,
} from '../../../../api/generated/portal/ChannelDetailsDto';
import { PortalApi } from '../../../../api/PortalApiClient';
import { Party } from '../../../../model/Party';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditChannelForm />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  const adminUser: Array<Party> = [
    {
      partyId: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944',
      externalId: '14847241008',
      originId: 'PSP_14847241008',
      origin: 'SELC',
      description: 'PSP S.p.A.',
      fiscalCode: '14847241008',
      digitalAddress: 'pspspa@test.dummy',
      status: 'ACTIVE',
      registeredOffice: 'VIA DEI PSP 20, ROMA',
      roles: [
        {
          partyRole: 'DELEGATE',
          roleKey: 'admin',
        },
      ],
      urlLogo:
        'http://checkout.selfcare/institutions/26a0aabf-ce6a-4dfa-af4e-d4f744a8b944/logo.png',
      institutionType: 'PSP',
      pspData: {
        businessRegisterNumber: '00000000000',
        legalRegisterName: 'ISTITUTI DI PAGAMENTO',
        legalRegisterNumber: '09878',
        abiCode: '36042',
        vatNumberGroup: false,
      },
    },
  ];

  const operatorUser: Array<Party> = [
    {
      partyId: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944',
      externalId: '14847241008',
      originId: 'PSP_14847241008',
      origin: 'SELC',
      description: 'PSP S.p.A.',
      fiscalCode: '14847241008',
      digitalAddress: 'pspspa@test.dummy',
      status: 'ACTIVE',
      registeredOffice: 'VIA DEI PSP 20, ROMA',
      roles: [
        {
          partyRole: 'DELEGATE',
          roleKey: 'operator', // TODO use real product role
        },
      ],
      urlLogo:
        'http://checkout.selfcare/institutions/26a0aabf-ce6a-4dfa-af4e-d4f744a8b944/logo.png',
      institutionType: 'PSP',
      pspData: {
        businessRegisterNumber: '00000000000',
        legalRegisterName: 'ISTITUTI DI PAGAMENTO',
        legalRegisterNumber: '09878',
        abiCode: '36042',
        vatNumberGroup: false,
      },
    },
  ];

  test('Test rendering AddEditChannelForm', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm
              formAction={FormAction.Duplicate}
              selectedParty={mockedParties[0]}
              channelCode={`${mockedParties[0].fiscalCode}_01`}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );
    const businessName = screen.getByTestId('business-name-test') as HTMLInputElement;
    const pspBrokerCode = screen.getByTestId('psp-brokercode-test') as HTMLInputElement;
    const channelCode = screen.getByTestId('channel-code-test') as HTMLInputElement;
    const targetUnion = screen.getByTestId('target-union-test') as HTMLInputElement;
    const paymentType = screen.getByTestId('payment-type-test') as HTMLSelectElement;
    const continueBtn = screen.getByText(
      'addEditChannelPage.addForm.continueButton'
    ) as HTMLButtonElement;

    expect(businessName.value).toBe(mockedParties[0].description);
    expect(pspBrokerCode.value).toBe(mockedParties[0].fiscalCode);
    expect(channelCode.value).toBe(`${mockedParties[0].fiscalCode}_01`);

    fireEvent.click(businessName);
    fireEvent.change(businessName, { target: { value: 'businessName' } });
    expect(businessName.value).toBe('businessName');

    fireEvent.click(pspBrokerCode);
    fireEvent.change(pspBrokerCode, { target: { value: 'pspBrokerCode' } });
    expect(pspBrokerCode.value).toBe('pspBrokerCode');

    fireEvent.click(channelCode);
    fireEvent.change(channelCode, { target: { value: 'channelCode' } });
    expect(channelCode.value).toBe('channelCode');

    fireEvent.click(targetUnion);
    fireEvent.change(targetUnion, { target: { value: 'https://www.testTarget.it/path' } });
    expect(targetUnion.value).toBe('https://www.testTarget.it/path');

    fireEvent.click(paymentType);
    fireEvent.change(paymentType, { target: { value: 'Option 1' } });

    fireEvent.click(continueBtn);

    const confirmBtn = screen.queryByTestId('confirm-button-test') as HTMLButtonElement;
    const cancelBtn = screen.queryByTestId('cancel-button-test') as HTMLButtonElement;

    userEvent.click(cancelBtn);
    fireEvent.click(continueBtn);

    userEvent.click(confirmBtn);
  });

  test('test catch case api getPaymentTypes', async () => {
    PortalApi.getPaymentTypes = async (): Promise<any> => Promise.reject();
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm
              formAction={FormAction.Create}
              selectedParty={mockedParties[0]}
              channelCode={`${mockedParties[0].fiscalCode}_01`}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );
  });

  test('Test rendering AddEditChannelForm with formAction duplicate', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm
              formAction={FormAction.Create}
              selectedParty={mockedParties[0]}
              channelCode={'14847241008_01'}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );
  });

  test('Test rendering AddEditChannelForm with formAction edit', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm
              formAction={FormAction.Edit}
              selectedParty={mockedParties[0]}
              channelCode={'14847241008_01'}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );
  });

  test('Test rendering AddEditChannelForm with formAction Create', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm
              formAction={FormAction.Create}
              selectedParty={mockedParties[0]}
              channelCode={'14847241008_01'}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );
  });

  test('Test rendering AddEditChannelForm with formAction Create', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm
              formAction={FormAction.Create}
              selectedParty={adminUser[0]}
              channelCode={`${mockedParties[0].fiscalCode}_01`}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    const businessName = screen.getByTestId('business-name-test') as HTMLInputElement;
    const pspBrokerCode = screen.getByTestId('psp-brokercode-test') as HTMLInputElement;
    const channelCode = screen.getByTestId('channel-code-test') as HTMLInputElement;
    const targetUnion = screen.getByTestId('target-union-test') as HTMLInputElement;
    const paymentType = screen.getByTestId('payment-type-test') as HTMLSelectElement;
    const continueBtn = screen.getByText('addEditChannelPage.addForm.continueButton');
    const backButton = screen.getByTestId('back-btn-test') as HTMLButtonElement;

    expect(businessName.value).toBe(mockedParties[0].description);
    expect(pspBrokerCode.value).toBe(mockedParties[0].fiscalCode);
    expect(channelCode.value).toBe(`${mockedParties[0].fiscalCode}_01`);

    fireEvent.click(targetUnion);
    fireEvent.change(targetUnion, { target: { value: 'https://www.testTarget.it/path' } });
    expect(targetUnion.value).toBe('https://www.testTarget.it/path');

    paymentType.value = 'Option 1';

    fireEvent.change(paymentType);
    expect(paymentType.value).toBe('Option 1');

    fireEvent.click(continueBtn);

    const confirmBtn = screen.getByText(
      'addEditChannelPage.addForm.continueButton'
    ) as HTMLButtonElement;
    const cancelBtn = screen.getByText(
      'addEditChannelPage.addForm.backButton'
    ) as HTMLButtonElement;

    fireEvent.click(cancelBtn);
    fireEvent.click(continueBtn);

    fireEvent.click(confirmBtn);

    fireEvent.click(continueBtn);

    fireEvent.click(backButton);
  });

  test('Test Multipayment methods add/remove', async () => {
    const channelDetail: ChannelDetailsDto = {
      broker_psp_code: '97735020584',
      broker_description: 'AgID - Agenzia per l’Italia Digitale',
      channel_code: `${mockedParties[0].fiscalCode}_01`,
      target_path: '/govpay/api/pagopa/PagamentiTelematiciCCPservice',
      target_port: 443,
      target_host: 'www.lab.link.it',
      payment_types: ['PPAY'],
      status: StatusEnum.TO_CHECK,
    };

    const { getByTestId, getAllByTestId } = render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm
              formAction={FormAction.Edit}
              selectedParty={operatorUser[0]}
              channelCode={`${mockedParties[0].fiscalCode}_01`}
              channelDetail={channelDetail}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    const addPaymentType = getByTestId('add-payment-test') as HTMLButtonElement;

    fireEvent.click(addPaymentType);
    await waitFor(() => {
      const paymentType = getAllByTestId('payment-type-test');
      expect(paymentType).toHaveLength(2);
    });

    fireEvent.click(addPaymentType);

    await waitFor(() => {
      const paymentType = getAllByTestId('payment-type-test');
      expect(paymentType).toHaveLength(3);

      const deletePaymentMethod = getAllByTestId('remove-payment-method') as HTMLButtonElement[];
      if (deletePaymentMethod.length > 0) {
        fireEvent.click(deletePaymentMethod[0]);
      }
    });
  });

  test('Test of AddEditChannelValidationForm', async () => {
    const channelDetail: ChannelDetailsDto = {
      broker_psp_code: '97735020584',
      broker_description: 'AgID - Agenzia per l’Italia Digitale',
      channel_code: `${mockedParties[0].fiscalCode}_01`,
      target_path: '/govpay/api/pagopa/PagamentiTelematiciCCPservice',
      target_port: 443,
      target_host: 'www.lab.link.it',
      payment_types: ['PPAY'],
      status: StatusEnum.TO_CHECK,
    };

    const { getByTestId, getByText, container } = render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm
              formAction={FormAction.Edit}
              selectedParty={operatorUser[0]}
              channelCode={`${mockedParties[0].fiscalCode}_01`}
              channelDetail={channelDetail}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    const primitiveVersion = getByTestId('primitive-version-test') as HTMLInputElement;
    const password = getByTestId('password-test') as HTMLInputElement;
    const newConnection = getByTestId('new-connection-channel') as HTMLInputElement;
    const timeoutA = getByTestId('timeout-a-test') as HTMLInputElement;
    const timeoutB = getByTestId('timeout-b-test') as HTMLInputElement;
    const timeoutC = getByTestId('timeout-c-test') as HTMLInputElement;
    const continueBtn = getByText('addEditChannelPage.addForm.continueButton');
    const backButton = getByTestId('back-btn-test') as HTMLButtonElement;

    fireEvent.change(primitiveVersion, { target: { value: undefined } });
    fireEvent.change(primitiveVersion, { target: { value: 1 } });

    fireEvent.change(password, { target: { value: 1 } });

    fireEvent.change(newConnection, {
      target: { value: 'https://api.uat.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward' },
    });

    fireEvent.change(timeoutA, { target: { value: 10 } });

    fireEvent.change(timeoutB, { target: { value: 20 } });

    fireEvent.change(timeoutC, { target: { value: 30 } });

    fireEvent.click(continueBtn);

    const confirmBtn = screen.queryByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'button' &&
        element.textContent === 'addEditChannelPage.confirmModal.confirmButtonOpe'
    ) as HTMLButtonElement;

    const cancelBtn = screen.queryByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'button' &&
        element.textContent === 'addEditChannelPage.confirmModal.cancelButton'
    ) as HTMLButtonElement;

    if (cancelBtn) {
      fireEvent.click(cancelBtn);
    }

    fireEvent.click(continueBtn);

    if (confirmBtn) {
      fireEvent.click(confirmBtn);
    }

    fireEvent.click(backButton);
  });

  test('Test Multipayment methods add/remove', async () => {
    const channelDetail: ChannelDetailsDto = {
      broker_psp_code: '97735020584',
      broker_description: 'AgID - Agenzia per l’Italia Digitale',
      channel_code: `${mockedParties[0].fiscalCode}_01`,
      target_path: '/govpay/api/pagopa/PagamentiTelematiciCCPservice',
      target_port: 443,
      target_host: 'www.lab.link.it',
      payment_types: ['PPAY'],
      status: StatusEnum.TO_CHECK,
    };

    const { getByTestId, getAllByTestId } = render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm
              formAction={FormAction.Edit}
              selectedParty={mockedParties[0]}
              channelCode={`${mockedParties[0].fiscalCode}_01`}
              channelDetail={channelDetail}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    const addPaymentType = getByTestId('add-payment-test') as HTMLButtonElement;

    fireEvent.click(addPaymentType);
    await waitFor(() => {
      const paymentType = getAllByTestId('payment-type-test');
      expect(paymentType).toHaveLength(2);
    });

    fireEvent.click(addPaymentType);

    await waitFor(() => {
      const paymentType = getAllByTestId('payment-type-test');
      expect(paymentType).toHaveLength(3);

      const deletePaymentMethod = getAllByTestId('remove-payment-method') as HTMLButtonElement[];
      if (deletePaymentMethod.length > 0) {
        fireEvent.click(deletePaymentMethod[0]);
      }
    });
  });

  test('Test of AddEditChannelValidationForm', async () => {
    const channelDetail: ChannelDetailsDto = {
      broker_psp_code: '97735020584',
      broker_description: 'AgID - Agenzia per l’Italia Digitale',
      channel_code: `${mockedParties[0].fiscalCode}_01`,
      target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
      target_port: 8081,
      target_host: ' lab.link.it',
      payment_types: ['PPAY'],
      status: StatusEnum.TO_CHECK,
    };

    const { getByTestId, getByText, container } = render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm
              formAction={FormAction.Edit}
              selectedParty={operatorUser[0]}
              channelCode={`${mockedParties[0].fiscalCode}_01`}
              channelDetail={channelDetail}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    const primitiveVersion = getByTestId('primitive-version-test') as HTMLInputElement;
    const password = getByTestId('password-test') as HTMLInputElement;
    const newConnection = getByTestId('new-connection-channel') as HTMLInputElement;
    const timeoutA = getByTestId('timeout-a-test') as HTMLInputElement;
    const timeoutB = getByTestId('timeout-b-test') as HTMLInputElement;
    const timeoutC = getByTestId('timeout-c-test') as HTMLInputElement;
    const continueBtn = getByText('addEditChannelPage.addForm.continueButton');
    const backButton = getByTestId('back-btn-test') as HTMLButtonElement;

    fireEvent.change(primitiveVersion, { target: { value: undefined } });
    fireEvent.change(primitiveVersion, { target: { value: 1 } });

    fireEvent.change(password, { target: { value: 1 } });

    fireEvent.change(newConnection, {
      target: { value: 'https://api.uat.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward' },
    });

    fireEvent.change(timeoutA, { target: { value: 10 } });

    fireEvent.change(timeoutB, { target: { value: 20 } });

    fireEvent.change(timeoutC, { target: { value: 30 } });

    fireEvent.click(continueBtn);

    const confirmBtn = screen.queryByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'button' &&
        element.textContent === 'addEditChannelPage.confirmModal.confirmButtonOpe'
    ) as HTMLButtonElement;

    const cancelBtn = screen.queryByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'button' &&
        element.textContent === 'addEditChannelPage.confirmModal.cancelButton'
    ) as HTMLButtonElement;

    if (cancelBtn) {
      fireEvent.click(cancelBtn);
    }

    fireEvent.click(continueBtn);

    if (confirmBtn) {
      fireEvent.click(confirmBtn);
    }

    fireEvent.click(backButton);
  });
});
