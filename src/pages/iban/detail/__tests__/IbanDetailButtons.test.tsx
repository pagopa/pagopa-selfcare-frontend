import React from 'react';
import { render, screen } from '@testing-library/react';
import IbanDetailButtons from '../components/IbanDetailButtons';
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

describe('IbanDetailButtons', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  it('should render the buttons', () => {
    const active = false;
    const iban = 'IT99C0222211111000000000002';

    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <IbanDetailButtons active={active} iban={iban} />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    expect(screen.getByText('ibanDetailPage.buttons.delete')).toBeInTheDocument();
    expect(screen.getByText('ibanDetailPage.buttons.edit')).toBeInTheDocument();
  });

  it('should render different buttons when active is true', () => {
    const active = true;
    const iban = 'IT99C0222211111000000000002';

    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <IbanDetailButtons active={active} iban={iban} />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    expect(screen.getByText('ibanDetailPage.buttons.delete')).toBeInTheDocument();
    expect(screen.getByText('ibanDetailPage.buttons.edit')).toBeInTheDocument();
    expect(screen.getByText('ibanDetailPage.buttons.deactivate')).toBeInTheDocument();
  });
});
