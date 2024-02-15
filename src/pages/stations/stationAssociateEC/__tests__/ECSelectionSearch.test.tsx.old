// import {ThemeProvider} from '@mui/system';
// import {theme} from '@pagopa/mui-italia';
// import {cleanup, fireEvent, render, screen} from '@testing-library/react';
// import React from 'react';
// import {MemoryRouter, Route} from 'react-router-dom';
// import {store} from '../../../../redux/store';
// import {Provider} from 'react-redux';
// import ECSelectionSearch from '../ECSelectionSearch';
// import {Delegation} from '../../../../api/generated/portal/Delegation';
//
// beforeEach(() => {
//     jest.spyOn(console, 'error').mockImplementation(() => {
//     });
//     jest.spyOn(console, 'warn').mockImplementation(() => {
//     });
// });
//
// afterEach(cleanup);
//
// describe('<ECSelectionSearch />', () => {
//     const stationId = 'XPAY_03_ONUS';
//
//     const availableEC: Array<Delegation> = [
//         {
//             broker_id: '01234567890',
//             broker_name: 'EC 1',
//             id: 'b6207adb-7a72-42d4-9d77-c884e8a0bf43',
//             institution_id: 'a761ceeb-6014-4620-9c5b-c66898527a43',
//             institution_name: "Comune di Budduso'",
//             product_id: 'prod-pagopa',
//             type: 'PT',
//         },
//         {
//             broker_id: '01234567891',
//             broker_name: 'EC 2',
//             id: 'b6207adb-7a72-42d4-9d77-c884e8a0bf43',
//             institution_id: 'a761ceeb-6014-4620-9c5b-c66898527a43',
//             institution_name: "Comune di Budduso'",
//             product_id: 'prod-pagopa',
//             type: 'PT',
//         },
//         {
//             broker_id: '01234567892',
//             broker_name: 'EC 2',
//             id: 'b6207adb-7a72-42d4-9d77-c884e8a0bf43',
//             institution_id: 'a761ceeb-6014-4620-9c5b-c66898527a43',
//             institution_name: "Comune di Budduso'",
//             product_id: 'prod-pagopa',
//             type: 'PT',
//         },
//     ];
//
//     const onECSelectionChange = jest.fn();
//
//     test('render component ECSelectionSearch with available EC and EC selected', async () => {
//         render(
//             <Provider store={store}>
//                 <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
//                     <Route path="/stations/:stationId/associate-ec">
//                         <ThemeProvider theme={theme}>
//                             <ECSelectionSearch
//                                 availableEC={availableEC}
//                                 selectedEC={undefined}
//                                 onECSelectionChange={onECSelectionChange}
//                             />
//                         </ThemeProvider>
//                     </Route>
//                 </MemoryRouter>
//             </Provider>
//         );
//
//         const ecSelectionSearch = screen.getByTestId('ec-selection-search');
//         expect(ecSelectionSearch).toBeInTheDocument();
//
//         fireEvent.change(ecSelectionSearch, {target: {value: 'EC 1'}});
//         const filteredEC = screen.getByDisplayValue('EC 1');
//         const searchButton = screen.getByTestId('search-field-test');
//         fireEvent.click(searchButton);
//         expect(filteredEC).toBeInTheDocument();
//
//         fireEvent.click(filteredEC);
//         expect(onECSelectionChange).toHaveBeenCalledWith({
//             brokerId: '01234567890',
//             brokerName: 'EC 1',
//             id: 'b6207adb-7a72-42d4-9d77-c884e8a0bf43',
//             institutionId: 'a761ceeb-6014-4620-9c5b-c66898527a43',
//             institutionName: "Comune di Budduso'",
//             productId: 'prod-pagopa',
//             type: 'PT',
//         });
//
//         const filteredECContainer = screen.getByTestId('PartyItemContainer: EC 1');
//         fireEvent.click(filteredECContainer);
//
//         const clearButton = screen.getByTestId('clear-field-test');
//         fireEvent.click(clearButton);
//     });
//
//     test('render component ECSelectionSearch without available EC and EC selected', async () => {
//         render(
//             <Provider store={store}>
//                 <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
//                     <Route path="/stations/:stationId/associate-ec">
//                         <ThemeProvider theme={theme}>
//                             <ECSelectionSearch
//                                 availableEC={[]}
//                                 selectedEC={undefined}
//                                 onECSelectionChange={onECSelectionChange}
//                             />
//                         </ThemeProvider>
//                     </Route>
//                 </MemoryRouter>
//             </Provider>
//         );
//     });
// });
