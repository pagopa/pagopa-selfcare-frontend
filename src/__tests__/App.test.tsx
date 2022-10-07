import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { createStore } from '../redux/store';
import { verifyMockExecution as verifyLoginMockExecution } from '../decorators/__mocks__/withLogin';
import { verifyMockExecution as verifyPartiesMockExecution } from '../decorators/__mocks__/withParties';
import { verifyMockExecution as verifySelectedPartyProductsMockExecution } from '../decorators/__mocks__/withSelectedPartyProducts';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { mockedParties } from '../services/__mocks__/partyService';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '../locale';

jest.mock('../decorators/withLogin');
jest.mock('../decorators/withParties');
jest.mock('../decorators/withSelectedParty');

jest.setTimeout(10000);

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    </ThemeProvider>
  );
  return { store, history };
};

test.skip('Test rendering', () => {
  const { store } = renderApp();
  verifyLoginMockExecution(store.getState());
  verifyPartiesMockExecution(store.getState());
  verifySelectedPartyProductsMockExecution(store.getState());
});

test.skip('Test rendering dashboard parties loaded', () => {
  const history = createMemoryHistory();
  history.push('/dashboard/6');

  const { store } = renderApp(undefined, history);

  verifyLoginMockExecution(store.getState());
  expect(store.getState().parties.list).toBe(mockedParties); // the new UI is always fetching parties list
});

test.skip('Test routing ', async () => {
  const { history } = renderApp();
  await waitFor(() => expect(history.location.pathname).toBe('/ui'));
});
