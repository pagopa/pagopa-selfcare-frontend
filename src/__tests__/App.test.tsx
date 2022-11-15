import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { createStore } from '../redux/store';
import { verifyMockExecution as verifyLoginMockExecution } from '../decorators/__mocks__/withLogin';
import { verifyMockExecution as verifyPartiesMockExecution } from '../decorators/__mocks__/withParties';
import { verifyMockExecution as verifySelectedPartyProductsMockExecution } from '../decorators/__mocks__/withSelectedPartyProducts';
import { createMemoryHistory } from 'history';
// import { mockedParties } from '../services/__mocks__/partyService';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '../locale';
import { BrowserRouter } from 'react-router-dom';

const mockSignOutFn = jest.fn();

jest.mock('../hooks/useTOSAgreementLocalStorage', () => () => ({
  isTOSAccepted: true,
  acceptTOS: mockSignOutFn,
  acceptedTOS: '',
}));

jest.mock('../decorators/withLogin');
jest.mock('../decorators/withParties');
jest.mock('../decorators/withSelectedParty');
jest.mock('../decorators/withSelectedPartyProducts');

jest.setTimeout(10000);

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
  return { store, history };
};

test('Test rendering', () => {
  const { store } = renderApp();

  verifyLoginMockExecution(store.getState());
  verifyPartiesMockExecution(store.getState());
  verifySelectedPartyProductsMockExecution(store.getState());
});

test('Test routing ', async () => {
  const { history } = renderApp();
  expect(screen.getByText(/API Key generate/i)).toBeInTheDocument();
  await waitFor(() => expect(window.location.pathname).toBe('/ui'));
});
