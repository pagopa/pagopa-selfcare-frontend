import React from 'react';
import {Provider} from 'react-redux';
import {fireEvent, render, screen, waitFor,} from '@testing-library/react';
import * as usePermissions from '../../../hooks/usePermissions';
import * as useOrganizationType from '../../../hooks/useOrganizationType';
import * as useUserRole from '../../../hooks/useUserRole';
import {createMemoryHistory} from 'history';
import SideMenu from '../SideMenu';
import {ThemeProvider} from '@mui/material';
import {Router} from 'react-router-dom';
import {theme} from '@pagopa/mui-italia';
import {createStore} from '../../../redux/store';
import {ecAdminSignedDirect, pspAdminUnsigned,} from '../../../services/__mocks__/partyService';
import {ROLE} from "../../../model/RolePermission";

jest.mock("../../../hooks/useUserRole");

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(usePermissions, 'usePermissions').mockReturnValue({
    userHasPermission: () => true,
  });
  jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
    orgInfo: {
      types: {
        isPsp: true,
        isPspBroker: true,
        isEc: true,
        isEcBroker: true
      },
      isSigned: true
    },
    orgIsPspDirect: true,
    orgIsEcDirect: true,
    orgIsBroker: true,
    orgIsPspSigned: true,
    orgIsPspBrokerSigned: true,
    orgIsEcSigned: true,
    orgIsEcBrokerSigned: true
  });
  jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
    userRole: ROLE.PSP_ADMIN,
    userIsPspAdmin: false,
    userIsEcAdmin: false,
    userIsPspDirectAdmin: false,
    userIsOperator: false,
    userIsAdmin: true
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Provider store={store}>
          <SideMenu />
        </Provider>
      </Router>
    </ThemeProvider>
  );
  return { store, history };
};

describe('SideMenu component', () => {
  jest.mock('../../../hooks/usePermissions');


  test('should render SideMenu 1', async () => {
    const { store } = renderApp();

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: pspAdminUnsigned,
      })
    );
    const homeItem = screen.getByTestId('home-test');
    expect(homeItem).toBeInTheDocument();

    const apikeys = await screen.findByText('sideMenu.apikeys.title');
    fireEvent.click(apikeys);

    const home = await screen.findByText('sideMenu.home.title');
    fireEvent.click(home);

    const channels = await screen.findByText('sideMenu.channels.title');
    fireEvent.click(channels);

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecAdminSignedDirect,
      })
    );
    const stations = await screen.findByText('sideMenu.stations.title');
    fireEvent.click(stations);

    const ibans = await screen.findByText('sideMenu.iban.title');
    fireEvent.click(ibans);
  });

  //   test('should render SideMenu with psp admin unsigned', async () => {
  //     jest
  //       .spyOn(usePermissions, 'usePermissions')
  //       .mockReturnValue({ hasPermission: (permissionName) => true });
  //
  //     const { store, history } = renderApp();
  //     await waitFor(() =>
  //       store.dispatch({
  //         type: 'parties/setPartySelected',
  //         payload: pspAdminUnsigned,
  //       })
  //     );
  //
  //     const commBundlesItem = screen.getByTestId('commission-bundles-test');
  //
  //     expect(commBundlesItem).toBeInTheDocument();
  //     fireEvent.click(commBundlesItem);
  //
  //     await waitFor(() => expect(history.location.pathname).toBe(ROUTES.COMMISSION_BUNDLES));
  //   });

  //   test('should render SideMenu 2', async () => {
  //     jest
  //       .spyOn(usePermissions, 'usePermissions')
  //       .mockReturnValue({ hasPermission: (permissionName) => true });
  //
  //     const { store, history } = renderApp();
  //
  //     await waitFor(() =>
  //       store.dispatch({
  //         type: 'parties/setPartySelected',
  //         payload: pspAdminUnsigned,
  //       })
  //     );
  //
  //     const commBundlesItem = screen.getByTestId('commission-bundles-test') as HTMLElement;
  //
  //     await waitFor(() =>
  //       store.dispatch({
  //         type: 'parties/setSigninData',
  //         payload: pspDetails,
  //       })
  //     );
  //
  //     expect(commBundlesItem).toHaveAttribute('aria-disabled');
  //   });


  test('should render SideMenu 4', async () => {
    const { store, history } = renderApp();

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: pspAdminUnsigned,
      })
    );
  });

  test('should render SideMenu with users', async () => {
    jest.mock('../../../utils/env');

    const { store, history } = renderApp();

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: pspAdminUnsigned,
      })
    );

    const users = await screen.getByTestId('selfcare-users-test');
    fireEvent.click(users);
  });

  test('should render SideMenu with groups', async () => {
    jest.mock('../../../utils/env');

    const { store, history } = renderApp();

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: pspAdminUnsigned,
      })
    );

    const users = await screen.getByTestId('selfcare-groups-test');
    fireEvent.click(users);
  });
});
