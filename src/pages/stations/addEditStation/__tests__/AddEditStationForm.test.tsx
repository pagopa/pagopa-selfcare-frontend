import * as React from 'react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import {store} from '../../../../redux/store';
import AddEditStationForm from '../AddEditStationForm';
import {ConnectionType, StationFormAction} from '../../../../model/Station';
import {WrapperStatusEnum} from '../../../../api/generated/portal/StationDetailResource';
import {ProtocolEnum} from '../../../../api/generated/portal/StationDetailsDto';
import {partiesActions} from '../../../../redux/slices/partiesSlice';
import {ecAdminSignedDirect} from '../../../../services/__mocks__/partyService';
import * as stationService from '../../../../services/stationService';
import * as useUserRole from '../../../../hooks/useUserRole';
import {featureFlagsActions} from "../../../../redux/slices/featureFlagsSlice";
import {ROLE} from "../../../../model/RolePermission";
import {mockedFullStation, mockedStationCode} from '../../../../services/__mocks__/stationService';

jest.mock('../../../components/commonFunctions');

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('AddEditStationForm ', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test rendering AddEditStationForm with Async connection', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PSP_ADMIN,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: false,
      userIsAdmin: false,
    });
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm  formAction={StationFormAction.Create} />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const asyncRadio = screen
      .getByTestId('connection-type-radio-group')
      .querySelector(`[value=${ConnectionType.ASYNC}]`) as HTMLInputElement;
    expect(asyncRadio.checked).toBeTruthy();
    expect(screen.queryByTestId('model-1-box')).not.toBeInTheDocument();
    expect(screen.queryByTestId('model-unique-box')).not.toBeInTheDocument();
  });

  test('Test rendering AddEditStationForm with operator false and change connection to sync', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PSP_ADMIN,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: false,
      userIsAdmin: false,
    });
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
    const createWrapperStation = jest.spyOn(stationService, 'createWrapperStation');

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm  formAction={StationFormAction.Create} />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const syncRadio = screen
      .getByTestId('connection-type-radio-group')
      .querySelector(`[value=${ConnectionType.SYNC}]`) as HTMLInputElement;
    expect(syncRadio.checked).toBeFalsy();
    fireEvent.click(syncRadio);
    await waitFor(() => expect(syncRadio.checked).toBeTruthy());

    const stationCode = screen.getByTestId('station-code-test') as HTMLInputElement;
    const primitiveVersion = screen.getByTestId('primitive-version-test') as HTMLInputElement;
    const targetPofConcat = screen.getByTestId('targetPofConcat-test') as HTMLInputElement;

    expect(stationCode.value).toBe(mockedStationCode.stationCode);
    fireEvent.change(stationCode, { target: { value: 'station Code' } });
    expect(stationCode.value).toBe('station Code');

    expect(primitiveVersion.value).toBe('2');

    expect(targetPofConcat.value).toBe('');

    await waitFor(() => userEvent.type(targetPofConcat, 'https:www.pagopa.it:8080/pathTest'), {
      timeout: 5000,
    });

    await waitFor(() => expect(targetPofConcat.value).toBe('https:www.pagopa.it:8080/pathTest'));

    const continueBtn = screen.getByText('general.confirm');
    fireEvent.click(continueBtn);

    const backBtn = screen.getByText('general.turnBack');
    fireEvent.click(backBtn);

    fireEvent.click(continueBtn);

    const confirmModalBtn = screen.getByTestId('confirm-button-modal-test');
    fireEvent.click(confirmModalBtn);

    //expect(createWrapperStation).toBeCalledTimes(1);
  });

    test('Test rendering AddEditStationForm with operator false and change connection to sync', async () => {
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PSP_ADMIN,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: false,
            userIsAdmin: false,
        });
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
        const createWrapperStation = jest.spyOn(stationService, 'createWrapperStation');

        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Router history={history}>
                        <AddEditStationForm formAction={StationFormAction.Create}/>
                    </Router>
                </ThemeProvider>
            </Provider>
        );

        const syncRadio = screen
            .getByTestId('connection-type-radio-group')
            .querySelector(`[value=${ConnectionType.SYNC}]`) as HTMLInputElement;
        expect(syncRadio.checked).toBeFalsy();
        fireEvent.click(syncRadio);
        await waitFor(() => expect(syncRadio.checked).toBeTruthy());

        const stationCode = screen.getByTestId('station-code-test') as HTMLInputElement;
        const primitiveVersion = screen.getByTestId('primitive-version-test') as HTMLInputElement;
        const targetPofConcat = screen.getByTestId('targetPofConcat-test') as HTMLInputElement;

        expect(stationCode.value).toBe(mockedStationCode.stationCode);
        fireEvent.change(stationCode, {target: {value: 'station Code'}});
        expect(stationCode.value).toBe('station Code');

        expect(primitiveVersion.value).toBe('2');

        expect(targetPofConcat.value).toBe('');

        await waitFor(() => userEvent.type(targetPofConcat, 'https:www.pagopa.it:8080/pathTest'), {
            timeout: 5000,
        });

        await waitFor(() => expect(targetPofConcat.value).toBe('https:www.pagopa.it:8080/pathTest'));

        const continueBtn = screen.getByText('general.confirm');
        fireEvent.click(continueBtn);

        const backBtn = screen.getByText('general.turnBack');
        fireEvent.click(backBtn);

        fireEvent.click(continueBtn);

        const confirmModalBtn = screen.getByTestId('confirm-button-modal-test');
        fireEvent.click(confirmModalBtn);

        //expect(createWrapperStation).toBeCalledTimes(1);
    });

    test('Test Edit AddEditStationForm with operator false and change connection to sync', async () => {
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PSP_ADMIN,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: false,
            userIsAdmin: false,
        });
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

        const flags = {
            flags: {['test-stations']: true},
        };
        await store.dispatch(featureFlagsActions.setFeatureFlags(flags));
        const updateWrapperStationToCheckUpdate = jest.spyOn(
            stationService,
            'updateWrapperStationToCheckUpdate'
        );

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm
              
              stationDetail={mockedFullStation}
              formAction={StationFormAction.Edit}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Router history={history}>
                        <AddEditStationForm

                            stationDetail={mockedFullStation}
                            formAction={StationFormAction.Edit}
                        />
                    </Router>
                </ThemeProvider>
            </Provider>
        );

        const syncRadio = screen
            .getByTestId('connection-type-radio-group')
            .querySelector(`[value=${ConnectionType.SYNC}]`) as HTMLInputElement;
        expect(syncRadio.checked).toBeFalsy();
        fireEvent.click(syncRadio);
        await waitFor(() => expect(syncRadio.checked).toBeTruthy());

        const stationCode = screen.getByTestId('station-code-test') as HTMLInputElement;
        const primitiveVersion = screen.getByTestId('primitive-version-test') as HTMLInputElement;
        const targetConcat = screen.getByTestId('targetConcat-test') as HTMLInputElement;

        fireEvent.change(targetConcat, {target: {value: 'https://www.test.it:8080/pathTest'}});

        await waitFor(() => expect(targetConcat.value).toBe('https://www.test.it:8080/pathTest'));

        const testTargetButton = screen.getByTestId('test-rt-endpoint-test');
        fireEvent.click(testTargetButton);

        const targePofConcat = screen.getByTestId('targetPofConcat-test') as HTMLInputElement;

        fireEvent.change(targePofConcat, {target: {value: 'https://www.test.it:8080/pathTest'}});

        await waitFor(() => expect(targePofConcat.value).toBe('https://www.test.it:8080/pathTest'));

        const testPofTargetButton = screen.getByTestId('test-pof-endpoint-test');
        fireEvent.click(testPofTargetButton);

        const redirectConcat = screen.getByTestId('redirectConcat-test') as HTMLInputElement;

        fireEvent.change(redirectConcat, {target: {value: 'http://www.test.it/pathTest'}});

        await waitFor(() => expect(redirectConcat.value).toBe('http://www.test.it/pathTest'));

        const testRedirectButton = screen.getByTestId('test-redirect-endpoint-test');
        fireEvent.click(testRedirectButton);

        expect(testStation).toBeCalledTimes(3);

        const continueBtn = screen.getByText('general.confirm');
        fireEvent.click(continueBtn);

        const backBtn = screen.getByText('general.turnBack');
        fireEvent.click(backBtn);

        fireEvent.click(continueBtn);

        const confirmBtn = screen.getByText('general.confirm');
        fireEvent.click(confirmBtn);

  test('Test Edit rendering AddEditStationForm with operator true, with Station in status TO_CHECK', async () => {
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: true,
    });
    const flags = {
      flags: { ['test-stations']: true },
    };
    await store.dispatch(featureFlagsActions.setFeatureFlags(flags));
    const createWrapperStation = jest.spyOn(stationService, 'createWrapperStation');
    const createStation = jest.spyOn(stationService, 'createStation');

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm
              stationDetail={{ ...mockedFullStation, wrapperStatus: WrapperStatusEnum.TO_CHECK }}
              
              formAction={StationFormAction.Edit}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const radioGroup = screen.getByTestId('connection-type-radio-group');
    const syncRadio = radioGroup.querySelector(
      `[value=${ConnectionType.SYNC}]`
    ) as HTMLInputElement;
    const asyncRadio = radioGroup.querySelector(
      `[value=${ConnectionType.ASYNC}]`
    ) as HTMLInputElement;
    expect(syncRadio.disabled).toBeTruthy();
    expect(asyncRadio.disabled).toBeTruthy();

    expect(screen.queryByTestId('station-code-test')).toBeInTheDocument();

    const continueBtn = screen.getByText('general.confirm');
    fireEvent.click(continueBtn);

    await waitFor(() => {
      const confirmModalBtn = screen.getByTestId('confirm-button-modal-test');
      fireEvent.click(confirmModalBtn);
    });

    expect(createWrapperStation).toBeCalledTimes(0);
    expect(createStation).toBeCalledTimes(1);
  });

  test('Test Edit rendering AddEditStationForm with operator false, with Station in status TO_CHECK', async () => {
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: false,
      userIsAdmin: true,
    });
    const flags = {
      flags: { ['test-stations']: true },
    };
    await store.dispatch(featureFlagsActions.setFeatureFlags(flags));
    const createWrapperStation = jest.spyOn(stationService, 'createWrapperStation');
    const updateWrapperStationToCheck = jest.spyOn(stationService, 'updateWrapperStationToCheck');

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm
              stationDetail={{ ...mockedFullStation, wrapperStatus: WrapperStatusEnum.TO_CHECK }}
              
              formAction={StationFormAction.Edit}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('station-code-test')).toBeInTheDocument();

    const continueBtn = screen.getByText('general.confirm');
    fireEvent.click(continueBtn);

    await waitFor(() => {
      const confirmModalBtn = screen.getByTestId('confirm-button-modal-test');
      fireEvent.click(confirmModalBtn);
    });

    expect(createWrapperStation).toBeCalledTimes(0);
    expect(updateWrapperStationToCheck).toBeCalledTimes(1);
  });

  test('Test Edit rendering AddEditStationForm with operator true, with Station in status TO_CHECK_UPDATE', async () => {
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: true,
    });
    const flags = {
      flags: { ['test-stations']: true },
    };
    await store.dispatch(featureFlagsActions.setFeatureFlags(flags));
    const createWrapperStation = jest.spyOn(stationService, 'createWrapperStation');
    const updateStation = jest.spyOn(stationService, 'updateStation');

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm
              stationDetail={{ ...mockedFullStation, wrapperStatus: WrapperStatusEnum.TO_CHECK_UPDATE }}
              
              formAction={StationFormAction.Edit}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const radioGroup = screen.getByTestId('connection-type-radio-group');
    const syncRadio = radioGroup.querySelector(
      `[value=${ConnectionType.SYNC}]`
    ) as HTMLInputElement;
    const asyncRadio = radioGroup.querySelector(
      `[value=${ConnectionType.ASYNC}]`
    ) as HTMLInputElement;
    expect(syncRadio.disabled).toBeTruthy();
    expect(asyncRadio.disabled).toBeTruthy();

    expect(screen.queryByTestId('station-code-test')).toBeInTheDocument();

    const continueBtn = screen.getByText('general.confirm');
    fireEvent.click(continueBtn);

    await waitFor(() => {
      const confirmModalBtn = screen.getByTestId('confirm-button-modal-test');
      fireEvent.click(confirmModalBtn);
    });

    expect(createWrapperStation).toBeCalledTimes(0);
    expect(updateStation).toBeCalledTimes(1);
  });

  test('Test Edit rendering AddEditStationForm with operator false, with Station in status TO_CHECK_UPDATE', async () => {
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: false,
      userIsAdmin: true,
    });
    const flags = {
      flags: { ['test-stations']: true },
    };
    await store.dispatch(featureFlagsActions.setFeatureFlags(flags));
    const createWrapperStation = jest.spyOn(stationService, 'createWrapperStation');
    const updateWrapperStationToCheckUpdate = jest.spyOn(stationService, 'updateWrapperStationToCheckUpdate');

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm
              stationDetail={{ ...mockedFullStation, wrapperStatus: WrapperStatusEnum.TO_CHECK_UPDATE }}
              
              formAction={StationFormAction.Edit}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('station-code-test')).toBeInTheDocument();

    const continueBtn = screen.getByText('general.confirm');
    fireEvent.click(continueBtn);

    await waitFor(() => {
      const confirmModalBtn = screen.getByTestId('confirm-button-modal-test');
      fireEvent.click(confirmModalBtn);
    });

    test('Test Edit rendering AddEditStationForm with operator true, with Station in status TO_CHECK_UPDATE', async () => {
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PAGOPA_OPERATOR,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: true,
            userIsAdmin: true,
        });
        const flags = {
            flags: {['test-stations']: true},
        };
        await store.dispatch(featureFlagsActions.setFeatureFlags(flags));
        const createWrapperStation = jest.spyOn(stationService, 'createWrapperStation');
        const updateStation = jest.spyOn(stationService, 'updateStation');

        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Router history={history}>
                        <AddEditStationForm
                            stationDetail={{...mockedFullStation, wrapperStatus: WrapperStatusEnum.TO_CHECK_UPDATE}}

                            formAction={StationFormAction.Edit}
                        />
                    </Router>
                </ThemeProvider>
            </Provider>
        );

        const radioGroup = screen.getByTestId('connection-type-radio-group');
        const syncRadio = radioGroup.querySelector(
            `[value=${ConnectionType.SYNC}]`
        ) as HTMLInputElement;
        const asyncRadio = radioGroup.querySelector(
            `[value=${ConnectionType.ASYNC}]`
        ) as HTMLInputElement;
        expect(syncRadio.disabled).toBeTruthy();
        expect(asyncRadio.disabled).toBeTruthy();

        expect(screen.queryByTestId('station-code-test')).toBeInTheDocument();

        const continueBtn = screen.getByText('general.confirm');
        fireEvent.click(continueBtn);

        await waitFor(() => {
            const confirmModalBtn = screen.getByTestId('confirm-button-modal-test');
            fireEvent.click(confirmModalBtn);
        });

        expect(createWrapperStation).toBeCalledTimes(0);
        expect(updateStation).toBeCalledTimes(1);
    });
    const flags = {
      flags: { ['test-stations']: true },
    };
    await store.dispatch(featureFlagsActions.setFeatureFlags(flags));
    const createWrapperStation = jest.spyOn(stationService, 'createWrapperStation');
    const updateWrapperStationToCheck = jest.spyOn(stationService, 'updateWrapperStationToCheck');

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm
              stationDetail={{ ...mockedFullStation, wrapperStatus: WrapperStatusEnum.TO_FIX }}
              
              formAction={StationFormAction.Edit}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const radioGroup = screen.getByTestId('connection-type-radio-group');
    const syncRadio = radioGroup.querySelector(
      `[value=${ConnectionType.SYNC}]`
    ) as HTMLInputElement;
    const asyncRadio = radioGroup.querySelector(
      `[value=${ConnectionType.ASYNC}]`
    ) as HTMLInputElement;
    expect(syncRadio.disabled).toBeTruthy();
    expect(asyncRadio.disabled).toBeTruthy();

    expect(screen.queryByTestId('station-code-test')).toBeInTheDocument();

    const continueBtn = screen.getByText('general.confirm');
    fireEvent.click(continueBtn);

    await waitFor(() => {
      const confirmModalBtn = screen.getByTestId('confirm-button-modal-test');
      fireEvent.click(confirmModalBtn);
    });

    test('Test Edit rendering AddEditStationForm with operator true, with Station in status TO_FIX', async () => {
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PAGOPA_OPERATOR,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: true,
            userIsAdmin: true,
        });
        const flags = {
            flags: {['test-stations']: true},
        };
        await store.dispatch(featureFlagsActions.setFeatureFlags(flags));
        const createWrapperStation = jest.spyOn(stationService, 'createWrapperStation');
        const updateWrapperStationToCheck = jest.spyOn(stationService, 'updateWrapperStationToCheck');

        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Router history={history}>
                        <AddEditStationForm
                            stationDetail={{...mockedFullStation, wrapperStatus: WrapperStatusEnum.TO_FIX}}

                            formAction={StationFormAction.Edit}
                        />
                    </Router>
                </ThemeProvider>
            </Provider>
        );

        const radioGroup = screen.getByTestId('connection-type-radio-group');
        const syncRadio = radioGroup.querySelector(
            `[value=${ConnectionType.SYNC}]`
        ) as HTMLInputElement;
        const asyncRadio = radioGroup.querySelector(
            `[value=${ConnectionType.ASYNC}]`
        ) as HTMLInputElement;
        expect(syncRadio.disabled).toBeTruthy();
        expect(asyncRadio.disabled).toBeTruthy();

        expect(screen.queryByTestId('station-code-test')).toBeInTheDocument();

        const continueBtn = screen.getByText('general.confirm');
        fireEvent.click(continueBtn);

        await waitFor(() => {
            const confirmModalBtn = screen.getByTestId('confirm-button-modal-test');
            fireEvent.click(confirmModalBtn);
        });

        expect(createWrapperStation).toBeCalledTimes(0);
        expect(updateWrapperStationToCheck).toBeCalledTimes(1);
    });
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm
              
              stationDetail={{ ...mockedFullStation, isConnectionSync: true }}
              formAction={StationFormAction.Edit}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('radio-button-newConn')).toBeInTheDocument();
    expect(screen.queryByTestId('radio-button-gdp')).not.toBeInTheDocument();

    const version = screen.getByTestId('version-test') as HTMLInputElement;
    const password = screen.getByTestId('password-test') as HTMLInputElement;
    const timeoutA = screen.getByTestId('timeoutA-test') as HTMLInputElement;
    const timeoutB = screen.getByTestId('timeoutB-test') as HTMLInputElement;
    const timeoutC = screen.getByTestId('timeoutC-test') as HTMLInputElement;

    fireEvent.change(version, { target: { value: 1 } });
    expect(version.value).toBe('1');

    fireEvent.change(password, { target: { value: 'password' } });
    expect(password.value).toBe('password');

    expect(timeoutA.value).toBe(mockedFullStation.timeoutA?.toString());
    fireEvent.change(timeoutA, { target: { value: 16 } });
    expect(timeoutA.value).toBe('16');

    expect(timeoutB.value).toBe(mockedFullStation.timeoutB?.toString());
    fireEvent.change(timeoutB, { target: { value: 31 } });
    expect(timeoutB.value).toBe('31');

    expect(timeoutC.value).toBe(mockedFullStation.timeoutC?.toString());
    fireEvent.change(timeoutC, { target: { value: 121 } });
    expect(timeoutC.value).toBe('121');

    const continueBtn = screen.getByText('general.confirm');
    fireEvent.click(continueBtn);

    const backBtn = screen.getByText('general.turnBack');
    fireEvent.click(backBtn);

    fireEvent.click(continueBtn);

    const confirmBtn = screen.getByTestId('confirm-button-modal-test');
    fireEvent.click(confirmBtn);
  });

  test('Test rendering AddEditStationForm with async connection (service GPD) and operator true', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: true,
    });
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm
              stationDetail={{
                ...mockedFullStation,
                ip: '/api.uat.platform.pagopa.it',
                protocol: ProtocolEnum.HTTPS,
                service: '/gpd-payments/api/v1',
                port: 443,
                targetHost: '',
              }}
              formAction={StationFormAction.Edit}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('radio-button-newConn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('radio-button-gdp')).toBeInTheDocument();

    const version = screen.getByTestId('version-test') as HTMLInputElement;
    const password = screen.getByTestId('password-test') as HTMLInputElement;
    const timeoutA = screen.getByTestId('timeoutA-test') as HTMLInputElement;
    const timeoutB = screen.getByTestId('timeoutB-test') as HTMLInputElement;
    const timeoutC = screen.getByTestId('timeoutC-test') as HTMLInputElement;
    const gdpConcatSelect = screen.getByTestId('gdpConcat-select') as HTMLInputElement;
    const gdpRadio = screen.getByTestId('radio-button-gdp') as HTMLInputElement;

    await waitFor(() => userEvent.click(gdpRadio));
    const gdpConcatSelectbutton = screen.getByLabelText('addEditStationPage.addFormValidation.fields.select');
    fireEvent.mouseDown(gdpConcatSelectbutton);
    await waitFor(() => fireEvent.click(screen.getByText(new RegExp('GDP01', 'i'))));

    expect((screen.getByTestId('gdpConcat-test') as HTMLInputElement).value).toBe(
      'https://api.uat.platform.pagopa.it/gpd-payments/api/v1'
    );
  });

  test('Test gdpConcat select handleChange with async connection (no service) and operator true', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: true,
    });

    const container = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationForm
              stationDetail={mockedFullStation}
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
    const gdpConcatSelect = screen.getByTestId('gdpConcat-select') as HTMLInputElement;
    const gdpRadio = screen.getByTestId('radio-button-gdp') as HTMLInputElement;

    await waitFor(() => userEvent.click(gdpRadio));
    const gdpConcatSelectbutton = screen.getByLabelText('addEditStationPage.addFormValidation.fields.select');
    fireEvent.mouseDown(gdpConcatSelectbutton);
    await waitFor(() => fireEvent.click(screen.getByText(new RegExp('GDP01', 'i'))));

    expect((screen.getByTestId('gdpConcat-test') as HTMLInputElement).value).toBe(
      'https://api.uat.platform.pagopa.it/gpd-payments/api/v1'
    );
  });
});
