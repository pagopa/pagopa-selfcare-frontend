// import React from 'react';
// import { fireEvent, render, screen } from '@testing-library/react';
// import IbanTable from '../IbanTable';
// import { ThemeProvider } from '@mui/system';
// import { theme } from '@pagopa/mui-italia';
// import { Provider } from 'react-redux';
// import { store } from '../../../../redux/store';
// import { Router } from 'react-router';
// import { createMemoryHistory } from 'history';
// import { ibanList, mockedIban } from '../../../../services/__mocks__/ibanService';
//
// beforeEach(() => {
//   jest.spyOn(console, 'error').mockImplementation(() => {});
//   jest.spyOn(console, 'warn').mockImplementation(() => {});
// });
//
// describe('IbanTable', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
//   const history = injectedHistory ? injectedHistory : createMemoryHistory();
//   const emptyIbanList = { ibanList: [], error: false, loading: false };
//
//   it('Test render IbanDetailPage', () => {
//     render(
//       <Provider store={store}>
//         <Router history={history}>
//           <ThemeProvider theme={theme}>
//             <IbanTable ibanList={emptyIbanList} error={false} loading={false} />
//           </ThemeProvider>
//         </Router>
//       </Provider>
//     );
//   });
//
//   it('should render table with data', () => {
//     render(
//       <Provider store={store}>
//         <Router history={history}>
//           <ThemeProvider theme={theme}>
//             <IbanTable ibanList={ibanList} error={false} loading={false} />
//           </ThemeProvider>
//         </Router>
//       </Provider>
//     );
//
//     // Assert table headers
//     expect(screen.getByText('ibanPage.list.column.ibanCode')).toBeInTheDocument();
//     expect(screen.getByText('ibanPage.list.column.description')).toBeInTheDocument();
//     // expect(screen.getByText('ibanPage.list.column.status')).toBeInTheDocument();
//   });
// });
