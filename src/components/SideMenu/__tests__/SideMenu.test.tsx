// import React from 'react';
// import { Provider } from 'react-redux';
// import {
//   fireEvent,
//   queryAllByText,
//   queryByText,
//   render,
//   screen,
//   waitFor,
// } from '@testing-library/react';
// import * as usePermissions from '../../../hooks/usePermissions';
// import * as ENV from '../../../utils/env';
// import { createMemoryHistory } from 'history';
// import SideMenu from '../SideMenu';
// import { ThemeProvider } from '@mui/material';
// import { Router } from 'react-router-dom';
// import { theme } from '@pagopa/mui-italia';
// import { createStore } from '../../../redux/store';
// import {
//   ecAdminSignedDirect,
//   pspAdminSignedDirect,
//   pspAdminUnsigned,
// } from '../../../services/__mocks__/partyService';
// import ROUTES from '../../../routes';
// import { pspDetails } from '../../../services/__mocks__/nodeService';
//
// beforeEach(() => {
//   jest.spyOn(console, 'error').mockImplementation(() => {});
//   jest.spyOn(console, 'warn').mockImplementation(() => {});
// });
//
// afterEach(() => {
//   jest.restoreAllMocks();
// });
//
// const renderApp = (
//   injectedStore?: ReturnType<typeof createStore>,
//   injectedHistory?: ReturnType<typeof createMemoryHistory>
// ) => {
//   const store = injectedStore ? injectedStore : createStore();
//   const history = injectedHistory ? injectedHistory : createMemoryHistory();
//   render(
//     <ThemeProvider theme={theme}>
//       <Router history={history}>
//         <Provider store={store}>
//           <SideMenu />
//         </Provider>
//       </Router>
//     </ThemeProvider>
//   );
//   return { store, history };
// };
//
// describe('SideMenu component', () => {
//   jest.mock('../../../hooks/usePermissions');
//
//   test('should render SideMenu', async () => {
//     jest
//       .spyOn(usePermissions, 'usePermissions')
//       .mockReturnValue({ hasPermission: (permissionName) => true });
//
//     const { store } = renderApp();
//     await waitFor(() =>
//       store.dispatch({
//         type: 'parties/setPartySelected',
//         payload: pspAdminUnsigned,
//       })
//     );
//     const homeItem = screen.getByTestId('home-test');
//     expect(homeItem).toBeInTheDocument();
//
//     const apikeys = await screen.findByText('sideMenu.apikeys.title');
//     fireEvent.click(apikeys);
//
//     const home = await screen.findByText('sideMenu.home.title');
//     fireEvent.click(home);
//
//     const channels = await screen.findByText('sideMenu.channels.title');
//     fireEvent.click(channels);
//
//     await waitFor(() =>
//       store.dispatch({
//         type: 'parties/setPartySelected',
//         payload: ecAdminSignedDirect,
//       })
//     );
//     const stations = await screen.findByText('sideMenu.stations.title');
//     fireEvent.click(stations);
//
//     const ibans = await screen.findByText('sideMenu.iban.title');
//     fireEvent.click(ibans);
//   });
//
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
//     const commPackagesItem = screen.getByTestId('commission-packages-test');
//
//     expect(commPackagesItem).toBeInTheDocument();
//     fireEvent.click(commPackagesItem);
//
//     await waitFor(() => expect(history.location.pathname).toBe(ROUTES.COMMISSION_PACKAGES));
//   });
//
//   test('should render SideMenu', async () => {
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
//     const commPackagesItem = screen.getByTestId('commission-packages-test') as HTMLElement;
//
//     await waitFor(() =>
//       store.dispatch({
//         type: 'parties/setSigninData',
//         payload: pspDetails,
//       })
//     );
//
//     expect(commPackagesItem).toHaveAttribute('aria-disabled');
//   });
//
//   test('should render SideMenu', async () => {
//     jest.mock('../../../utils/env');
//     ENV.ENV.FEATURES.DASHBOARD.ENABLED = false;
//
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
//     const apiKeyItem = screen.getByTestId('apikeys-test') as HTMLElement;
//     const dashboardItem = screen.queryAllByTestId('home-test');
//
//     expect(apiKeyItem).toBeVisible();
//     expect(dashboardItem.length).toBeLessThanOrEqual(0);
//   });
//
//   test('should render SideMenu', async () => {
//     jest
//       .spyOn(usePermissions, 'usePermissions')
//       .mockReturnValue({ hasPermission: (permissionName) => true });
//     const { store, history } = renderApp();
//
//     await waitFor(() =>
//       store.dispatch({
//         type: 'parties/setPartySelected',
//         payload: pspAdminUnsigned,
//       })
//     );
//   });
// });
