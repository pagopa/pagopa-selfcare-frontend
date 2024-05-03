import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {createMemoryHistory} from 'history';
import '../../../locale';
import React from 'react';

import {Provider} from 'react-redux';
import {ThemeProvider} from '@mui/material';
import {theme} from '@pagopa/mui-italia';
import {Router} from 'react-router-dom';
import {createStore} from '../../../redux/store';
import {pspAdminSignedDirect, pspAdminUnsigned,} from '../../../services/__mocks__/partyService';
import {SigninData} from '../../../model/Node';
import {brokerOrPspDetailsResource_PSPAndBroker} from '../../../services/__mocks__/nodeService';
import ROUTES from '../../../routes';
import * as usePermissions from '../../../hooks/usePermissions';
import * as useUserRole from '../../../hooks/useUserRole';
import * as useOrganizationType from '../../../hooks/useOrganizationType';
import {ROLE} from "../../../model/RolePermission";
import PSPRegistrationData from "../components/PSPRegistrationData";

const signInData: SigninData = {};

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

jest.mock("../../components/commonFunctions");
jest.mock('../../../hooks/usePermissions');
jest.mock('../../../hooks/useUserRole');
jest.mock('../../../hooks/useOrganizationType');
jest.setTimeout(30000)


const renderApp = (
    injectedStore?: ReturnType<typeof createStore>,
    injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
    const store = injectedStore ? injectedStore : createStore();
    const history = injectedHistory ? injectedHistory : createMemoryHistory();
    render(
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <PSPRegistrationData/>
                </Router>
            </ThemeProvider>
        </Provider>
    );
    return {store, history};
};

test('Test rendering ', async () => {
    jest.spyOn(usePermissions, 'usePermissions').mockReturnValue({
        userHasPermission: (_) => true,
    });
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
        userRole: ROLE.PSP_ADMIN,
        userIsPspAdmin: true,
        userIsEcAdmin: false,
        userIsPspDirectAdmin: false,
        userIsOperator: false,
        userIsAdmin: false,
    });
    jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
        orgInfo: {
            isSigned: true,
            types: {
                isEc: false,
                isPsp: true,
                isEcBroker: false,
                isPspBroker: false,
            }
        },

        orgIsPspDirect: true,
        orgIsEcDirect: false,
        orgIsBroker: false,

        orgIsPspSigned: true,
        orgIsPspBrokerSigned: false,
        orgIsEcSigned: false,
        orgIsEcBrokerSigned: false,
    });
    const {store} = renderApp();
    await waitFor(() =>
        store.dispatch({
            type: 'parties/setPartySelected',
            payload: pspAdminUnsigned,
        })
    );
    expect(screen.queryByText('PSP Admin unsigned')).toBeVisible();
});

test('Test rendering digitalStamp false, bic undefined ', async () => {
    jest.spyOn(usePermissions, 'usePermissions').mockReturnValue({
        userHasPermission: (_) => true,
    });
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
        userRole: ROLE.PSP_ADMIN,
        userIsPspAdmin: true,
        userIsEcAdmin: false,
        userIsPspDirectAdmin: false,
        userIsOperator: false,
        userIsAdmin: false,
    });
    jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
        orgInfo: {
            isSigned: true,
            types: {
                isEc: false,
                isPsp: true,
                isEcBroker: false,
                isPspBroker: false,
            }
        },

        orgIsPspDirect: true,
        orgIsEcDirect: false,
        orgIsBroker: false,

        orgIsPspSigned: true,
        orgIsPspBrokerSigned: false,
        orgIsEcSigned: false,
        orgIsEcBrokerSigned: false,
    });
    const {store} = renderApp();
    await waitFor(() =>
        store.dispatch({
            type: 'parties/setPartySelected',
            payload: pspAdminUnsigned,
        })
    );
    await waitFor(() =>
        store.dispatch({
            type: 'parties/setSigninData',
            payload: {
                paymentServiceProviderDetailsResource: {
                    stamp: false,
                    bic: '123',
                },
            },
        })
    );
    expect(screen.queryAllByText('No').length).toBe(1);
});

test('Test rendering digitalStamp undefined ', async () => {
    jest.spyOn(usePermissions, 'usePermissions').mockReturnValue({
        userHasPermission: (_) => true,
    });
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
        userRole: ROLE.PSP_ADMIN,
        userIsPspAdmin: true,
        userIsEcAdmin: false,
        userIsPspDirectAdmin: false,
        userIsOperator: false,
        userIsAdmin: false,
    });
    jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
        orgInfo: {
            isSigned: true,
            types: {
                isEc: false,
                isPsp: true,
                isEcBroker: false,
                isPspBroker: false,
            }
        },

        orgIsPspDirect: true,
        orgIsEcDirect: false,
        orgIsBroker: false,

        orgIsPspSigned: true,
        orgIsPspBrokerSigned: false,
        orgIsEcSigned: false,
        orgIsEcBrokerSigned: false,
    });
    const {store} = renderApp();
    await waitFor(() =>
        store.dispatch({
            type: 'parties/setPartySelected',
            payload: pspAdminUnsigned,
        })
    );
    await waitFor(() =>
        store.dispatch({
            type: 'parties/setSigninData',
            payload: {
                paymentServiceProviderDetailsResource: {},
            },
        })
    );

    expect(screen.queryAllByText('-').length).toBe(3);
});

test('Test onClick modify button', async () => {
    jest.spyOn(usePermissions, 'usePermissions').mockReturnValue({
        userHasPermission: (_) => true,
    });
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
        userRole: ROLE.PSP_ADMIN,
        userIsPspAdmin: true,
        userIsEcAdmin: false,
        userIsPspDirectAdmin: false,
        userIsOperator: false,
        userIsAdmin: false,
    });
    jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
        orgInfo: {
            isSigned: true,
            types: {
                isEc: false,
                isPsp: true,
                isEcBroker: false,
                isPspBroker: false,
            }
        },

        orgIsPspDirect: true,
        orgIsEcDirect: false,
        orgIsBroker: false,

        orgIsPspSigned: true,
        orgIsPspBrokerSigned: false,
        orgIsEcSigned: false,
        orgIsEcBrokerSigned: false,
    });
    const {store, history} = renderApp();
    await waitFor(() =>
        store.dispatch({
            type: 'parties/setPartySelected',
            payload: pspAdminSignedDirect,
        })
    );

    await waitFor(() =>
        store.dispatch({
            type: 'parties/setSigninData',
            payload: brokerOrPspDetailsResource_PSPAndBroker,
        })
    );

    const modifyBtn = screen.getByTestId('modify-data-test');
    fireEvent.click(modifyBtn);

    expect(history.location.pathname).toBe("/" + ROUTES.NODE_SIGNIN);
});
