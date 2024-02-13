// import React from 'react';
// import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import { ThemeProvider } from '@mui/system';
// import { theme } from '@pagopa/mui-italia';
// import { Provider } from 'react-redux';
// import { MemoryRouter, Route, Router } from 'react-router-dom';
// import { createStore, store } from '../../../../redux/store';
// import { createMemoryHistory } from 'history';
// import AddEditOperationTablePage from '../AddEditOperationTablePage';
// import ROUTES from '../../../../routes';
// import { ecAdminSignedDirect } from '../../../../services/__mocks__/partyService';
//
// let getOperationTableDetailsMocked;
// beforeEach(() => {
//   jest.spyOn(console, 'error').mockImplementation(() => {});
//   jest.spyOn(console, 'warn').mockImplementation(() => {});
//   getOperationTableDetailsMocked = jest.spyOn(
//     require('../../../../services/operationTable'),
//     'getOperationTableDetails'
//   );
// });
//
// const renderApp = (
//   injectedHistory?: ReturnType<typeof createMemoryHistory>,
//   injectedStore?: ReturnType<typeof createStore>
// ) => {
//   const store = injectedStore ? injectedStore : createStore();
//   const history = injectedHistory ? injectedHistory : createMemoryHistory();
//   render(
//     <ThemeProvider theme={theme}>
//       <Router history={history}>
//         <Provider store={store}>
//           <AddEditOperationTablePage />
//         </Provider>
//       </Router>
//     </ThemeProvider>
//   );
//   return { store, history };
// };
//
// describe('AddEditOperationTablePage', () => {
//   test('Test render AddEditOperationTablePage', async () => {
//     const { store, history } = renderApp();
//     await waitFor(() =>
//       store.dispatch({
//         type: 'parties/setPartySelected',
//         payload: ecAdminSignedDirect,
//       })
//     );
//     const backBtn = screen.getByTestId('back-button-test');
//     await waitFor(() => fireEvent.click(backBtn));
//     await waitFor(() => expect(history.location.pathname).toBe(ROUTES.HOME));
//   });
//
//   test('Test render OperationTableDetailPage error', async () => {
//     getOperationTableDetailsMocked.mockRejectedValueOnce(new Error('Fetch error'));
//     const { history } = renderApp();
//   });
// });
