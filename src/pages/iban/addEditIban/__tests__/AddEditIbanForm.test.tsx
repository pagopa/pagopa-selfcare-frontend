import React from 'react';
import {render, screen, fireEvent, getByTestId, waitFor} from '@testing-library/react';
import AddEditIbanForm from '../AddEditIbanForm';
import {IbanFormAction} from '../../../../model/Iban';
import {mockedIban} from '../../../../services/__mocks__/ibanService';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {Provider} from 'react-redux';
import {MemoryRouter, Route, Router} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {emptyIban} from '../../IbanPage';

let createIbanSpy: jest.SpyInstance;
let updateIbanSpy: jest.SpyInstance;
const mockAddError = jest.fn();

jest.mock('@pagopa/selfcare-common-frontend', () => ({
    useErrorDispatcher: () => mockAddError,
    useLoading: () => jest.fn(),
    TitleBox: () => null,
}));

beforeEach(() => {
    jest.clearAllMocks();
    createIbanSpy = jest.spyOn(require('../../../../services/ibanService'), 'createIban');
    updateIbanSpy = jest.spyOn(require('../../../../services/ibanService'), 'updateIban');
    mockAddError.mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

const validIban = 'IT60X0542811101000000123456';
const validIbanBody = {
    iban: validIban,
    description: 'Tassa di concorso - servizio tesoreria comunale',
    validity_date: new Date('2023-04-01T13:49:19.897Z'),
    due_date: new Date('2033-04-01T13:49:19.897Z'),
    is_active: true,
    creditor_institution_code: '1234567890',
    labels: [],
};
describe('AddEditIbanForm', () => {
    it('should call goBack when the "Back" button is clicked', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}/create`]}>
                    <Route path="/iban/:ibanId/:actionId">
                        <ThemeProvider theme={theme}>
                            <AddEditIbanForm
                                goBack={jest.fn()}
                                ibanBody={emptyIban}
                                formAction={IbanFormAction.Create}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const backButton = screen.getByTestId('back-button-test');
        fireEvent.click(backButton);
    });

    it('should submit the form when the "Confirm" button is clicked', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}/create`]}>
                    <Route path="/iban/:ibanId/:actionId">
                        <ThemeProvider theme={theme}>
                            <AddEditIbanForm
                                goBack={jest.fn()}
                                ibanBody={emptyIban}
                                formAction={IbanFormAction.Create}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const iban = screen.getByTestId('iban-test');
        fireEvent.change(iban, {target: {value: validIban}});

        const description = screen.getByTestId('description-test');
        fireEvent.change(description, {target: {value: 'Descrizione iban'}});

        // const holderMe = screen.getByTestId('holder-me-test');
        // fireEvent.click(holderMe);

        const submitBtn = screen.getByTestId('submit-button-test');
        await waitFor(() => expect(submitBtn).toBeEnabled());
        fireEvent.submit(screen.getByTestId('iban-form'));
        await waitFor(() => {
            expect(createIbanSpy).toBeCalled();
            expect(updateIbanSpy).not.toBeCalled();
        });
    });

    it('update input in formAction edit', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}/edit`]}>
                    <Route path="/iban/:ibanId/:actionId">
                        <ThemeProvider theme={theme}>
                            <AddEditIbanForm
                                goBack={jest.fn()}
                                ibanBody={validIbanBody}
                                formAction={IbanFormAction.Edit}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
        const iban = screen.getByTestId('iban-test');
        fireEvent.change(iban, {target: {value: validIban}});
        const description = screen.getByTestId('description-test');
        fireEvent.change(description, {target: {value: 'Descrizione iban'}});

        const submitBtn = screen.getByTestId('submit-button-test');
        await waitFor(() => expect(submitBtn).toBeEnabled());
        fireEvent.submit(screen.getByTestId('iban-form'));
        await waitFor(() => {
            expect(updateIbanSpy).toBeCalled();
            expect(createIbanSpy).not.toBeCalled();
        });
    });

    it('test iban validator function', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}/create`]}>
                    <Route path="/iban/:ibanId/:actionId">
                        <ThemeProvider theme={theme}>
                            <AddEditIbanForm
                                goBack={jest.fn()}
                                ibanBody={emptyIban}
                                formAction={IbanFormAction.Create}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const iban = screen.getByTestId('iban-test');
        fireEvent.change(iban, {target: {value: 'invalidIban'}});

        const description = screen.getByTestId('description-test');
        fireEvent.change(description, {target: {value: 'Descrizione iban'}});

        const submitBtn = screen.getByTestId('submit-button-test');
        await waitFor(() => expect(submitBtn).toBeEnabled());
        fireEvent.submit(screen.getByTestId('iban-form'));
        expect(createIbanSpy).not.toBeCalled();
        expect(updateIbanSpy).not.toBeCalled();

        await waitFor(() => {
            const ibanErrorText = document.getElementById('iban-helper-text');
            expect(ibanErrorText).toBeInTheDocument();
        });
    });

    it('test create api response 409 Conflict', async () => {
        createIbanSpy.mockRejectedValue(new Error(JSON.stringify({status: 409})));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}/create`]}>
                    <Route path="/iban/:ibanId/:actionId">
                        <ThemeProvider theme={theme}>
                            <AddEditIbanForm
                                goBack={jest.fn()}
                                ibanBody={emptyIban}
                                formAction={IbanFormAction.Create}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        let ibanErrorText = document.getElementById('iban-helper-text');
        expect(ibanErrorText).not.toBeInTheDocument();

        const iban = screen.getByTestId('iban-test');
        fireEvent.change(iban, {target: {value: validIban}});

        const description = screen.getByTestId('description-test');
        fireEvent.change(description, {target: {value: 'Descrizione iban'}});

        const submitBtn = screen.getByTestId('submit-button-test');
        await waitFor(() => expect(submitBtn).toBeEnabled());
        fireEvent.submit(screen.getByTestId('iban-form'));
        await waitFor(() => {
            expect(createIbanSpy).toBeCalled();
            expect(updateIbanSpy).not.toBeCalled();
        });

        ibanErrorText = document.getElementById('iban-helper-text');
        expect(ibanErrorText).toBeInTheDocument();
    });

    it('test create api response generic error', async () => {
        createIbanSpy.mockRejectedValue(new Error('genericError'));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}/create`]}>
                    <Route path="/iban/:ibanId/:actionId">
                        <ThemeProvider theme={theme}>
                            <AddEditIbanForm
                                goBack={jest.fn()}
                                ibanBody={emptyIban}
                                formAction={IbanFormAction.Create}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const iban = screen.getByTestId('iban-test');
        fireEvent.change(iban, {target: {value: validIban}});

        const description = screen.getByTestId('description-test');
        fireEvent.change(description, {target: {value: 'Descrizione iban'}});

        const submitBtn = screen.getByTestId('submit-button-test');
        await waitFor(() => expect(submitBtn).toBeEnabled());
        fireEvent.submit(screen.getByTestId('iban-form'));
        await waitFor(() => {
            expect(createIbanSpy).toBeCalled();
            expect(updateIbanSpy).not.toBeCalled();
        });

        await waitFor(() => {
            expect(mockAddError).toBeCalled();
        });

        const ibanErrorText = document.getElementById('iban-helper-text');
        expect(ibanErrorText).not.toBeInTheDocument();
    });
});
