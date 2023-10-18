import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { createStore, store } from '../../../../redux/store';
import { createMemoryHistory } from 'history';
import OperationTableDetailPage from '../OperationTableDetailPage';
import ROUTES from '../../../../routes';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const renderApp = (
  injectedHistory?: ReturnType<typeof createMemoryHistory>,
  injectedStore?: ReturnType<typeof createStore>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Provider store={store}>
          <OperationTableDetailPage />
        </Provider>
      </Router>
    </ThemeProvider>
  );
  return { store, history };
};

describe('OperationTableDetailPage', () => {
  it('Test render OperationTableDetailPage', async () => {
    const { history } = renderApp();
    const backBtn = screen.getByText('general.exit');
    await waitFor(() => fireEvent.click(backBtn));
    await waitFor(() => expect(history.location.pathname).toBe(ROUTES.HOME));
  });
});
