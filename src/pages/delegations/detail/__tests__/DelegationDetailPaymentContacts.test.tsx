import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {mockedCIContacts} from '../../../../services/__mocks__/creditorInstitutionService';
import DelegationDetailPaymentContacts from '../DelegationDetailPaymentContacts';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('<DelegationDetailPaymentContacts />', () => {
    test('render component Drawer with single payment contact', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/delegations-list/detail`]}>
                    <Route path="/delegations-list/detail">
                        <ThemeProvider theme={theme}>
                            <DelegationDetailPaymentContacts paymentContacts={[mockedCIContacts[0]]}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('payment-contact-column')).toBeInTheDocument();
        });
    });

    test('render component Drawer with payment contact list', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/delegations-list/detail`]}>
                    <Route path="/delegations-list/detail">
                        <ThemeProvider theme={theme}>
                            <DelegationDetailPaymentContacts paymentContacts={mockedCIContacts}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('payment-contact-column')).toBeInTheDocument();
        });
    });
});
