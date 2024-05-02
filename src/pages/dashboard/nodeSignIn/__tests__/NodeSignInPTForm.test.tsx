import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {PTResource} from '../../../../model/Node';
import {createStore} from '../../../../redux/store';
import {ecBrokerDetails, pspBrokerDetails,} from '../../../../services/__mocks__/nodeService';
import {PTECPSPSigned, PTECSigned, PTPSPSigned, PTUnsigned,} from '../../../../services/__mocks__/partyService';
import NodeSignInPTForm from '../NodeSignInPTForm';
import {createMemoryHistory} from 'history';
import {mockedStationsMerged2} from '../../../../services/__mocks__/stationService';
import {mockedChannelsMerged} from '../../../../services/__mocks__/channelService';
import * as useUserRole from "../../../../hooks/useUserRole";
import * as useOrganizationType from "../../../../hooks/useOrganizationType";
import {ROLE} from "../../../../model/RolePermission";

let spyOnCreateBrokerPsp: jest.SpyInstance<any, unknown[]>;
let spyOnCreateEcBroker: jest.SpyInstance<any, unknown[]>;
let spyOnGetPSPBrokerDetails: jest.SpyInstance<any, unknown[]>;
let spyOnGetBrokerAndEcDetails: jest.SpyInstance<any, unknown[]>;
let spyOnGetStationsMerged: jest.SpyInstance;
let spyOnGetChannelsMerged: jest.SpyInstance;

beforeEach(() => {
    spyOnCreateBrokerPsp = jest.spyOn(require('../../../../services/nodeService'), 'createPspBroker');
    spyOnCreateEcBroker = jest.spyOn(require('../../../../services/nodeService'), 'createEcBroker');
    spyOnGetPSPBrokerDetails = jest.spyOn(
        require('../../../../services/nodeService'),
        'getPSPBrokerDetails'
    );
    spyOnGetBrokerAndEcDetails = jest.spyOn(
        require('../../../../services/nodeService'),
        'getBrokerAndEcDetails'
    );
    spyOnGetStationsMerged = jest.spyOn(
        require("../../../../services/stationService"),
        "getStationsMerged"
    );
    spyOnGetChannelsMerged = jest.spyOn(
        require("../../../../services/channelService"),
        "getChannelsMerged"
    );
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
    jest.mock("../../../../hooks/useOrganizationType");
    jest.mock("../../../../hooks/useUserRole");
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
        userRole: ROLE.PAGOPA_OPERATOR,
        userIsPspAdmin: true,
        userIsEcAdmin: true,
        userIsPspDirectAdmin: true,
        userIsOperator: true,
        userIsAdmin: true
    });
});

const renderApp = (
    signInData: PTResource,
    injectedStore?: ReturnType<typeof createStore>,
    injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
    const store = injectedStore ? injectedStore : createStore();
    const history = injectedHistory ? injectedHistory : createMemoryHistory();
    render(
        <Provider store={store}>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <NodeSignInPTForm goBack={jest.fn()} signInData={signInData}/>
                </ThemeProvider>
            </BrowserRouter>
        </Provider>
    );

    const name = screen.getByTestId('name-test') as HTMLInputElement;
    const businessName = screen.getByTestId('businessName-test') as HTMLInputElement;
    const pspCheckbox = screen
        .getByTestId('psp-checkbox-test')
        .querySelector('input[type="checkbox"]') as HTMLInputElement;
    const ecCheckbox = screen
        .getByTestId('ec-checkbox-test')
        .querySelector('input[type="checkbox"]') as HTMLInputElement;
    const continueBtn = screen.getByTestId('continue-button-test') as HTMLInputElement;

    return {store, history, name, businessName, pspCheckbox, ecCheckbox, continueBtn};
};

describe('<NodeSignInPTForm />', () => {
    test('Test Render NodeSignInPTForm with PT unsigned', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: false,
                    isEcBroker: false,
                    isPspBroker: false,
                },
                isSigned: false
            },
            orgIsBroker: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false

        });
        const {store, name, businessName, pspCheckbox, ecCheckbox, continueBtn} = renderApp({});
        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: PTUnsigned,
            })
        );

        expect(name.value).toBe(PTUnsigned.fiscalCode);
        expect(businessName.value).toBe(PTUnsigned.description);
        expect(pspCheckbox).not.toBeChecked();
        expect(ecCheckbox).not.toBeChecked();
        expect(continueBtn).toBeDisabled();

        fireEvent.change(name, {target: {value: 'name'}});
        expect(name.value).toBe('name');
        fireEvent.change(businessName, {target: {value: 'businessName'}});
        expect(businessName.value).toBe('businessName');
    });

    test('Test Render NodeSignInPTForm with PT PSP/EC signed', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: false,
                    isEcBroker: true,
                    isPspBroker: true,
                },
                isSigned: true
            },
            orgIsBroker: true,
            orgIsEcBrokerSigned: true,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: true,
            orgIsPspDirect: false,
            orgIsPspSigned: false

        });
        const signInData: PTResource = {
            brokerDetailsResource: ecBrokerDetails,
            brokerPspDetailsResource: pspBrokerDetails,
        };

        const {store, name, businessName, pspCheckbox, ecCheckbox, continueBtn} =
            renderApp(signInData);
        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: PTECPSPSigned,
            })
        );

        expect(name.value).toBe(PTECPSPSigned.fiscalCode);
        expect(businessName.value).toBe(PTECPSPSigned.description);
        expect(pspCheckbox).toBeChecked();
        expect(ecCheckbox).toBeChecked();
        expect(continueBtn).toBeDisabled();
    });

    test('Test Render NodeSignInPTForm with PT PSP signed and EC unsigned | submit the form with EC checked', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: true,
                    isEcBroker: false,
                    isPspBroker: true,
                },
                isSigned: true
            },
            orgIsBroker: true,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: true,
            orgIsPspDirect: true,
            orgIsPspSigned: true

        });
        const signInData: PTResource = {
            brokerPspDetailsResource: pspBrokerDetails,
        };

        const {store, name, businessName, pspCheckbox, ecCheckbox, continueBtn} =
            renderApp(signInData);

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: PTPSPSigned,
            })
        );

        await waitFor(() => {
            store.dispatch({
                type: 'parties/setSigninData',
                payload: signInData,
            });
        });

        expect(name.value).toBe(PTPSPSigned.fiscalCode);
        expect(businessName.value).toBe(PTPSPSigned.description);

        expect(pspCheckbox).toBeChecked();
        expect(ecCheckbox).not.toBeChecked();

        fireEvent.click(ecCheckbox);

        expect(ecCheckbox).toBeChecked();

        expect(continueBtn).not.toBeDisabled();

        fireEvent.click(continueBtn);

        await waitFor(() => {
            expect(spyOnCreateEcBroker).toHaveBeenCalled();
            expect(spyOnGetBrokerAndEcDetails).toHaveBeenCalled();
        });
    });

    test('Test Render NodeSignInPTForm with PT EC signed and PSP unsigned | submit the form with PSP checked', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: false,
                    isEcBroker: true,
                    isPspBroker: false,
                },
                isSigned: true
            },
            orgIsBroker: true,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false

        });
        const signInData: PTResource = {
            brokerDetailsResource: ecBrokerDetails
        };

        const {store, name, businessName, pspCheckbox, ecCheckbox, continueBtn} =
            renderApp(signInData);

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: PTECSigned,
            })
        );

        await waitFor(() => {
            store.dispatch({
                type: 'parties/setSigninData',
                payload: signInData,
            });
        });

        expect(name.value).toBe(PTECSigned.fiscalCode);
        expect(businessName.value).toBe(PTECSigned.description);

        expect(pspCheckbox).not.toBeChecked();
        expect(ecCheckbox).toBeChecked();

        fireEvent.click(pspCheckbox);

        expect(pspCheckbox).toBeChecked();

        expect(continueBtn).not.toBeDisabled();

        fireEvent.click(continueBtn);

        await waitFor(() => {
            expect(spyOnCreateBrokerPsp).toHaveBeenCalled();
            expect(spyOnGetPSPBrokerDetails).toHaveBeenCalled();
        });
    });

    test('Test Render NodeSignInPTForm with PT unsigned and submit the form with PSP checked', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: false,
                    isEcBroker: false,
                    isPspBroker: false,
                },
                isSigned: false
            },
            orgIsBroker: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false

        });
        const {store, name, businessName, pspCheckbox, ecCheckbox, continueBtn} = renderApp({});
        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: PTUnsigned,
            })
        );

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setSigninData',
                payload: {},
            })
        );

        expect(name.value).toBe(PTUnsigned.fiscalCode);
        expect(businessName.value).toBe(PTUnsigned.description);

        expect(pspCheckbox).not.toBeChecked();
        expect(ecCheckbox).not.toBeChecked();

        expect(continueBtn).toBeDisabled();

        fireEvent.click(pspCheckbox);

        expect(continueBtn).not.toBeDisabled();

        expect(pspCheckbox).toBeChecked();

        fireEvent.click(continueBtn);

        await waitFor(() => {
            expect(spyOnCreateBrokerPsp).toHaveBeenCalled();
            expect(spyOnGetPSPBrokerDetails).toHaveBeenCalled();
        });
    });

    test('Test Render NodeSignInPTForm with PT unsigned and submit the form with EC checked', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: false,
                    isEcBroker: false,
                    isPspBroker: false,
                },
                isSigned: false
            },
            orgIsBroker: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false

        });
        const {store, name, businessName, pspCheckbox, ecCheckbox, continueBtn} = renderApp({});
        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: PTUnsigned,
            })
        );

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setSigninData',
                payload: {},
            })
        );

        expect(name.value).toBe(PTUnsigned.fiscalCode);
        expect(businessName.value).toBe(PTUnsigned.description);

        expect(pspCheckbox).not.toBeChecked();
        expect(ecCheckbox).not.toBeChecked();

        expect(continueBtn).toBeDisabled();

        fireEvent.click(ecCheckbox);

        expect(continueBtn).not.toBeDisabled();

        expect(ecCheckbox).toBeChecked();

        fireEvent.click(continueBtn);

        await waitFor(() => {
            expect(spyOnCreateEcBroker).toHaveBeenCalled();
            expect(spyOnGetBrokerAndEcDetails).toHaveBeenCalled();
        });
    });

    test('Test Render NodeSignInPTForm PT unsigned and submit the form with PSP and EC checked', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: false,
                    isEcBroker: false,
                    isPspBroker: false,
                },
                isSigned: false
            },
            orgIsBroker: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false

        });
        const {store, name, businessName, pspCheckbox, ecCheckbox, continueBtn} = renderApp({});
        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: PTUnsigned,
            })
        );

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setSigninData',
                payload: {},
            })
        );

        expect(name.value).toBe(PTUnsigned.fiscalCode);
        expect(businessName.value).toBe(PTUnsigned.description);

        expect(pspCheckbox).not.toBeChecked();
        expect(ecCheckbox).not.toBeChecked();

        expect(continueBtn).toBeDisabled();

        fireEvent.click(pspCheckbox);
        fireEvent.click(ecCheckbox);

        expect(continueBtn).not.toBeDisabled();

        expect(pspCheckbox).toBeChecked();
        expect(ecCheckbox).toBeChecked();

        fireEvent.click(continueBtn);

        await waitFor(() => {
            expect(spyOnCreateBrokerPsp).toHaveBeenCalled();
            expect(spyOnCreateEcBroker).toHaveBeenCalled();
            expect(spyOnGetPSPBrokerDetails).toHaveBeenCalled();
            expect(spyOnGetBrokerAndEcDetails).toHaveBeenCalled();
        });
    });

    test('Test catch case of creating brokers api', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: false,
                    isEcBroker: false,
                    isPspBroker: false,
                },
                isSigned: false
            },
            orgIsBroker: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false

        });
        const {store, pspCheckbox, continueBtn} = renderApp({});
        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: PTUnsigned,
            })
        );

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setSigninData',
                payload: {},
            })
        );

        fireEvent.click(pspCheckbox);

        spyOnCreateBrokerPsp.mockRejectedValue(() => {
            throw new Error('Error in createECAndBroker');
        });

        fireEvent.click(continueBtn);
    });

    test('Test submit without selected party', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: false,
                    isEcBroker: false,
                    isPspBroker: false,
                },
                isSigned: false
            },
            orgIsBroker: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false

        });
        const {store, pspCheckbox, continueBtn} = renderApp({});

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setSigninData',
                payload: {},
            })
        );

        fireEvent.click(pspCheckbox);
        fireEvent.click(continueBtn);
    });

    test('Test Render NodeSignInPTForm all checks active', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: false,
                    isEcBroker: false,
                    isPspBroker: false,
                },
                isSigned: false
            },
            orgIsBroker: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false

        });
        spyOnGetStationsMerged.mockReturnValueOnce(Promise.resolve({}));
        spyOnGetChannelsMerged.mockReturnValueOnce(Promise.resolve({}));
        const {store, pspCheckbox, ecCheckbox} = renderApp({});
        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: PTUnsigned,
            })
        );
        await waitFor(() => {
            expect(pspCheckbox).not.toBeDisabled();
            expect(ecCheckbox).not.toBeDisabled();
        });
    });

    test('Test Render NodeSignInPTForm all checks disabled', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: false,
                    isEcBroker: false,
                    isPspBroker: false,
                },
                isSigned: false
            },
            orgIsBroker: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false

        });
        spyOnGetStationsMerged.mockReturnValueOnce(Promise.resolve(mockedStationsMerged2));
        spyOnGetChannelsMerged.mockReturnValueOnce(Promise.resolve(mockedChannelsMerged));
        const {store, pspCheckbox, ecCheckbox} = renderApp({});
        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: PTUnsigned,
            })
        );

        await waitFor(() => {
            expect(pspCheckbox).toBeDisabled();
            expect(ecCheckbox).toBeDisabled();
        });
    });

    test('Test Render NodeSignInPTForm ec check disabled', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: false,
                    isEcBroker: false,
                    isPspBroker: false,
                },
                isSigned: false
            },
            orgIsBroker: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false

        });
        spyOnGetStationsMerged.mockReturnValueOnce(Promise.resolve(mockedStationsMerged2));
        spyOnGetChannelsMerged.mockReturnValueOnce(Promise.resolve({}));
        const {store, pspCheckbox, ecCheckbox} = renderApp({});
        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: PTUnsigned,
            })
        );

        await waitFor(() => {
            expect(pspCheckbox).not.toBeDisabled();
            expect(ecCheckbox).toBeDisabled();
        });
    });

    test('Test Render NodeSignInPTForm psp check disabled', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                types: {
                    isEc: false,
                    isPsp: false,
                    isEcBroker: false,
                    isPspBroker: false,
                },
                isSigned: false
            },
            orgIsBroker: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false

        });
        spyOnGetStationsMerged.mockReturnValueOnce(Promise.resolve({}));
        spyOnGetChannelsMerged.mockReturnValueOnce(Promise.resolve(mockedChannelsMerged));
        const {store, pspCheckbox, ecCheckbox} = renderApp({});
        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: PTUnsigned,
            })
        );

        expect(pspCheckbox).toBeDisabled();
        expect(ecCheckbox).not.toBeDisabled();
    });
});
