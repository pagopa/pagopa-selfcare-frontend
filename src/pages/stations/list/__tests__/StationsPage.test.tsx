import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { store } from '../../../../redux/store';
import StationsPage, { clearLocationState } from '../StationsPage';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationsPage />', () => {
  const history = createMemoryHistory();

  test('render component StationsPage', () => {
    history.location.state = { alertSuccessMessage: 'Success!' };
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <StationsPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByTestId('alert-test')).toBeInTheDocument();
  });

  it('should replace the current state of window history', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <StationsPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const mockReplaceState = jest.fn();
    window.history.replaceState = mockReplaceState;

    clearLocationState();

    expect(mockReplaceState).toHaveBeenCalledWith({}, document.title);
  });
});
