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
import {add} from 'date-fns';
import { partiesActions } from '../../../../redux/slices/partiesSlice';
import { Party } from '../../../../model/Party';
import { validateIbanCsvData } from '../../../../utils/iban-csv-to-upload-parser';

let createIbanSpy: jest.SpyInstance;
let updateIbanSpy: jest.SpyInstance;
let handleBulkIbanOperationsSpy: jest.SpyInstance;
const mockAddError = jest.fn();

jest.mock('@pagopa/selfcare-common-frontend', () => ({
    useErrorDispatcher: () => mockAddError,
    useLoading: () => jest.fn(),
    TitleBox: () => null,
}));


/**
 * Mock conf for iban bulk upload - start
 */

Object.defineProperty(global.self, 'crypto', {
    value: {
        getRandomValues: function (buffer: any) {
            const nodeCrypto = require('crypto');
            return nodeCrypto.randomFillSync(buffer);
        },
    },
});

if (!File.prototype.text) {
    File.prototype.text = jest.fn().mockResolvedValue('mock csv content');
}

class MockFileReader {
    result: string | null = null;
    onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;

    readAsText(_file: Blob) {
        this.result = 'mock csv content';

        setTimeout(() => {
            if (this.onload) {
                const event = {
                    target: { result: this.result },
                } as ProgressEvent<FileReader>;
                this.onload.call(this as unknown as FileReader, event);
            }
        }, 0);
    }
}

(global as any).FileReader = MockFileReader;

jest.mock('../../../../utils/iban-csv-to-upload-parser');

/**
 * Mock conf for iban bulk upload - end
 */

beforeEach(() => {
    jest.clearAllMocks();
    createIbanSpy = jest.spyOn(require('../../../../services/ibanService'), 'createIban');
    updateIbanSpy = jest.spyOn(require('../../../../services/ibanService'), 'updateIban');
    handleBulkIbanOperationsSpy = jest.spyOn(require('../../../../services/ibanService'), 'handleBulkIbanOperations');
    mockAddError.mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });

    store.dispatch(partiesActions.setPartySelected({
        fiscalCode: '1234567890',
        description: 'Mock Party',
    } as Party));
    (validateIbanCsvData as jest.Mock).mockReset();
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

const createFileList = (file: File): FileList => {
    return {
        0: file,
        length: 1,
        item: (index: number) => (index === 0 ? file : null),
    } as unknown as FileList;
}

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

    it('should handle bulk upload - valid file', async () => {

        (validateIbanCsvData as jest.Mock).mockReturnValue({
            valid: true,
            data: [
                {
                    descrizione: 'Test Iban',
                    iban: validIban,
                    dataattivazioneiban: new Date('2099-01-01'),
                    operazione: 'CREATE',
                },
            ],
            summary: {
                toAdd: 1,
                toUpdate: 0,
                toDelete: 0,
            },
            errors: [],
        });

        handleBulkIbanOperationsSpy.mockResolvedValue(undefined);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/create`]}>
                    <Route path="/iban/create">
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

        const radioMultiple = screen.getByTestId('upload-multiple-test').querySelector('input')!;
        fireEvent.click(radioMultiple);
        const file = new File(['mock'], 'test.csv', { type: 'text/csv' });

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const fileList = createFileList(file);

        fireEvent.change(input, { target: { files: fileList } });

        await waitFor(() => {
            expect(
                screen.getByText(/handleMultiIbanEditIbanPage.validationSummary/i)
            ).toBeInTheDocument();
        });

        const submitBtn = screen.getByTestId('submit-button-test');
        expect(submitBtn).not.toBeDisabled();

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(handleBulkIbanOperationsSpy).toHaveBeenCalled();
        });
    });

    it('should handle bulk upload - invalid file', async () => {
       (validateIbanCsvData as jest.Mock).mockReturnValue({
            valid: false,
            errors: ["IBAN non valido"],
        });

        handleBulkIbanOperationsSpy.mockResolvedValue(undefined);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/create`]}>
                    <Route path="/iban/create">
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

        const radioMultiple = screen.getByTestId('upload-multiple-test').querySelector('input')!;
        fireEvent.click(radioMultiple);
        const file = new File(['mock'], 'test.csv', { type: 'text/csv' });

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const fileList = createFileList(file);

        fireEvent.change(input, { target: { files: fileList } });
        
        await waitFor(() => {
            expect(screen.getByText(/IBAN non valido/i)).toBeInTheDocument();
        });

        const submitBtn = screen.getByTestId('submit-button-test');
        expect(submitBtn).toBeDisabled();
    });

    it('should handle file removal', async () => {
      
        (validateIbanCsvData as jest.Mock).mockReturnValue({
            valid: true,
            data: [
                {
                    descrizione: 'Test Iban',
                    iban: validIban,
                    dataattivazioneiban: new Date('2099-01-01'),
                    operazione: 'CREATE',
                },
            ],
            summary: {
                toAdd: 1,
                toUpdate: 0,
                toDelete: 0,
            },
            errors: [],
        });

        handleBulkIbanOperationsSpy.mockResolvedValue(undefined);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/create`]}>
                    <Route path="/iban/create">
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

        const radioMultiple = screen.getByTestId('upload-multiple-test').querySelector('input')!;
        fireEvent.click(radioMultiple);
        const file = new File(['mock'], 'test.csv', { type: 'text/csv' });

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const fileList = createFileList(file);

        fireEvent.change(input, { target: { files: fileList } });

        await waitFor(() => {
            expect(screen.getByText(/handleMultiIbanEditIbanPage.validationSummary/i)).toBeInTheDocument();
        });

        const removeButton = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('[data-testid="CloseIcon"]'))!; 
        fireEvent.click(removeButton);

        expect(screen.queryByText(/handleMultiIbanEditIbanPage.validationSummary/i)).not.toBeInTheDocument();
        expect(screen.getByText(/handleMultiIbanEditIbanPage.csvForm.dropzoneLabel/i)).toBeInTheDocument();
    }); 
});