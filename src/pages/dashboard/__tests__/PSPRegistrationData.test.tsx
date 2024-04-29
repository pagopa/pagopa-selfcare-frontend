import {fireEvent, screen, waitFor} from '@testing-library/react';
import {createMemoryHistory} from 'history';
import '../../../locale';

import {createStore} from '../../../redux/store';
import {pspAdminSignedDirect, pspAdminUnsigned,} from '../../../services/__mocks__/partyService';
import {SigninData} from '../../../model/Node';
import {brokerOrPspDetailsResource_PSPAndBroker} from '../../../services/__mocks__/nodeService';
import ROUTES from '../../../routes';
import * as usePermissions from '../../../hooks/usePermissions';
import * as useUserRole from '../../../hooks/useUserRole';
import * as useOrganizationType from '../../../hooks/useOrganizationType';
import {ROLE} from "../../../model/RolePermission";

const signInData: SigninData = {};

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

jest.mock("../../components/commonFunctions");
jest.mock('../../../../hooks/usePermissions');
jest.mock('../../../../hooks/useUserRole');
jest.mock('../../../../hooks/useOrganizationType');


const renderApp = (
    injectedStore?: ReturnType<typeof createStore>,
    injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
    const store = injectedStore ? injectedStore : createStore();
    const history = injectedHistory ? injectedHistory : createMemoryHistory();
    jest.spyOn(usePermissions, 'usePermissions').mockReturnValue({
        userHasPermission: (_) => true,
    });
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
        userRole: ROLE.PSP_ADMIN,
        userIsPspAdmin: true,
        userIsEcAdmin: false,
        userIsPspDirectAdmin: false,
        userIsOperator: false,
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

        orgIsPspDirect: () => true,
        orgIsEcDirect: () => false,
        orgIsDirect: () => false,

        orgIsPspSigned: () => true,
        orgIsPspBrokerSigned: () => false,
        orgIsEcSigned: () => false,
        orgIsEcBrokerSigned: () => false,
    });
    return {store, history};
};

test('Test rendering ', async () => {
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
