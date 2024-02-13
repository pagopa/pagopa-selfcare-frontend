// import React from 'react';
// import { fireEvent, render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import StandInAndCupForm from '../StandInAndCupForm';
// import { ThemeProvider } from '@mui/system';
// import { theme } from '@pagopa/mui-italia';
// import { Provider } from 'react-redux';
// import { MemoryRouter, Route } from 'react-router-dom';
// import { store } from '../../../../redux/store';
// import { ibanList, mockedIban } from '../../../../services/__mocks__/ibanService';
// import { IbansResource } from '../../../../api/generated/portal/IbansResource';
//
// beforeEach(() => {
//   jest.spyOn(console, 'error').mockImplementation(() => {});
//   jest.spyOn(console, 'warn').mockImplementation(() => {});
// });
//
// describe('StandInAndCupForm', () => {
//   it('Test render StandInAndCupForm', () => {
//     render(
//       <Provider store={store}>
//         <MemoryRouter initialEntries={[`/iban`]}>
//           <Route path="/iban">
//             <ThemeProvider theme={theme}>
//               <StandInAndCupForm ibanList={ibanList} error={false} loading={false} />
//             </ThemeProvider>
//           </Route>
//         </MemoryRouter>
//       </Provider>
//     );
//   });
//
//   it('Input test with manageButton false', async () => {
//     const ibanListMocked: IbansResource = {
//       ibanList: [
//         {
//           iban: 'IT60X0542811101000000123456',
//           publicationDate: new Date('2024-06-01T23:59:59.999Z'),
//           validityDate: new Date('2024-04-01T13:49:19.897Z'),
//           dueDate: new Date('2024-04-01T13:49:19.897Z'),
//           ecOwner: 'RSSMRA98H27F205Q',
//           description: 'Tassa di concorso - servizio tesoreria comunale',
//           active: true,
//         },
//         {
//           iban: 'IT60X0542811101000000123457',
//           publicationDate: new Date('2024-06-01T23:59:59.999Z'),
//           validityDate: new Date('2024-04-01T13:49:19.897Z'),
//           dueDate: new Date('2024-04-01T13:49:19.897Z'),
//           ecOwner: 'RSSMRA98H27F205Q',
//           labels: [],
//           description: 'Tassa di concorso - servizio tesoreria comunale',
//           active: true,
//         },
//       ],
//     };
//
//     render(
//       <Provider store={store}>
//         <MemoryRouter initialEntries={[`/iban`]}>
//           <Route path="/iban">
//             <ThemeProvider theme={theme}>
//               <StandInAndCupForm ibanList={ibanListMocked} error={false} loading={false} />
//             </ThemeProvider>
//           </Route>
//         </MemoryRouter>
//       </Provider>
//     );
//
//     const manageButton = screen.getByTestId('iban-manage-btn');
//     fireEvent.click(manageButton);
//
//     const manageChip = screen.getByText('ibanPage.updateInProgress');
//     expect(manageChip).toBeInTheDocument();
//
//     const standInIbanSelect = screen.getByTestId('stand-in-test');
//     fireEvent.click(standInIbanSelect);
//
//     const cupIbanSelect = screen.getByTestId('cup-test');
//
//     fireEvent.change(standInIbanSelect, { target: { value: 'IT60X0542811101000000123456' } });
//     fireEvent.change(cupIbanSelect, { target: { value: 'IT60X0542811101000000123457' } });
//
//     const uploadIbans = screen.getByTestId('upload-iban-test');
//     fireEvent.click(uploadIbans);
//
//     const confirmBtn = await screen.findByTestId('confirm-button-test');
//     fireEvent.click(confirmBtn);
//
//     fireEvent.submit(confirmBtn);
//
//     const backBtn = screen.getByTestId('back-button-test');
//     fireEvent.click(backBtn);
//   });
//
//   it('Input test with manageButton true', () => {
//     render(
//       <Provider store={store}>
//         <MemoryRouter initialEntries={[`/iban`]}>
//           <Route path="/iban">
//             <ThemeProvider theme={theme}>
//               <StandInAndCupForm ibanList={ibanList} error={false} loading={false} />
//             </ThemeProvider>
//           </Route>
//         </MemoryRouter>
//       </Provider>
//     );
//
//     const ibanStandInValue = screen.getByTestId('iban-standin-with-manage-btn-false');
//     const ibanCupValue = screen.getByTestId('iban-cup-with-manage-btn-false');
//
//     expect(ibanStandInValue).toBeInTheDocument();
//     expect(ibanCupValue).toBeInTheDocument();
//   });
// });
