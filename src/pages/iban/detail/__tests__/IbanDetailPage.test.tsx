import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import IbanDetailPage from '../IbanDetailPage';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {Provider} from 'react-redux';
import {store} from '../../../../redux/store';
import {MemoryRouter, Route} from 'react-router';
import {mockedIban} from '../../../../services/__mocks__/ibanService';

let getIbanListSpy: jest.SpyInstance;
let deleteIbanSpy: jest.SpyInstance;

beforeEach(() => {
    getIbanListSpy = jest.spyOn(require('../../../../services/ibanService'), 'getIbanList');
    deleteIbanSpy = jest.spyOn(require('../../../../services/ibanService'), 'deleteIban');
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

describe('IbanDetailPage', () => {
    it('Test render IbanDetailPage', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}`]}>
                    <Route path="/iban/:ibanId">
                        <ThemeProvider theme={theme}>
                            <IbanDetailPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('general.exit')).toBeInTheDocument();
        expect(screen.getByText('general.Iban')).toBeInTheDocument();
        /* expect(screen.getByText('ibanDetailPage.state')).toBeInTheDocument(); */
        expect(screen.getByText('ibanDetailPage.ibanConfiguration')).toBeInTheDocument();
    });

    it('Test render IbanDetailPage with getIbanListSpy error', () => {
        const mockError = new Error('Fetch error');
        getIbanListSpy.mockRejectedValueOnce(mockError);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}`]}>
                    <Route path="/iban/:ibanId">
                        <ThemeProvider theme={theme}>
                            <IbanDetailPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });

    it('Test render IbanDetailPage with deleteIban error', () => {
        const mockError = new Error('Fetch error');
        deleteIbanSpy.mockRejectedValueOnce(mockError);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}`]}>
                    <Route path="/iban/:ibanId">
                        <ThemeProvider theme={theme}>
                            <IbanDetailPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });
});
