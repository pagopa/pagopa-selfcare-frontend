import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
<<<<<<< HEAD
import {cleanup, render, waitFor, screen, fireEvent} from '@testing-library/react';
=======
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
>>>>>>> 3f32cfc3 (Formatting (#542))
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {Provider} from 'react-redux';
import React from 'react';
import * as PaymentsReceiptsService from '../../../../services/paymentsReceiptsService';
import PaymentsReceiptsTable from '../PaymentsReceiptsTable';
import {mockedPaymentsReceiptsList} from '../../../../services/__mocks__/paymentsReceiptsService';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

const mock = jest.spyOn(PaymentsReceiptsService, 'getPaymentsReceipts');
const mockDetails = jest.spyOn(PaymentsReceiptsService, 'getPaymentReceiptDetail');

afterEach(cleanup);

describe('<PaymentsReceiptsTable />', () => {
    global.URL.createObjectURL = jest.fn();
    test('render component PaymentsReceiptsTable with receipt list', async () => {
        mock.mockReturnValueOnce(new Promise((resolve) => resolve(mockedPaymentsReceiptsList)));
        mockDetails.mockReturnValueOnce(new Promise((resolve) => resolve("<xml></xml>")))
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/payments-receipts`]}>
                    <Route path="/payments-receipts">
                        <ThemeProvider theme={theme}>
                            <PaymentsReceiptsTable filterDebtorOrIuv={''} filterYear={null} searchTrigger={false}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
            expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
        });

        const downloadReceipt = screen.queryAllByTestId("download-receipt")?.[0];
        expect(downloadReceipt).toBeInTheDocument();

        fireEvent.click(downloadReceipt);

        expect(mockDetails).toBeCalledTimes(1);

        mock.mockReset();
    });

    test('render component PaymentsReceiptsTable without receipt list', async () => {
        mock.mockReturnValueOnce(new Promise((resolve) => resolve({})));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/payments-receipts`]}>
                    <Route path="/payments-receipts">
                        <ThemeProvider theme={theme}>
                            <PaymentsReceiptsTable filterDebtorOrIuv={''} filterYear={null} searchTrigger={false}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('data-grid')).not.toBeInTheDocument();
            expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
        });

        mock.mockReset();
    });

    test('render component PaymentsReceiptsTable getPaymentsReceipts error', async () => {
        mock.mockRejectedValueOnce(new Error("error"));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/payments-receipts`]}>
                    <Route path="/payments-receipts">
                        <ThemeProvider theme={theme}>
                            <PaymentsReceiptsTable filterDebtorOrIuv={''} filterYear={null} searchTrigger={false}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('data-grid')).not.toBeInTheDocument();
            expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
        });

        mock.mockReset();
    });

    test('render component PaymentsReceiptsTable getPaymentReceiptDetail error', async () => {
        mock.mockReturnValueOnce(new Promise((resolve) => resolve(mockedPaymentsReceiptsList)));
        mockDetails.mockRejectedValueOnce(new Error("error"));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/payments-receipts`]}>
                    <Route path="/payments-receipts">
                        <ThemeProvider theme={theme}>
                            <PaymentsReceiptsTable filterDebtorOrIuv={''} filterYear={null} searchTrigger={false}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
            expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
        });

        const downloadReceipt = screen.queryAllByTestId("download-receipt")?.[0];
        expect(downloadReceipt).toBeInTheDocument();

        fireEvent.click(downloadReceipt);

        expect(mockDetails).toBeCalledTimes(1);

        mock.mockReset();
    });
});
