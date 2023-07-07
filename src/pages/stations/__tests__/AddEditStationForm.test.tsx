import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import {store} from '../../../redux/store';
import AddEditStationForm from '../addEditStation/AddEditStationForm';
import {StationFormAction, StationOnCreation} from '../../../model/Station';
import {WrapperStatusEnum} from '../../../api/generated/portal/StationDetailResource';
import {RedirectProtocolEnum} from '../../../api/generated/portal/StationDetailsDto';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('AddEditStationForm ', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  const stationDetail: StationOnCreation = {
    stationCode: '81001870922_06',
    enabled: true,
    brokerDescription: '',
    version: 1,
    associatedCreditorInstitutions: 0,
    activationDate: new Date('2023-06-07T16:30:26.384Z'),
    createdAt: new Date('2023-06-07T16:30:26.384Z'),
    modifiedAt: new Date('2023-06-07T16:30:26.384Z'),
    redirectIp: '11.22.44',
    redirectPath: 'Stazione/path/redirect/prova',
    redirectPort: 3333,
    redirectQueryString: 'nessuno',
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    brokerCode: '81001870922',
    threadNumber: 1,
    timeoutA: 15,
    timeoutB: 30,
    timeoutC: 120,
    targetHost: '33.55.66',
    targetPort: 4443,
    targetPath: 'Stazione/path/target/prova',
    primitiveVersion: 1,
    wrapperStatus: WrapperStatusEnum.APPROVED,
    password: 'password',
  };

  test('Test rendering AddEditStationForm with operator true and without stationDetail', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm goBack={jest.fn()} formAction={StationFormAction.Create} />
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
    const targetAddressPof = screen.getByTestId('target-address-pof-test') as HTMLInputElement;
    const targetServicePof = screen.getByTestId('target-service-pof-test') as HTMLInputElement;
    const targetPortPof = screen.getByTestId('target-port-pof-test') as HTMLInputElement;

    fireEvent.change(stationCode, { target: { value: 'station Code' } });
    expect(stationCode.value).toBe('station Code');

    fireEvent.change(primitiveVersion, { target: { value: 1 } });

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

    fireEvent.change(targetAddressPof, { target: { value: 'targetAddressPof' } });
    expect(targetAddressPof.value).toBe('targetAddressPof');

    fireEvent.change(targetServicePof, { target: { value: 'targetServicePof' } });
    expect(targetServicePof.value).toBe('targetServicePof');

    fireEvent.change(targetPortPof, { target: { value: '555' } });
    expect(targetPortPof.value).toBe('555');

    const continueBtn = screen.getByText('addEditStationPage.addForm.continueButton');
    fireEvent.click(continueBtn);

    const confirmBtn = screen.getByTestId('confirm-button-test');
    fireEvent.click(confirmBtn);

    fireEvent.click(continueBtn);

    const backBtn = screen.getByTestId('cancel-button-test');
    fireEvent.click(backBtn);
  });

  test('Test rendering AddEditStationForm with operator true', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm
              goBack={jest.fn()}
              stationDetail={stationDetail}
              formAction={StationFormAction.Edit}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const version = screen.getByTestId('version-test') as HTMLInputElement;
    const password = screen.getByTestId('password-test') as HTMLInputElement;
    const newPassword = screen.getByTestId('new-password-test') as HTMLInputElement;
    const protocol = screen.getByTestId('protocol-test') as HTMLSelectElement;
    const ip = screen.getByTestId('ip-test') as HTMLInputElement;
    const port = screen.getByTestId('port-test') as HTMLInputElement;
    const servicePof = screen.getByTestId('pof-service-test') as HTMLInputElement;
    const serviceNmp = screen.getByTestId('nmp-service-test') as HTMLInputElement;
    const protocol4Mod = screen.getByTestId('protocol-4Mod-test') as HTMLSelectElement;
    const ip4Mod = screen.getByTestId('ip-4Mod-test') as HTMLInputElement;
    const port4Mod = screen.getByTestId('port-4Mod-test') as HTMLInputElement;
    const service4Mod = screen.getByTestId('service-4Mod-test') as HTMLInputElement;

    fireEvent.change(version, { target: { value: 1 } });
    expect(version.value).toBe('1');

    fireEvent.change(password, { target: { value: 'password' } });
    expect(password.value).toBe('password');

    fireEvent.change(newPassword, { target: { value: 'newPassword' } });
    expect(newPassword.value).toBe('newPassword');

    fireEvent.click(protocol);
    fireEvent.change(protocol, { target: { value: 'HTTPS' } });

    fireEvent.change(ip, { target: { value: 'ip' } });
    expect(ip.value).toBe('ip');

    fireEvent.change(port, { target: { value: '' } });
    expect(port.value).toBe('');

    fireEvent.change(port, { target: { value: 555 } });
    expect(port.value).toBe('555');

    fireEvent.change(servicePof, { target: { value: 'servicePof' } });
    expect(servicePof.value).toBe('servicePof');

    fireEvent.change(serviceNmp, { target: { value: 'serviceNmp' } });
    expect(serviceNmp.value).toBe('serviceNmp');

    fireEvent.click(protocol4Mod);
    fireEvent.change(protocol4Mod, { target: { value: 'HTTPS' } });

    fireEvent.change(ip4Mod, { target: { value: 'ip4Mod' } });
    expect(ip4Mod.value).toBe('ip4Mod');

    fireEvent.change(port4Mod, { target: { value: 555 } });
    expect(port4Mod.value).toBe('555');

    fireEvent.change(service4Mod, { target: { value: 'service4Mod' } });
    expect(service4Mod.value).toBe('service4Mod');

    const continueBtn = screen.getByText('addEditStationPage.addForm.continueButton');
    fireEvent.click(continueBtn);

    const confirmBtn = screen.getByTestId('confirm-button-test');
    fireEvent.click(confirmBtn);

    fireEvent.click(continueBtn);

    const backBtn = screen.getByTestId('cancel-button-test');
    fireEvent.click(backBtn);
  });
});
