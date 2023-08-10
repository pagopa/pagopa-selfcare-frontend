import React from 'react';
import { render } from '@testing-library/react';
import IbanPage from '../IbanPage';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';

let getIbanListSpy: jest.SpyInstance;
let setLoadingSpy: jest.SpyInstance;

beforeEach(() => {
  getIbanListSpy = jest.spyOn(require('../../../services/ibanService'), 'getIbanList');
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('IbanPage', () => {
  it('Test render IbanPage', () => {
    getIbanListSpy.mockReturnValue;
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/iban`]}>
          <Route path="/iban">
            <ThemeProvider theme={theme}>
              <IbanPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
