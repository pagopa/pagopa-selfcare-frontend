import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import IbanDetailPage from '../IbanDetailPage';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { store } from '../../../../redux/store';
import { MemoryRouter, Route } from 'react-router';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('IbanDetailPage', () => {
  const ibanId = 'IT99C0222211111000000000002';

  it('Test render IbanDetailPage', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/iban/${ibanId}`]}>
          <Route path="/iban/:ibanId">
            <ThemeProvider theme={theme}>
              <IbanDetailPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('general.exit')).toBeInTheDocument();
    expect(screen.getByText('general.Iban')).toBeInTheDocument();
    expect(screen.getByText('ibanDetailPage.state')).toBeInTheDocument();
    expect(screen.getByText('ibanDetailPage.ibanConfiguration')).toBeInTheDocument();
  });
});
