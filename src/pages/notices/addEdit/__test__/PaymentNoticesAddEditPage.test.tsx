import React from 'react';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import PaymentNoticesAddEditPage from '../PaymentNoticesAddEditPage';
import { institutionsData } from '../../../../services/__mocks__/noticesService';
import { createStore, store } from '../../../../redux/store';
import * as noticesService from '../../../../services/noticesService';
import { ecAdminSignedDirect } from '../../../../services/__mocks__/partyService';

let getInstitutionData: jest.SpyInstance;
let setLoadingSpy: jest.SpyInstance;

beforeEach(() => {
  getInstitutionData = jest.spyOn(noticesService, 'getInstitutionData');
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  const store = createStore();
  store.dispatch({
    type: 'parties/setPartySelected',
    payload: ecAdminSignedDirect,
  });
});

describe('PaymentNoticesAddEditPage', () => {
  it('Test render PaymentNoticesAddEditPage should open modal and allow going back', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/payments-notices/addedit`]}>
          <Route path="/payments-notices/addedit">
            <ThemeProvider theme={theme}>
              <PaymentNoticesAddEditPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
    const backButton = screen.getByTestId('go-back-breadcrumb-test');
    fireEvent.click(backButton);
    const modalConfirmButton = screen.getByTestId('confirm-button-test');
    fireEvent.click(modalConfirmButton);
  });
  it('Test render PaymentNoticesAddEditPage should open modal and allow reject', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/payments-notices/addedit`]}>
          <Route path="/payments-notices/addedit">
            <ThemeProvider theme={theme}>
              <PaymentNoticesAddEditPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
    const backButton = screen.getByTestId('go-back-breadcrumb-test');
    fireEvent.click(backButton);
    const modalRejectButton = screen.getByTestId('cancel-button-test');
    fireEvent.click(modalRejectButton);
  });
});
