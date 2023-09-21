import React from 'react';
import { Provider } from 'react-redux';
import {
  fireEvent,
  queryAllByText,
  queryByText,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import * as usePermissions from '../../../hooks/usePermissions';
import { createMemoryHistory } from 'history';
import SideMenu from '../SideMenu';
import { ThemeProvider } from '@mui/material';
import { Router } from 'react-router-dom';
import { theme } from '@pagopa/mui-italia';
import { createStore } from '../../../redux/store';
import { pspAdminUnsigned } from '../../../services/__mocks__/partyService';
import ROUTES from '../../../routes';

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
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Provider store={store}>
          <SideMenu />
        </Provider>
      </Router>
    </ThemeProvider>
  );
  return { store, history };
};

describe('SideMenu component', () => {
  jest.mock('../../../hooks/usePermissions');

  test('should render SideMenu', async () => {
    jest
      .spyOn(usePermissions, 'usePermissions')
      .mockReturnValue({ hasPermission: (permissionName) => true });

    const { store } = renderApp();
    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: pspAdminUnsigned,
      })
    );

    const homeItem = screen.getByTestId('home-test');

    expect(homeItem).toBeInTheDocument();
  });

  test('should render SideMenu', async () => {
    jest
      .spyOn(usePermissions, 'usePermissions')
      .mockReturnValue({ hasPermission: (permissionName) => true });

    const { store, history } = renderApp();
    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: pspAdminUnsigned,
      })
    );

    const commPackagesItem = screen.getByTestId('commission-packages-test');

    expect(commPackagesItem).toBeInTheDocument();
    fireEvent.click(commPackagesItem);

    await waitFor(() => expect(history.location.pathname).toBe(ROUTES.COMMISSION_PACKAGES));
  });
});
