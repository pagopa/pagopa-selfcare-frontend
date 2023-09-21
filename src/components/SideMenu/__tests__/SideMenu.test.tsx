import React from 'react';
import { Provider } from 'react-redux';
import { queryAllByText, queryByText, render, screen } from '@testing-library/react';
import * as usePermissions from '../../../hooks/usePermissions';
import { createMemoryHistory } from 'history';
import SideMenu from '../SideMenu';
import { ThemeProvider } from '@mui/material';
import { Router } from 'react-router-dom';
import { theme } from '@pagopa/mui-italia';
import { createStore } from '../../../redux/store';

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

describe('ProtectedRoute component', () => {
  jest.mock('../../../hooks/usePermissions');

  test('should render children when user has permission', () => {
    jest
      .spyOn(usePermissions, 'usePermissions')
      .mockReturnValue({ hasPermission: (permissionName) => true });

    renderApp();

    const homeItem = screen.getByTestId('home-test');

    expect(homeItem).toBeInTheDocument();
  });
});
