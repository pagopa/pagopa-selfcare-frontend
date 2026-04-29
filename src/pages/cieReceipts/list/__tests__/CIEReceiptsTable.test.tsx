import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render, waitFor, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {Provider} from 'react-redux';
import React from 'react';
import * as PaymentsReceiptsService from '../../../../services/paymentsReceiptsService';
import CIEReceiptsTable from '../CIEReceiptsTable';
import {mockedPaymentsReceiptsList} from '../../../../services/__mocks__/paymentsReceiptsService';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

const mock = jest.spyOn(PaymentsReceiptsService, 'getCIEPaymentsReceipts');
const mockDetails = jest.spyOn(PaymentsReceiptsService, 'getPaymentReceiptDetail');

afterEach(cleanup);

describe('<CIEReceiptsTable />', () => {
    global.URL.createObjectURL = jest.fn();
    test('render component CIEReceiptsTable with receipt list', async () => {
        mock.mockReturnValueOnce(new Promise((resolve) => resolve(mockedPaymentsReceiptsList)));
        mockDetails.mockReturnValueOnce(new Promise((resolve) => resolve("<xml></xml>")))
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/cie-receipts`]}>
                    <Route path="/cie-receipts">
                        <ThemeProvider theme={theme}>
                            <CIEReceiptsTable filterDebtorOrIuv={''} filterYear={null} searchTrigger={false}/>
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

    test('render component CIEReceiptsTable without receipt list', async () => {
        mock.mockReturnValueOnce(new Promise((resolve) => resolve({})));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/cie-receipts`]}>
                    <Route path="/cie-receipts">
                        <ThemeProvider theme={theme}>
                            <CIEReceiptsTable filterDebtorOrIuv={''} filterYear={null} searchTrigger={false}/>
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

    test('render component CIEReceiptsTable getCIEPaymentsReceipts error', async () => {
        mock.mockRejectedValueOnce(new Error("error"));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/cie-receipts`]}>
                    <Route path="/cie-receipts">
                        <ThemeProvider theme={theme}>
                            <CIEReceiptsTable filterDebtorOrIuv={''} filterYear={null} searchTrigger={false}/>
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

    test('render component CIEReceiptsTable getPaymentReceiptDetail error', async () => {
        mock.mockReturnValueOnce(new Promise((resolve) => resolve(mockedPaymentsReceiptsList)));
        mockDetails.mockRejectedValueOnce(new Error("error"));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/cie-receipts`]}>
                    <Route path="/cie-receipts">
                        <ThemeProvider theme={theme}>
                            <CIEReceiptsTable filterDebtorOrIuv={''} filterYear={null} searchTrigger={false}/>
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
