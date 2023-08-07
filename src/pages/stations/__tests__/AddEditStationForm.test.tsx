import * as React from 'react';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  getByRole,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../../redux/store';
import AddEditStationForm from '../addEditStation/AddEditStationForm';
import { StationFormAction, StationOnCreation } from '../../../model/Station';
import { WrapperStatusEnum } from '../../../api/generated/portal/StationDetailResource';
import {
  ProtocolEnum,
  RedirectProtocolEnum,
} from '../../../api/generated/portal/StationDetailsDto';
import { isOperator } from '../components/commonFunctions';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { mockedParties } from '../../../services/__mocks__/partyService';
import * as stationService from '../../../services/stationService';

jest.mock('../components/commonFunctions');

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
    timeoutA: 15,
    timeoutB: 30,
    timeoutC: 120,
    targetConcat: 'https://www.google.it/path?params=test#hash',
    targetHost: 'https://www.google.it',
    targetPort: 0,
    targetPath: '/path?params=test#hash',
    primitiveVersion: 1,
    wrapperStatus: WrapperStatusEnum.APPROVED,
    password: 'password',
    proxyConcat: '',
    proxyHost: 'http://10.79.20.33',
    proxyPort: 80,
    gdpConcat: '',
    newConnConcat: '',
  };

  test('Test rendering AddEditStationForm with operator false', async () => {
    (isOperator as jest.Mock).mockReturnValue(false);
    store.dispatch(partiesActions.setPartySelected(mockedParties[1]));
    const createWrapperStation = jest.spyOn(stationService, 'createWrapperStation');

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
    const targetConcat = screen.getByTestId('target-targetConcat-test') as HTMLInputElement;

    expect(stationCode.value).toBe('');
    fireEvent.change(stationCode, { target: { value: 'station Code' } });
    expect(stationCode.value).toBe('station Code');

    expect(primitiveVersion.value).toBe('2');

    expect(targetConcat.value).toBe('');

    await waitFor(
      () =>
        userEvent.type(
          screen.getByTestId('target-targetConcat-test'),
          'https://www.pagopa.it:8080/pathTest'
        ),
      { timeout: 5000 }
    );

    await waitFor(() => expect(targetConcat.value).toBe('https://www.pagopa.it:8080/pathTest'));

    const continueBtn = screen.getByText('addEditStationPage.addForm.confirmButton');
    fireEvent.click(continueBtn);

    const backBtn = screen.getByText('addEditStationPage.addForm.backButton');
    fireEvent.click(backBtn);

    fireEvent.click(continueBtn);

    const confirmBtn = screen.getByText('addEditStationPage.addForm.confirmButton');
    fireEvent.click(confirmBtn);

    const confirmModalBtn = screen.getByText('addEditStationPage.confirmModal.confirmButton');
    fireEvent.click(confirmModalBtn);

    expect(createWrapperStation).toBeCalledTimes(1);
  });

  test('Test Edit AddEditStationForm with operator false', async () => {
    (isOperator as jest.Mock).mockReturnValue(false);
    store.dispatch(partiesActions.setPartySelected(mockedParties[1]));
    const updateWrapperStationToCheckUpdate = jest.spyOn(
      stationService,
      'updateWrapperStationToCheckUpdate'
    );

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

    const stationCode = screen.getByTestId('station-code-test') as HTMLInputElement;
    const primitiveVersion = screen.getByTestId('primitive-version-test') as HTMLInputElement;
    const targetConcat = screen.getByTestId('target-targetConcat-test') as HTMLInputElement;

    fireEvent.change(targetConcat, { target: { value: 'http://www.test.it:8080/pathTest' } });

    await waitFor(() => expect(targetConcat.value).toBe('http://www.test.it:8080/pathTest'));

    const continueBtn = screen.getByText('addEditStationPage.addForm.confirmButton');
    fireEvent.click(continueBtn);

    const backBtn = screen.getByText('addEditStationPage.addForm.backButton');
    fireEvent.click(backBtn);

    fireEvent.click(continueBtn);

    const confirmBtn = screen.getByText('addEditStationPage.addForm.confirmButton');
    fireEvent.click(confirmBtn);

    const confirmModalBtn = screen.getByText('addEditStationPage.confirmModal.confirmButton');
    fireEvent.click(confirmModalBtn);

    expect(updateWrapperStationToCheckUpdate).toBeCalledTimes(1);
  });

  test('Test rendering AddEditStationForm with operator true, action Edit', async () => {
    store.dispatch(partiesActions.setPartySelected(mockedParties[1]));
    (isOperator as jest.Mock).mockReturnValue(true);
    const createWrapperStation = jest.spyOn(stationService, 'createWrapperStation');
    const createStation = jest.spyOn(stationService, 'createStation');

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm
              stationDetail={{ ...stationDetail, wrapperStatus: WrapperStatusEnum.TO_CHECK }}
              goBack={jest.fn()}
              formAction={StationFormAction.Edit}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const stationCode = screen.getByTestId('station-code-test') as HTMLInputElement;
    const primitiveVersion = screen.getByTestId('primitive-version-test') as HTMLInputElement;
    const targetConcat = screen.getByTestId('target-targetConcat-test') as HTMLInputElement;
    const proxyConcat = screen.getByTestId('proxy-proxyConcat-test') as HTMLInputElement;
    const password = screen.getByTestId('password-test') as HTMLInputElement;

    fireEvent.change(password, { target: { value: 123 } });

    fireEvent.change(targetConcat, { target: { value: 'https://www.pagopa.it:8080/pathTest' } });
    expect(targetConcat.value).toBe('https://www.pagopa.it:8080/pathTest');

    fireEvent.change(proxyConcat, { target: { value: 'http://10.79.20.33:80' } });
    expect(proxyConcat.value).toBe('http://10.79.20.33:80');

    const continueBtn = screen.getByText('addEditStationPage.addForm.continueButton');
    await waitFor(() => fireEvent.click(continueBtn));

    const confirmModalBtn = screen.getByText('addEditStationPage.confirmModal.confirmButtonOpe');
    await waitFor(() => fireEvent.click(confirmModalBtn));

    expect(createWrapperStation).toBeCalledTimes(0);
    expect(createStation).toBeCalledTimes(1);
  });

  test('Test rendering AddEditStationForm with operator true', async () => {
    (isOperator as jest.Mock).mockReturnValue(true);

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
    const timeoutA = screen.getByTestId('timeoutA-test') as HTMLInputElement;
    const timeoutB = screen.getByTestId('timeoutB-test') as HTMLInputElement;
    const timeoutC = screen.getByTestId('timeoutC-test') as HTMLInputElement;
    const targetConcat = screen.getByTestId('target-targetConcat-test') as HTMLInputElement;

    expect(targetConcat.value).toBe('https://www.google.it/path?params=test#hash');

    fireEvent.change(version, { target: { value: 1 } });
    expect(version.value).toBe('1');

    fireEvent.change(password, { target: { value: 'password' } });
    expect(password.value).toBe('password');

    expect(timeoutA.value).toBe('15');
    fireEvent.change(timeoutA, { target: { value: 16 } });
    expect(timeoutA.value).toBe('16');

    expect(timeoutB.value).toBe('30');
    fireEvent.change(timeoutB, { target: { value: 31 } });
    expect(timeoutB.value).toBe('31');

    expect(timeoutC.value).toBe('120');
    fireEvent.change(timeoutC, { target: { value: 121 } });
    expect(timeoutC.value).toBe('121');

    const continueBtn = screen.getByText('addEditStationPage.addForm.continueButton');
    fireEvent.click(continueBtn);

    const backBtn = screen.getByText('addEditStationPage.confirmModal.cancelButton');
    fireEvent.click(backBtn);

    fireEvent.click(continueBtn);

    const confirmBtn = screen.getByText('addEditStationPage.confirmModal.confirmButtonOpe');
    fireEvent.click(confirmBtn);
  });

  test('Test rendering AddEditStationForm with operator true', async () => {
    (isOperator as jest.Mock).mockReturnValue(true);

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm
              goBack={jest.fn()}
              stationDetail={{
                ...stationDetail,
                ip: '/api.uat.platform.pagopa.it',
                protocol: ProtocolEnum.HTTPS,
                service: '/gpd-paymements/api/v1',
                port: 443,
                targetHost: '',
              }}
              formAction={StationFormAction.Edit}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const version = screen.getByTestId('version-test') as HTMLInputElement;
    const password = screen.getByTestId('password-test') as HTMLInputElement;
    const timeoutA = screen.getByTestId('timeoutA-test') as HTMLInputElement;
    const timeoutB = screen.getByTestId('timeoutB-test') as HTMLInputElement;
    const timeoutC = screen.getByTestId('timeoutC-test') as HTMLInputElement;
    const targetConcat = screen.getByTestId('target-targetConcat-test') as HTMLInputElement;

    const radioGPD = document.querySelector(
      '[data-testId="radio-button-gdp"] input[type="radio"]'
    ) as HTMLInputElement;

    expect((screen.getByTestId('gdpConcat-test') as HTMLInputElement).value).toBe(
      'https://api.uat.platform.pagopa.it/gpd-paymements/api/v1'
    );
    expect(radioGPD.checked).toBeTruthy();
    // console.log('checked', test.checked);
  });

  test('Test gdpConcat select handleChange with operator true', async () => {
    (isOperator as jest.Mock).mockReturnValue(true);

    const container = render(
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
    const timeoutA = screen.getByTestId('timeoutA-test') as HTMLInputElement;
    const timeoutB = screen.getByTestId('timeoutB-test') as HTMLInputElement;
    const timeoutC = screen.getByTestId('timeoutC-test') as HTMLInputElement;
    const targetConcat = screen.getByTestId('target-targetConcat-test') as HTMLInputElement;
    const gdpConcatSelect = screen.getByTestId('gdpConcat-select') as HTMLInputElement;
    const gdpRadio = screen.getByTestId('radio-button-gdp') as HTMLInputElement;
    const newConnRadio = screen.getByTestId('radio-button-newConn') as HTMLInputElement;

    await waitFor(() => userEvent.click(gdpRadio));
    const gdpConcatSelectbutton = within(gdpConcatSelect).getByRole('button');
    fireEvent.mouseDown(gdpConcatSelectbutton);
    await waitFor(() => fireEvent.click(screen.getByText(new RegExp('GDP01', 'i'))));

    expect((screen.getByTestId('gdpConcat-test') as HTMLInputElement).value).toBe(
      'https://api.uat.platform.pagopa.it/gpd-paymements/api/v1'
    );

    await waitFor(() => userEvent.click(newConnRadio));

    expect((screen.getByTestId('gdpConcat-test') as HTMLInputElement).value).toBe('');
  });
});
