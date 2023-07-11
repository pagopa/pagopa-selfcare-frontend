import { createMemoryHistory } from 'history';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import AddEditIbanPage from '../AddEditIbanPage';
import React from 'react';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import { mockedIban } from '../../../../services/__mocks__/ibanService';
import { IbanFormAction } from '../../../../model/Iban';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';

describe('<AddEditIbanPage />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test rendering AddEditIbanPage', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <AddEditIbanPage />
          </ThemeProvider>
        </Router>
      </Provider>
    );
  });
});
