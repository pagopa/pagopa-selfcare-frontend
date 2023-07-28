import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddEditIbanForm from '../AddEditIbanForm';
import { IbanFormAction } from '../../../../model/Iban';
import { mockedIban } from '../../../../services/__mocks__/ibanService';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { createMemoryHistory } from 'history';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('AddEditIbanForm', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  it('should render the form', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditIbanForm
              goBack={jest.fn()}
              ibanBody={mockedIban}
              formAction={IbanFormAction.Create}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    // Assert form fields are rendered
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

    // Assert buttons are rendered
    expect(
      screen.getByRole('button', { name: 'addEditIbanPage.addForm.buttons.back' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'addEditIbanPage.addForm.buttons.confirm' })
    ).toBeInTheDocument();
  });

  it('should call goBack when the "Back" button is clicked', () => {
    // Mock props and formik
    const goBack = jest.fn();
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditIbanForm
              goBack={goBack}
              ibanBody={mockedIban}
              formAction={IbanFormAction.Create}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    // Click the "Back" button
    fireEvent.click(screen.getByRole('button', { name: 'addEditIbanPage.addForm.buttons.back' }));

    // Assert goBack is called
    expect(goBack).toHaveBeenCalled();
  });

  it('should submit the form when the "Confirm" button is clicked', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditIbanForm
              goBack={jest.fn()}
              ibanBody={mockedIban}
              formAction={IbanFormAction.Create}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    // Click the "Confirm" button
    fireEvent.click(
      screen.getByRole('button', { name: 'addEditIbanPage.addForm.buttons.confirm' })
    );
  });
});
