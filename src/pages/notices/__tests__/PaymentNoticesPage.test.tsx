import React from 'react';
import { render } from '@testing-library/react';
import PaymentNoticesPage from '../PaymentNoticesPage';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { createStore, store } from '../../../redux/store';
import { institutionsData } from '../../../services/__mocks__/noticesService';
import * as noticesService from '../../../services/noticesService';
import { ecAdminSignedDirect } from '../../../services/__mocks__/partyService';

let getInstitutionData: jest.SpyInstance;
let setLoadingSpy: jest.SpyInstance;

beforeEach(() => {
  jest.spyOn(noticesService, 'getInstitutionData');
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  const store = createStore();
  store.dispatch({
    type: 'parties/setPartySelected',
    payload: ecAdminSignedDirect,
  });
});

describe('PaymentNoticesPage', () => {
  it('Test render PaymentNoticesPage', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/payments-notices`]}>
          <Route path="/payments-notices">
            <ThemeProvider theme={theme}>
              <PaymentNoticesPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
