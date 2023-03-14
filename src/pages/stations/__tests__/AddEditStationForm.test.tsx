import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import AddEditStationForm from '../addEditStation/AddEditStationForm';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { createStore } from '../../../redux/store';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
  Trans: () => {
    return null;
  },
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditStationForm />', (injectedHistory?: ReturnType<
  typeof createMemoryHistory
>, injectedStore?: ReturnType<typeof createStore>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  const store = injectedStore ? injectedStore : createStore();
  test('Test rendering AddEditStationForm', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditStationForm />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    const overviewBackBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    const oldLocPathname = history.location.pathname;
    fireEvent.click(overviewBackBtn);
    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());

    // const stationCode = screen.getByTestId('station-code-test') as HTMLInputElement;
    const primitiveVersion = screen.getByTestId('primitive-version-test') as HTMLInputElement;
    const redirectProtocol = screen.getByTestId('redirect-protocol-test') as HTMLSelectElement;
    const redirectPort = screen.getByTestId('redirect-port-test') as HTMLInputElement;
    const redirectService = screen.getByTestId('redirect-service-test') as HTMLInputElement;
    const redirectIp = screen.getByTestId('redirect-ip-test') as HTMLInputElement;
    const redirectParameters = screen.getByTestId('redirect-parameters-test') as HTMLInputElement;
    const targetAddress = screen.getByTestId('target-address-test') as HTMLInputElement;
    const targetService = screen.getByTestId('target-service-test') as HTMLInputElement;
    const targetPort = screen.getByTestId('target-port-test') as HTMLInputElement;

    // fireEvent.change(stationCode, { target: { value: 'station Code' } });
    // expect(stationCode.value).toBe('primitive version');

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
  });
});
