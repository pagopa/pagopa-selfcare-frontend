import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { createStore, store } from '../../../../redux/store';
import { createMemoryHistory } from 'history';
import AddEditOperationTableForm from '../AddEditOperationTableForm';
import ROUTES from '../../../../routes';
import { ecAdminSignedDirect } from '../../../../services/__mocks__/partyService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`${ROUTES.OPERATION_TABLE_ADDEDIT}`]}>
        <Route path={ROUTES.OPERATION_TABLE_ADDEDIT}>
          <ThemeProvider theme={theme}>
            <AddEditOperationTableForm goBack={() => {}} selectedParty={ecAdminSignedDirect} />
          </ThemeProvider>
        </Route>
      </MemoryRouter>
    </Provider>
  );
  return { store, history };
};

describe('AddEditOperationTableForm', () => {
  it('Test render AddEditOperationTableForm', async () => {
    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecAdminSignedDirect,
      })
    );
    renderApp();
  });

  it('Test render AddEditOperationTableForm and submit', () => {
    renderApp();

    const submitBtn = screen.getByTestId('submit-button-test');

    expect(submitBtn).toBeDisabled();

    const email = screen.getByTestId('email-test');
    fireEvent.change(email, { target: { value: 'aaa@bbb.it' } });

    const phone = screen.getByTestId('phone-test');
    fireEvent.change(phone, { target: { value: '123456' } });

    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);
  });
});
