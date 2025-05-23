import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createMemoryHistory} from 'history';
import React from 'react';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import {FormAction} from '../../../../model/Channel';
import {store} from '../../../../redux/store';
import AddEditChannelForm from '../AddEditChannelForm';
import {pspAdminSignedDirect, pspOperatorSignedDirect,} from '../../../../services/__mocks__/partyService';
import {BackofficeApi} from '../../../../api/BackofficeClient';
import {Party} from '../../../../model/Party';
import {isValidURL} from '../../../components/commonFunctions';
import {ChannelDetailsResource, WrapperStatusEnum} from '../../../../api/generated/portal/ChannelDetailsResource';
import {ROLE} from "../../../../model/RolePermission";

import * as useUserRole from "../../../../hooks/useUserRole"

// import { wait } from '@testing-library/user-event/dist/types/utils';

jest.mock('../../../components/commonFunctions.ts');
jest.mock("../../../../hooks/useUserRole");

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

const channelDetail: ChannelDetailsResource = {
    broker_psp_code: '97735020584',
    broker_description: 'AgID - Agenzia per l’Italia Digitale',
    channel_code: `${pspOperatorSignedDirect.fiscalCode}_01`,
    target_path: '/govpay/api/pagopa/PagamentiTelematiciCCPservice',
    target_port: 443,
    target_host: 'www.lab.link.it',
    proxy_enabled: false,
    proxy_host: 'string',
    proxy_password: 'string',
    proxy_port: 0,
    proxy_username: 'string',
    ip: 'ip',
    service: 'service',
    payment_types: ['PPAY'],
};
const channelDetailApproved: ChannelDetailsResource = {
    broker_psp_code: '97735020584',
    broker_description: 'AgID - Agenzia per l’Italia Digitale',
    channel_code: `${pspOperatorSignedDirect.fiscalCode}_01`,
    target_path: '/govpay/api/pagopa/PagamentiTelematiciCCPservice',
    target_port: 443,
    target_host: 'www.lab.link.it',
    payment_types: ['PPAY'],
    wrapperStatus: WrapperStatusEnum.APPROVED
};

describe('<AddEditChannelForm />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
    const history = injectedHistory ? injectedHistory : createMemoryHistory();

    const adminUser: Array<Party> = [pspAdminSignedDirect];

    const operatorUser: Array<Party> = [pspOperatorSignedDirect];

    test('Test rendering AddEditChannelForm Operator', async () => {
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
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <AddEditChannelForm
                            formAction={FormAction.Duplicate}
                            selectedParty={pspOperatorSignedDirect}
                            channelCode={`${pspOperatorSignedDirect.fiscalCode}_01`}
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

        expect(businessName.value).toBe(pspOperatorSignedDirect.description);
        expect(pspBrokerCode.value).toBe(pspOperatorSignedDirect.fiscalCode);
        expect(channelCode.value).toBe(`${pspOperatorSignedDirect.fiscalCode}_01`);

        fireEvent.click(businessName);
        fireEvent.change(businessName, {target: {value: 'businessName'}});
        expect(businessName.value).toBe('businessName');

        fireEvent.click(pspBrokerCode);
        fireEvent.change(pspBrokerCode, {target: {value: 'pspBrokerCode'}});
        expect(pspBrokerCode.value).toBe('pspBrokerCode');

        fireEvent.click(channelCode);
        fireEvent.change(channelCode, {target: {value: 'channelCode'}});
        expect(channelCode.value).toBe('channelCode');

        fireEvent.click(targetUnion);
        fireEvent.change(targetUnion, {target: {value: 'https://www.testTarget.it/path'}});
        expect(targetUnion.value).toBe('https://www.testTarget.it/path');

        fireEvent.click(paymentType);
        fireEvent.change(paymentType, {target: {value: 'Option 1'}});

        fireEvent.click(continueBtn);

        const confirmBtn = screen.queryByTestId('confirm-button-test') as HTMLButtonElement;
        const cancelBtn = screen.queryByTestId('cancel-button-test') as HTMLButtonElement;

        userEvent.click(cancelBtn);
        fireEvent.click(continueBtn);

        userEvent.click(confirmBtn);
    });

    test('Test rendering AddEditChannelForm PSP', async () => {
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PSP_ADMIN,
            userIsPspAdmin: true,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: true,
            userIsPagopaOperator: false,
            userIsAdmin: true,
        });
        render(
            <Provider store={store}>
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <AddEditChannelForm
                            formAction={FormAction.Duplicate}
                            selectedParty={pspOperatorSignedDirect}
                            channelCode={`${pspOperatorSignedDirect.fiscalCode}_01`}
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

        expect(businessName.value).toBe(pspOperatorSignedDirect.description);
        expect(pspBrokerCode.value).toBe(pspOperatorSignedDirect.fiscalCode);
        expect(channelCode.value).toBe(`${pspOperatorSignedDirect.fiscalCode}_01`);

        fireEvent.click(businessName);
        fireEvent.change(businessName, {target: {value: 'businessName'}});
        expect(businessName.value).toBe('businessName');

        fireEvent.click(pspBrokerCode);
        fireEvent.change(pspBrokerCode, {target: {value: 'pspBrokerCode'}});
        expect(pspBrokerCode.value).toBe('pspBrokerCode');

        fireEvent.click(channelCode);
        fireEvent.change(channelCode, {target: {value: 'channelCode'}});
        expect(channelCode.value).toBe('channelCode');

        fireEvent.click(targetUnion);
        fireEvent.change(targetUnion, {target: {value: 'https://www.testTarget.it/path'}});
        expect(targetUnion.value).toBe('https://www.testTarget.it/path');

        fireEvent.click(paymentType);
        fireEvent.change(paymentType, {target: {value: 'Option 1'}});

        fireEvent.click(continueBtn);

        const confirmBtn = screen.queryByTestId('confirm-button-test') as HTMLButtonElement;
        const cancelBtn = screen.queryByTestId('cancel-button-test') as HTMLButtonElement;

        userEvent.click(cancelBtn);
        fireEvent.click(continueBtn);

        userEvent.click(confirmBtn);
    });

    test('test catch case api getPaymentTypes', async () => {
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PAGOPA_OPERATOR,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: true,
            userIsAdmin: true,
        });
        BackofficeApi.configurations.getPaymentTypes = async (): Promise<any> => Promise.reject();
        render(
            <Provider store={store}>
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <AddEditChannelForm
                            formAction={FormAction.Create}
                            selectedParty={pspOperatorSignedDirect}
                            channelCode={`${pspOperatorSignedDirect.fiscalCode}_01`}
                        />
                    </ThemeProvider>
                </Router>
            </Provider>
        );
    });

    test('Test rendering AddEditChannelForm with formAction duplicate', async () => {
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
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <AddEditChannelForm
                            formAction={FormAction.Duplicate}
                            selectedParty={pspOperatorSignedDirect}
                            channelCode={'14847241008_01'}
                        />
                    </ThemeProvider>
                </Router>
            </Provider>
        );
    });

    test('Test rendering AddEditChannelForm with formAction edit', async () => {
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
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <AddEditChannelForm
                            formAction={FormAction.Edit}
                            selectedParty={pspOperatorSignedDirect}
                            channelCode={'14847241008_01'}
                        />
                    </ThemeProvider>
                </Router>
            </Provider>
        );
    });

    test('Test rendering AddEditChannelForm with formAction Create', async () => {
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
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <AddEditChannelForm
                            formAction={FormAction.Create}
                            selectedParty={pspOperatorSignedDirect}
                            channelCode={`${pspOperatorSignedDirect.fiscalCode}_01`}
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

        expect(businessName.value).toBe(pspOperatorSignedDirect.description);
        expect(pspBrokerCode.value).toBe(pspOperatorSignedDirect.fiscalCode);
        expect(channelCode.value).toBe(`${pspOperatorSignedDirect.fiscalCode}_01`);

        fireEvent.click(targetUnion);
        fireEvent.change(targetUnion, {target: {value: `https://www.testTarget.it/path`}});
        fireEvent.change(targetUnion, {target: {value: `https://www.testTarget.it:3000/path`}});

        paymentType.value = 'PPAY';

        fireEvent.change(paymentType);
        expect(paymentType.value).toBe('PPAY');

        fireEvent.click(continueBtn);

        const confirmBtn = screen.getByText(
            'addEditChannelPage.addForm.continueButton'
        ) as HTMLButtonElement;
        const cancelBtn = screen.getByText(
            'general.back'
        ) as HTMLButtonElement;

        fireEvent.click(cancelBtn);
        fireEvent.click(continueBtn);

        fireEvent.click(confirmBtn);

        fireEvent.click(continueBtn);

        fireEvent.click(backButton);
    });

    // test('Test Multipayment methods add/remove', async () => {
    //   (isOperator as jest.Mock).mockReturnValue(true);

    //   const { getByTestId, getAllByTestId } = render(
    //     <Provider store={store}>
    //       <Router history={history}>
    //         <ThemeProvider theme={theme}>
    //           <AddEditChannelForm
    //             formAction={FormAction.Edit}
    //             selectedParty={pspOperatorSignedDirect}
    //             channelCode={`${pspOperatorSignedDirect.fiscalCode}_01`}
    //             channelDetail={channelDetail}
    //           />
    //         </ThemeProvider>
    //       </Router>
    //     </Provider>
    //   );

    //   const addPaymentType = getByTestId('add-payment-test') as HTMLButtonElement;

    //   fireEvent.click(addPaymentType);
    //   await waitFor(() => {
    //     const paymentType = getAllByTestId('payment-type-test');
    //     expect(paymentType).toHaveLength(2);
    //   });

    //   fireEvent.click(addPaymentType);

    //   await waitFor(() => {
    //     const paymentType = getAllByTestId('payment-type-test');
    //     expect(paymentType).toHaveLength(3);

    //     const deletePaymentMethod = getAllByTestId('remove-payment-method') as HTMLButtonElement[];
    //     if (deletePaymentMethod.length > 0) {
    //       fireEvent.click(deletePaymentMethod[0]);
    //     }
    //   });
    // });

    test('Test of AddEditChannelValidationForm case checkbox select-new-connection-test flag true', async () => {
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PAGOPA_OPERATOR,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: true,
            userIsAdmin: true,
        });
        (isValidURL as jest.Mock).mockReturnValue(true);

        const {getByTestId, getByText} = render(
            <Provider store={store}>
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <AddEditChannelForm
                            formAction={FormAction.Edit}
                            selectedParty={operatorUser[0]}
                            channelCode={`${pspOperatorSignedDirect.fiscalCode}_01`}
                            channelDetail={channelDetail}
                        />
                    </ThemeProvider>
                </Router>
            </Provider>
        );

        const primitiveVersion = getByTestId('primitive-version-test') as HTMLInputElement;
        const password = getByTestId('password-test') as HTMLInputElement;
        const proxyUnion = getByTestId('proxy-union-test') as HTMLInputElement;
        const timeoutA = getByTestId('timeout-a-test') as HTMLInputElement;
        const timeoutB = getByTestId('timeout-b-test') as HTMLInputElement;
        const timeoutC = getByTestId('timeout-c-test') as HTMLInputElement;
        const continueBtn = getByText('addEditChannelPage.addForm.continueButton');
        const backButton = getByTestId('back-btn-test') as HTMLButtonElement;
        const newConnection = getByTestId('new-connection-channel') as HTMLInputElement;

        expect(screen.queryByTestId('delete-new-connection')).not.toBeInTheDocument();

        fireEvent.change(newConnection, {
            target: {value: 'https://api.dev.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward'},
        });

        const deleteNewConnection = screen.getByTestId('delete-new-connection');

        fireEvent.click(deleteNewConnection);

        expect(newConnection.value).toBe('');

        fireEvent.change(primitiveVersion, {target: {value: undefined}});
        fireEvent.change(primitiveVersion, {target: {value: 1}});

        fireEvent.change(password, {target: {value: 1}});

        fireEvent.change(proxyUnion, {
            target: {value: 'https://10.101.1.95:8080'},
        });

        fireEvent.change(timeoutA, {target: {value: 10}});

        fireEvent.change(timeoutB, {target: {value: 20}});

        fireEvent.change(timeoutC, {target: {value: 30}});

        fireEvent.click(continueBtn);

        const confirmBtn = screen.queryByText(
            (_content, element) =>
                element?.tagName.toLowerCase() === 'button' &&
                element.textContent === 'addEditChannelPage.confirmModal.confirmButtonOpe'
        ) as HTMLButtonElement;

        const cancelBtn = screen.queryByText(
            (_content, element) =>
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

    test('test targetUnion condition', async () => {
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
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <AddEditChannelForm
                            formAction={FormAction.Edit}
                            selectedParty={pspOperatorSignedDirect}
                            channelCode={`${pspOperatorSignedDirect.fiscalCode}_01`}
                            channelDetail={channelDetail}
                        />
                    </ThemeProvider>
                </Router>
            </Provider>
        );
        
    });

    test('Test of AddEditChannelValidationForm case chackbox select-new-connection-test flag true on config', async () => {
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PAGOPA_OPERATOR,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: true,
            userIsAdmin: true,
        });
        (isValidURL as jest.Mock).mockReturnValue(true);

        const {getByTestId, getByText} = render(
            <Provider store={store}>
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <AddEditChannelForm
                            formAction={FormAction.Edit}
                            selectedParty={operatorUser[0]}
                            channelCode={`${pspOperatorSignedDirect.fiscalCode}_01`}
                            channelDetail={channelDetailApproved}
                        />
                    </ThemeProvider>
                </Router>
            </Provider>
        );

        const primitiveVersion = getByTestId('primitive-version-test') as HTMLInputElement;
        const password = getByTestId('password-test') as HTMLInputElement;
        const proxyUnion = getByTestId('proxy-union-test') as HTMLInputElement;
        const timeoutA = getByTestId('timeout-a-test') as HTMLInputElement;
        const timeoutB = getByTestId('timeout-b-test') as HTMLInputElement;
        const timeoutC = getByTestId('timeout-c-test') as HTMLInputElement;
        const continueBtn = getByText('addEditChannelPage.addForm.continueButton');
        const backButton = getByTestId('back-btn-test') as HTMLButtonElement;
        const newConnection = getByTestId('new-connection-channel') as HTMLInputElement;

        expect(screen.queryByTestId('delete-new-connection')).not.toBeInTheDocument();

        fireEvent.change(newConnection, {
            target: {value: 'https://api.dev.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward'},
        });

        const deleteNewConnection = screen.getByTestId('delete-new-connection');

        fireEvent.click(deleteNewConnection);

        expect(newConnection.value).toBe('');

        fireEvent.change(primitiveVersion, {target: {value: undefined}});
        fireEvent.change(primitiveVersion, {target: {value: 1}});

        fireEvent.change(password, {target: {value: 1}});

        fireEvent.change(proxyUnion, {
            target: {value: 'https://10.101.1.95:8080'},
        });

        fireEvent.change(timeoutA, {target: {value: 10}});

        fireEvent.change(timeoutB, {target: {value: 20}});

        fireEvent.change(timeoutC, {target: {value: 30}});

        fireEvent.click(continueBtn);

        const confirmBtn = screen.queryByText(
            (_content, element) =>
                element?.tagName.toLowerCase() === 'button' &&
                element.textContent === 'addEditChannelPage.confirmModal.confirmButtonOpe'
        ) as HTMLButtonElement;

        const cancelBtn = screen.queryByText(
            (_content, element) =>
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
