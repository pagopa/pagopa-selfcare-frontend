import React from 'react';
import {render} from '@testing-library/react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import {createStore, store} from '../../../../redux/store';
import PaymentNoticesDetailPage from '../PaymentNoticesDetailPage';
import {institutionsData} from '../../../../services/__mocks__/noticesService';
import {ecAdminSignedDirect} from '../../../../services/__mocks__/partyService';
import * as noticesService from '../../../../services/noticesService';

beforeEach(() => {
    jest.spyOn(noticesService, 'getInstitutionData');
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
    const store = createStore();
    store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecAdminSignedDirect,
    });
});

describe('PaymentNoticesDetailPage', () => {
    it('Test render PaymentNoticesDetailPage', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/payments-notices`]}>
                    <Route path="/payments-notices">
                        <ThemeProvider theme={theme}>
                            <PaymentNoticesDetailPage data={institutionsData}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });
});
