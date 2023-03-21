import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../../redux/store';
import AddEditStationForm from '../addEditStation/AddEditStationForm';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('AddEditStationForm ', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test rendering AddEditStationForm', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm goBack={jest.fn()} formAction={''} />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const stationCode = screen.getByTestId('station-code-test') as HTMLInputElement;
    const primitiveVersion = screen.getByTestId('primitive-version-test') as HTMLInputElement;
    const redirectProtocol = screen.getByTestId('redirect-protocol-test') as HTMLSelectElement;
    const redirectPort = screen.getByTestId('redirect-port-test') as HTMLInputElement;
    const redirectService = screen.getByTestId('redirect-service-test') as HTMLInputElement;
    const redirectIp = screen.getByTestId('redirect-ip-test') as HTMLInputElement;
    const redirectParameters = screen.getByTestId('redirect-parameters-test') as HTMLInputElement;
    const targetAddress = screen.getByTestId('target-address-test') as HTMLInputElement;
    const targetService = screen.getByTestId('target-service-test') as HTMLInputElement;
    const targetPort = screen.getByTestId('target-port-test') as HTMLInputElement;

    fireEvent.change(stationCode, { target: { value: 'station Code' } });
    expect(stationCode.value).toBe('station Code');

    fireEvent.change(primitiveVersion, { target: { value: 'primitive Version' } });
    expect(primitiveVersion.value).toBe('primitive Version');

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

    const continueBtn = screen.getByText('addEditStationPage.addForm.continueButton');
    fireEvent.click(continueBtn);

    const confirmModalBtn = await screen.findByTestId('confirm-button-test');
    const cancelModalBtn = await screen.findByTestId('cancel-button-test');

    fireEvent.click(confirmModalBtn);
    fireEvent.click(cancelModalBtn);

    const overviewBackBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    const oldLocPathname = history.location.pathname;
    fireEvent.click(overviewBackBtn);
    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());
  });
});
