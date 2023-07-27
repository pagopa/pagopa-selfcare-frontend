import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddEditIbanForm from '../AddEditIbanForm';
import { IbanFormAction } from '../../../../model/Iban';
import { mockedIban } from '../../../../services/__mocks__/ibanService';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { createMemoryHistory } from 'history';
import { emptyIban } from '../../IbanPage';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('AddEditIbanForm', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  it('should render the form', () => {
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

    expect(
      screen.getByLabelText('addEditIbanPage.addForm.fields.iban.ibanCode')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('addEditIbanPage.addForm.fields.iban.description')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('addEditIbanPage.addForm.fields.dates.start')).toBeInTheDocument();
    expect(screen.getByLabelText('addEditIbanPage.addForm.fields.dates.end')).toBeInTheDocument();
    expect(
      screen.getByLabelText('addEditIbanPage.addForm.fields.holder.holderFiscalCode')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'addEditIbanPage.addForm.buttons.back' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'addEditIbanPage.addForm.buttons.confirm' })
    ).toBeInTheDocument();
  });

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

    const holderFiscalCodeInput = screen.getByTestId('holder-fiscal-code-test');
    fireEvent.change(holderFiscalCodeInput, { target: { value: 'AAAAAA' } });

    const submitBtn = screen.getByTestId('submit-button-test');
    fireEvent.click(submitBtn);
  });
});
