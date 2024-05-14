import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from '../redux/store';
import App from '../App';
import { verifyMockExecution as verifyLoginMockExecution } from '../decorators/__mocks__/withLogin';
import { verifyMockExecution as verifyPartiesMockExecution } from '../decorators/__mocks__/withParties';
import { verifyMockExecution as verifySelectedPartyProductsMockExecution } from '../decorators/__mocks__/withSelectedPartyProducts';
import { useAppDispatch } from '../redux/hooks';
import { partiesActions } from '../redux/slices/partiesSlice';
import { mockedParties } from '../services/__mocks__/partyService';
import { mockedPartyProducts } from '../services/__mocks__/productService';

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

const Component = () => {
  const dispatch = useAppDispatch();
  dispatch(partiesActions.setPartiesList(mockedParties));
  dispatch(partiesActions.setPartySelectedProducts(mockedPartyProducts));
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
};

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  render(
    <Provider store={store}>
      <Component />
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