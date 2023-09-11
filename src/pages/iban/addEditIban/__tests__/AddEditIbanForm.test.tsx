import React from 'react';
import { render, screen, fireEvent, getByTestId, waitFor } from '@testing-library/react';
import AddEditIbanForm from '../AddEditIbanForm';
import { IbanFormAction } from '../../../../model/Iban';
import { mockedIban } from '../../../../services/__mocks__/ibanService';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { emptyIban } from '../../IbanPage';

let createIbanSpy: jest.SpyInstance;
let updateIbanSpy: jest.SpyInstance;

beforeEach(() => {
  createIbanSpy = jest.spyOn(require('../../../../services/ibanService'), 'createIban');
  updateIbanSpy = jest.spyOn(require('../../../../services/ibanService'), 'updateIban');
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

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

  it('should submit the form when the "Confirm" button is clicked', () => {
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
    fireEvent.change(iban, { target: { value: 'IT60X0542811101000000123456' } });

    const description = screen.getByTestId('description-test');
    fireEvent.change(description, { target: { value: 'Descrizione iban' } });

    const startDateInput = screen.getByTestId('start-date-test');
    fireEvent.change(startDateInput, { target: { value: '2023-07-28' } });

    const endDateInput = screen.getByTestId('end-date-test');
    fireEvent.change(endDateInput, { target: { value: '2023-07-29' } });

    // const holderMe = screen.getByTestId('holder-me-test');
    // fireEvent.click(holderMe);

    const submitBtn = screen.getByTestId('submit-button-test');
    fireEvent.click(submitBtn);
  });

  it('update input in formAction edit', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}/edit`]}>
          <Route path="/iban/:ibanId/:actionId">
            <ThemeProvider theme={theme}>
              <AddEditIbanForm
                goBack={jest.fn()}
                ibanBody={{
                  iban: 'IT99C0222211111000000000003',
                  description: 'Tassa di concorso - servizio tesoreria comunale',
                  validityDate: new Date('2023-04-01T13:49:19.897Z'),
                  dueDate: new Date('2033-04-01T13:49:19.897Z'),
                  active: true,
                  creditorInstitutionCode: '1234567890',
                  labels: [],
                }}
                formAction={IbanFormAction.Edit}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const description = screen.getByTestId('description-test');
    fireEvent.change(description, { target: { value: 'Descrizione iban' } });

    const submitBtn = screen.getByTestId('submit-button-test');
    fireEvent.click(submitBtn);
    fireEvent.submit(submitBtn);
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
    fireEvent.change(iban, { target: { value: 'IT60X054281110100000012345' } });
    fireEvent.change(iban, { target: { value: 'EG60X0542811101000000123456' } });
    fireEvent.change(iban, { target: { value: 'ITA0X0542811101000000123456' } });
    fireEvent.change(iban, { target: { value: 'IT6BX0542811101000000123456' } });
    fireEvent.change(iban, { target: { value: 'IT6010542811101000000123456' } });
    fireEvent.change(iban, { target: { value: 'IT60X0542811101AAAAAA123456' } });

    // const holderFiscalCodeInput = screen.getByTestId('holder-fiscal-code-test') as HTMLInputElement;
    // fireEvent.change(holderFiscalCodeInput, { target: { value: 'AAAAAA' } });
    // expect(typeof holderFiscalCodeInput.value).toBe('string');
    // fireEvent.change(holderFiscalCodeInput, { target: { value: 123456 } });
    // expect(typeof Number(holderFiscalCodeInput.value)).toBe('number');

    fireEvent.change(iban, { target: { value: 'IT60X0542811101000000123456' } });

    const description = screen.getByTestId('description-test');
    fireEvent.change(description, { target: { value: 'Descrizione iban' } });

    const startDateInput = screen.getByTestId('start-date-test');
    fireEvent.change(startDateInput, { target: { value: new Date() } });

    const endDateInput = screen.getByTestId('end-date-test');
    fireEvent.change(endDateInput, { target: { value: '2023-07-29' } });
    fireEvent.change(endDateInput, { target: { value: new Date() } });

    // const holderMe = screen.getByTestId('holder-me-test');
    // fireEvent.click(holderMe);

    const uploadTypeSingle = screen.getByTestId('upload-single-test');
    fireEvent.click(uploadTypeSingle);

    const submitBtn = screen.getByTestId('submit-button-test');
    fireEvent.click(submitBtn);
    fireEvent.submit(submitBtn);
  });
});
