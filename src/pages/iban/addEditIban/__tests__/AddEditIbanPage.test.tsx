import React from 'react';
import { render } from '@testing-library/react';
import AddEditIbanPage from '../AddEditIbanPage';
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

describe('AddEditIbanPage', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  it('Test render AddEditIbanPage', () => {
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
