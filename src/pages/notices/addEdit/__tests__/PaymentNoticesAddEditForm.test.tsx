import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {institutionsData} from '../../../../services/__mocks__/noticesService';
import PaymentNoticesAddEditForm from '../PaymentNoticesAddEditForm';


beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

describe('PaymentNoticesAddEditForm', () => {
    it('Test render PaymentNoticesAddEditForm', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/payments-notices/addedit`]}>
                    <Route path="/payments-notices/addedit">
                        <ThemeProvider theme={theme}>
                            <PaymentNoticesAddEditForm data={institutionsData} goBack={() => ""}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });
    it('Test render PaymentNoticesAddEditForm should allow go back button click', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/payments-notices/addedit`]}>
                    <Route path="/payments-notices/addedit">
                        <ThemeProvider theme={theme}>
                            <PaymentNoticesAddEditForm data={institutionsData} goBack={() => ""}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
        const backButton = screen.getByTestId('back-button-test');
        fireEvent.click(backButton);
    });
    it('Test render PaymentNoticesAddEditForm should open info dialog', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/payments-notices/addedit`]}>
                    <Route path="/payments-notices/addedit">
                        <ThemeProvider theme={theme}>
                            <PaymentNoticesAddEditForm data={institutionsData} goBack={() => ""}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
        const openDialog = screen.getByTestId('pay-info-button');
        fireEvent.click(openDialog);
        const closeDialogButton = screen.getByTestId('dialog-button');
        fireEvent.click(closeDialogButton);
    });
    it('Test render PaymentNoticesAddEditForm should switch poste section', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/payments-notices/addedit`]}>
                    <Route path="/payments-notices/addedit">
                        <ThemeProvider theme={theme}>
                            <PaymentNoticesAddEditForm data={institutionsData} goBack={() => ""}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
        const posteRadioYes = screen.getByTestId('poste-radio-yes');
        fireEvent.click(posteRadioYes);
        const paymentTypeSelect = screen.getByTestId('paymentType-select-test');
        fireEvent.click(paymentTypeSelect);
        const posteRadioNo = screen.getByTestId('poste-radio-no');
        fireEvent.click(posteRadioNo);
    });
    it('Test render PaymentNoticesAddEditForm should switch pay section', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/payments-notices/addedit`]}>
                    <Route path="/payments-notices/addedit">
                        <ThemeProvider theme={theme}>
                            <PaymentNoticesAddEditForm data={institutionsData} goBack={() => ""}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
        const payRadioYes = screen.getByTestId('pay-radio-yes');
        fireEvent.click(payRadioYes);
        const payRadioNo = screen.getByTestId('pay-radio-no');
        fireEvent.click(payRadioNo);
    });
    it('Test render PaymentNoticesAddEditForm should allow submit button click', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/payments-notices/addedit`]}>
                    <Route path="/payments-notices/addedit">
                        <ThemeProvider theme={theme}>
                            <PaymentNoticesAddEditForm data={institutionsData} goBack={() => ""}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
        const submitButton = screen.getByTestId('submit-button-test');
        fireEvent.click(submitButton);
    });
});
