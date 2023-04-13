import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { FormAction } from '../../../model/Channel';
import { store } from '../../../redux/store';
import { mockedPaymentTypes } from '../../../services/__mocks__/channelService';
import AddEditChannelForm from '../addEditChannel/AddEditChannelForm';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { Redirect_protocolEnum } from '../../../api/generated/portal/ChannelDetailsDto';
import { PortalApi } from '../../../api/PortalApiClient';
import { PaymentTypesResource } from '../../../api/generated/portal/PaymentTypesResource';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditChannelForm />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test rendering AddEditChannelForm', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm
              goBack={jest.fn()}
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
    const redirectProtocol = screen.getByTestId('redirect-protocol-test') as HTMLSelectElement;
    const redirectPort = screen.getByTestId('redirect-port-test') as HTMLInputElement;
    const redirectService = screen.getByTestId('redirect-service-test') as HTMLInputElement;
    const redirectIp = screen.getByTestId('redirect-ip-test') as HTMLInputElement;
    const redirectParameters = screen.getByTestId('redirect-parameters-test') as HTMLInputElement;
    const targetAddress = screen.getByTestId('target-address-test') as HTMLInputElement;
    const targetService = screen.getByTestId('target-service-test') as HTMLInputElement;
    const targetPort = screen.getByTestId('target-port-test') as HTMLInputElement;
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

    fireEvent.click(redirectProtocol);
    fireEvent.change(redirectProtocol, { target: { value: Redirect_protocolEnum.HTTP } });

    fireEvent.click(redirectPort);
    fireEvent.change(redirectPort, { target: { value: undefined } });

    fireEvent.click(redirectPort);
    fireEvent.change(redirectPort, { target: { value: 555 } });

    fireEvent.click(redirectService);
    fireEvent.change(redirectService, { target: { value: 'redirectService' } });
    expect(redirectService.value).toBe('redirectService');

    fireEvent.click(redirectIp);
    fireEvent.change(redirectIp, { target: { value: 'redirectIp' } });
    expect(redirectIp.value).toBe('redirectIp');

    fireEvent.click(redirectParameters);
    fireEvent.change(redirectParameters, { target: { value: 'redirectParameters' } });
    expect(redirectParameters.value).toBe('redirectParameters');

    fireEvent.click(targetAddress);
    fireEvent.change(targetAddress, { target: { value: 'redirectAddress' } });
    expect(targetAddress.value).toBe('redirectAddress');

    fireEvent.click(targetService);
    fireEvent.change(targetService, { target: { value: 'redirectService' } });
    expect(targetService.value).toBe('redirectService');

    fireEvent.click(targetPort);
    fireEvent.change(targetPort, { target: { value: undefined } });

    fireEvent.click(targetPort);
    fireEvent.change(targetPort, { target: { value: 555 } });

    fireEvent.click(paymentType);
    fireEvent.change(paymentType, {
      target: { value: mockedPaymentTypes.payment_types[0].description },
    });

    expect(continueBtn).not.toBeDisabled();

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
              goBack={jest.fn()}
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
              goBack={jest.fn()}
              formAction={FormAction.Create}
              selectedParty={mockedParties[0]}
              channelCode={'14847241008_01'}
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
              goBack={jest.fn()}
              formAction={FormAction.Edit}
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
              goBack={jest.fn()}
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
    const redirectProtocol = screen.getByTestId('redirect-protocol-test') as HTMLSelectElement;
    const redirectPort = screen.getByTestId('redirect-port-test') as HTMLInputElement;
    const redirectService = screen.getByTestId('redirect-service-test') as HTMLInputElement;
    const redirectIp = screen.getByTestId('redirect-ip-test') as HTMLInputElement;
    const redirectParameters = screen.getByTestId('redirect-parameters-test') as HTMLInputElement;
    const targetAddress = screen.getByTestId('target-address-test') as HTMLInputElement;
    const targetService = screen.getByTestId('target-service-test') as HTMLInputElement;
    const targetPort = screen.getByTestId('target-port-test') as HTMLInputElement;
    const paymentType = screen.getByTestId('payment-type-test') as HTMLSelectElement;
    const continueBtn = screen.getByText('addEditChannelPage.addForm.continueButton');

    expect(businessName.value).toBe(mockedParties[0].description);
    expect(pspBrokerCode.value).toBe(mockedParties[0].fiscalCode);
    expect(channelCode.value).toBe(`${mockedParties[0].fiscalCode}_01`);

    fireEvent.click(redirectProtocol);
    fireEvent.change(redirectProtocol, { target: { value: Redirect_protocolEnum.HTTP } });

    fireEvent.change(redirectPort, { target: { value: '0' } });
    fireEvent.change(redirectPort, { target: { value: '555' } });

    fireEvent.change(redirectService, { target: { value: 'redirectService' } });
    expect(redirectService.value).toBe('redirectService');

    fireEvent.change(redirectIp, { target: { value: 'redirectIp' } });
    expect(redirectIp.value).toBe('redirectIp');

    fireEvent.change(redirectParameters, { target: { value: 'redirectParameters' } });
    expect(redirectParameters.value).toBe('redirectParameters');

    fireEvent.change(targetAddress, { target: { value: 'redirectAddress' } });
    expect(targetAddress.value).toBe('redirectAddress');

    fireEvent.change(targetService, { target: { value: 'redirectService' } });
    expect(targetService.value).toBe('redirectService');

    fireEvent.change(targetPort, { target: { value: '0' } });
    fireEvent.change(targetPort, { target: { value: '555' } });

    fireEvent.click(paymentType);
    fireEvent.change(paymentType, {
      target: { value: mockedPaymentTypes.payment_types[0].description },
    });

    expect(continueBtn).not.toBeDisabled();
    fireEvent.click(continueBtn);

    const confirmBtn = screen.queryByTestId('confirm-button-test') as HTMLButtonElement;
    const cancelBtn = screen.queryByTestId('cancel-button-test') as HTMLButtonElement;

    userEvent.click(cancelBtn);
    fireEvent.click(continueBtn);

    userEvent.click(confirmBtn);
  });
});
