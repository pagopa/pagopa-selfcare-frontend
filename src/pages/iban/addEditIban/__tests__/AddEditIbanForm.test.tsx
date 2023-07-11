import { createMemoryHistory } from 'history';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import AddEditIbanForm from '../AddEditIbanForm';
import React from 'react';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import { mockedIban } from '../../../../services/__mocks__/ibanService';
import { IbanFormAction } from '../../../../model/Iban';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';

describe('<AddEditIbanForm />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test rendering AddEditIbanForm', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditIbanForm
              ibanBody={mockedIban}
              goBack={jest.fn()}
              formAction={IbanFormAction.Create}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );
  });
});
