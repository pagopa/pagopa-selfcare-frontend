import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { FormAction } from '../../../model/Channel';
import { store } from '../../../redux/store';
import { mockedPaymentTypes } from '../../../services/__mocks__/channelService';
import AddEditChannelForm from '../addEditChannel/AddEditChannelForm';

let portalApiPostCreateChannelSpy: jest.SpyInstance;
let portalApiGetPaymentTypesSpy: jest.SpyInstance;
let portalApiPutUpdateChannel: jest.SpyInstance;
// let portalApiGetAssociatePSPtoChannel;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  portalApiPostCreateChannelSpy = jest.spyOn(
    require('../../../services/channelService'),
    'createChannel'
  );
  portalApiGetPaymentTypesSpy = jest.spyOn(
    require('../../../services/channelService'),
    'getPaymentTypes'
  );

  portalApiPutUpdateChannel = jest.spyOn(
    require('../../../services/channelService'),
    'updateChannel'
  );
  // portalApiGetAssociatePSPtoChannel = jest.spyOn(PortalApi, 'associatePSPtoChannel');
});

afterEach(cleanup);

describe('<AddEditChannelForm />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test rendering AddEditChannelForm', async () => {
    await waitFor(() =>
      render(
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <Router history={history}>
              <AddEditChannelForm goBack={jest.fn()} formAction={FormAction.Create} />
            </Router>
          </ThemeProvider>
        </Provider>
      )
    );

    await waitFor(() => {
      expect(portalApiGetPaymentTypesSpy).toHaveBeenCalledTimes(1);
    });

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

    fireEvent.change(channelCode, { target: { value: 'channel Code' } });
    expect(channelCode.value).toBe('channel Code');

    fireEvent.click(redirectProtocol);
    fireEvent.change(redirectProtocol, { target: { value: 'HTTPS' } });

    fireEvent.change(redirectPort, { target: { value: '' } });
    expect(redirectPort.value).toBe('');

    fireEvent.change(redirectPort, { target: { value: '555' } });
    expect(redirectPort.value).toBe('555');

    fireEvent.change(redirectService, { target: { value: 'redirect Service' } });
    expect(redirectService.value).toBe('redirect Service');

    fireEvent.change(redirectIp, { target: { value: 'redirect Ip' } });
    expect(redirectIp.value).toBe('redirect Ip');

    fireEvent.change(redirectParameters, { target: { value: 'redirect Parameters' } });
    expect(redirectParameters.value).toBe('redirect Parameters');

    fireEvent.change(targetAddress, { target: { value: 'redirect Address' } });
    expect(targetAddress.value).toBe('redirect Address');

    fireEvent.change(targetService, { target: { value: 'redirect Service' } });
    expect(targetService.value).toBe('redirect Service');

    fireEvent.change(targetPort, { target: { value: '555' } });
    expect(targetPort.value).toBe('555');

    fireEvent.click(paymentType);
    fireEvent.change(paymentType, { target: { value: mockedPaymentTypes[1] } });

    const continueBtn = screen.getByText('addEditChannelPage.addForm.continueButton');
    fireEvent.click(continueBtn);

    const confirmModalBtn = await screen.findByTestId('confirm-button-test');
    const cancelModalBtn = await screen.findByTestId('cancel-button-test');

    fireEvent.click(cancelModalBtn);
    fireEvent.click(continueBtn);

    fireEvent.click(confirmModalBtn);
    expect(portalApiPostCreateChannelSpy).toHaveBeenCalledTimes(1);
  });

  test('Test rendering AddEditChannelForm with formAction duplicate', async () => {
    await waitFor(() =>
      render(
        <Provider store={store}>
          <Router history={history}>
            <ThemeProvider theme={theme}>
              <AddEditChannelForm goBack={jest.fn()} formAction={FormAction.Duplicate} />
            </ThemeProvider>
          </Router>
        </Provider>
      )
    );
  });

  test('Test rendering AddEditChannelForm with formAction edit', async () => {
    await waitFor(() =>
      render(
        <Provider store={store}>
          <Router history={history}>
            <ThemeProvider theme={theme}>
              <AddEditChannelForm goBack={jest.fn()} formAction={FormAction.Edit} />
            </ThemeProvider>
          </Router>
        </Provider>
      )
    );
    await waitFor(() => {
      expect(portalApiGetPaymentTypesSpy).toHaveBeenCalledTimes(1);
    });

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
    fireEvent.change(channelCode, { target: { value: 'channel Code' } });
    expect(channelCode.value).toBe('channel Code');

    fireEvent.click(redirectProtocol);
    fireEvent.change(redirectProtocol, { target: { value: 'HTTPS' } });

    fireEvent.change(redirectPort, { target: { value: '' } });
    expect(redirectPort.value).toBe('');

    fireEvent.change(redirectPort, { target: { value: '555' } });
    expect(redirectPort.value).toBe('555');

    fireEvent.change(redirectService, { target: { value: 'redirect Service' } });
    expect(redirectService.value).toBe('redirect Service');

    fireEvent.change(redirectIp, { target: { value: 'redirect Ip' } });
    expect(redirectIp.value).toBe('redirect Ip');

    fireEvent.change(redirectParameters, { target: { value: 'redirect Parameters' } });
    expect(redirectParameters.value).toBe('redirect Parameters');

    fireEvent.change(targetAddress, { target: { value: 'redirect Address' } });
    expect(targetAddress.value).toBe('redirect Address');

    fireEvent.change(targetService, { target: { value: 'redirect Service' } });
    expect(targetService.value).toBe('redirect Service');

    fireEvent.change(targetPort, { target: { value: '555' } });
    expect(targetPort.value).toBe('555');

    fireEvent.click(paymentType);
    fireEvent.change(paymentType, { target: { value: mockedPaymentTypes[1] } });

    const continueBtn = screen.getByText('addEditChannelPage.addForm.continueButton');
    fireEvent.click(continueBtn);

    const confirmModalBtn = await screen.findByTestId('confirm-button-test');
    const cancelModalBtn = await screen.findByTestId('cancel-button-test');

    fireEvent.click(cancelModalBtn);
    fireEvent.click(continueBtn);

    fireEvent.click(confirmModalBtn);

    await waitFor(() => {
      expect(portalApiPutUpdateChannel).toHaveBeenCalledTimes(1);
    });
  });
});
