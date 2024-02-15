// import React from 'react';
// import { fireEvent, render, screen, waitFor } from '@testing-library/react';
//
// import { Provider } from 'react-redux';
// import { createMemoryHistory } from 'history';
// import { ThemeProvider } from '@mui/material';
// import { theme } from '@pagopa/mui-italia';
// import '../../../locale';
// import { Router } from 'react-router-dom';
//
// import { createStore } from '../../../redux/store';
// import {
//   ecAdminSignedDirect,
//   ecAdminUnsigned,
//   ecOperatorSignedDirect,
//   ecOperatorUnsigned,
// } from '../../../services/__mocks__/partyService';
// import ECRegistrationData from '../components/ECRegistrationData';
// import { brokerAndEcDetailsResource_ECAndBroker } from '../../../services/__mocks__/nodeService';
// import NodeSignInECForm from '../nodeSignIn/NodeSignInECForm';
// import ROUTES from '../../../routes';
// import { act } from 'react-dom/test-utils';
//
// beforeEach(() => {
//   jest.spyOn(console, 'error').mockImplementation(() => {});
//   jest.spyOn(console, 'warn').mockImplementation(() => {});
// });
//
// const renderApp = (
//   injectedStore?: ReturnType<typeof createStore>,
//   injectedHistory?: ReturnType<typeof createMemoryHistory>
// ) => {
//   const store = injectedStore ? injectedStore : createStore();
//   const history = injectedHistory ? injectedHistory : createMemoryHistory();
//   render(
//     <Provider store={store}>
//       <ThemeProvider theme={theme}>
//         <Router history={history}>
//           <ECRegistrationData />
//         </Router>
//       </ThemeProvider>
//     </Provider>
//   );
//   return { store, history };
// };
//
// test('Test rendering ecAdminSigned', async () => {
//   const { store } = renderApp();
//   await waitFor(() =>
//     store.dispatch({
//       type: 'parties/setPartySelected',
//       payload: ecAdminUnsigned,
//     })
//   );
//   expect(screen.queryAllByText('ecAdminUnsigned')[0]).toBeVisible();
// });
//
// test('Test rendering ecOperatorUnsigned', async () => {
//   const { store } = renderApp();
//   await waitFor(() =>
//     store.dispatch({
//       type: 'parties/setPartySelected',
//       payload: ecOperatorUnsigned,
//     })
//   );
//
//   await waitFor(() =>
//     store.dispatch({
//       type: 'parties/setSigninData',
//       payload: {
//         creditorInstitutionDetailsResource:
//           brokerAndEcDetailsResource_ECAndBroker.creditorInstitutionDetailsResource,
//       },
//     })
//   );
//   expect(screen.getByText('Non disponibile')).toBeVisible();
//
//   const modifyBtn = screen.getByTestId('modify-data-test');
//   fireEvent.click(modifyBtn);
// });
//
// test('Test onClick modify button', async () => {
//   const { store, history } = renderApp();
//   await waitFor(() =>
//     store.dispatch({
//       type: 'parties/setPartySelected',
//       payload: ecAdminSignedDirect,
//     })
//   );
//
//   await waitFor(() =>
//     store.dispatch({
//       type: 'parties/setSigninData',
//       payload: brokerAndEcDetailsResource_ECAndBroker,
//     })
//   );
//   const modifyBtn = screen.getByTestId('modify-data-test');
//   fireEvent.click(modifyBtn);
//
//   expect(history.location.pathname).toBe(ROUTES.NODE_SIGNIN);
// });
