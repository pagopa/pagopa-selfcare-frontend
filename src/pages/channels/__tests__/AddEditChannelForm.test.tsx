import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import AddEditChannelForm from '../addEditChannel/AddEditChannelForm';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { createStore } from '../../../redux/store';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { PortalApi } from '../../../api/__mocks__/PortalApiClient';
import { ChannelDetailsResource } from '../../../api/generated/portal/ChannelDetailsResource';
import { mockedPSPChannels } from '../../../services/__mocks__/channelService';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
  Trans: () => {
    return null;
  },
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

jest.mock('@pagopa/selfcare-common-frontend', () => ({
  useErrorDispatcher: () => '',
  useLoading: () => jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditChannelForm />', (injectedHistory?: ReturnType<
  typeof createMemoryHistory
>, injectedStore?: ReturnType<typeof createStore>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  const store = injectedStore ? injectedStore : createStore();

  test('Test rendering AddEditChannelForm', async () => {
    PortalApi.createChannel = async (): Promise<ChannelDetailsResource> =>
      new Promise((resolve) => resolve(mockedPSPChannels));

    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm goBack={jest.fn()} formAction={'create'} />
          </ThemeProvider>
        </Router>
      </Provider>
    );

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
    fireEvent.change(paymentType, { target: { value: 'HTTPS' } });

    const continueBtn = screen.getByText('addEditChannelPage.addForm.continueButton');
    fireEvent.click(continueBtn);

    const confirmModalBtn = await screen.findByTestId('confirm-button-test');
    const cancelModalBtn = await screen.findByTestId('cancel-button-test');

    expect(confirmModalBtn).toBeInTheDocument();

    fireEvent.click(confirmModalBtn);

    fireEvent.click(cancelModalBtn);
  });

  test('catch case of createChannel', async () => {
    PortalApi.createChannel = async (): Promise<ChannelDetailsResource> =>
      Promise.reject('catch case of createChannel');
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditChannelForm goBack={jest.fn()} formAction={'create'} />
          </ThemeProvider>
        </Router>
      </Provider>
    );
  });
});
