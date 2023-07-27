import React from 'react';
import { render } from '@testing-library/react';
import AddEditIbanPage from '../AddEditIbanPage';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { createMemoryHistory } from 'history';
import { mockedIban } from '../../../../services/__mocks__/ibanService';

let getIbanListSpy: jest.SpyInstance;

beforeEach(() => {
  getIbanListSpy = jest.spyOn(require('../../../../services/ibanService'), 'getIbanList');
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('AddEditIbanPage', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  it('Test render AddEditIbanPage', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}/edit`]}>
          <Route path="/iban/:ibanId/:actionId">
            <ThemeProvider theme={theme}>
              <AddEditIbanPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(getIbanListSpy).toBeCalled();
  });

  it('Test render AddEditIbanPage with getIbanList fetch error', () => {
    const mockError = new Error('Fetch error');
    getIbanListSpy.mockRejectedValueOnce(mockError);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}/edit`]}>
          <Route path="/iban/:ibanId/:actionId">
            <ThemeProvider theme={theme}>
              <AddEditIbanPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(getIbanListSpy).toBeCalled();
  });

  it('Test render AddEditIbanPage with action create', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}/create`]}>
          <Route path="/iban/:ibanId/:actionId">
            <ThemeProvider theme={theme}>
              <AddEditIbanPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
