import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import IbanDetailButtons from '../components/IbanDetailButtons';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { createMemoryHistory } from 'history';

let deleteIbanSpy: jest.SpyInstance;

beforeEach(() => {
  deleteIbanSpy = jest.spyOn(require('../../../../services/ibanService'), 'deleteIban');
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
            <IbanDetailButtons active={active} iban={iban} deleteIban={jest.fn()} />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    expect(screen.getByText('ibanDetailPage.buttons.delete')).toBeInTheDocument();
    expect(screen.getByText('ibanDetailPage.buttons.edit')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('delete-button-test'));
  });

  it('should render different buttons when active is true', () => {
    const active = true;
    const iban = 'IT99C0222211111000000000002';

    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <IbanDetailButtons active={active} iban={iban} deleteIban={jest.fn()} />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    expect(screen.getByText('ibanDetailPage.buttons.delete')).toBeInTheDocument();
    expect(screen.getByText('ibanDetailPage.buttons.edit')).toBeInTheDocument();
    expect(screen.getByText('ibanDetailPage.buttons.deactivate')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('delete-button-test'));
  });
});
