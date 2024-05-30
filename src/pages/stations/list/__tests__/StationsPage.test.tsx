import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import {Router} from 'react-router-dom';
import {store} from '../../../../redux/store';
import StationsPage, {clearLocationState} from '../StationsPage';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import * as useUserRole from '../../../../hooks/useUserRole';
import { ROLE } from '../../../../model/RolePermission';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationsPage />', () => {
  const history = createMemoryHistory();

  test('render component StationsPage', async () => {
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

    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'search' } });
  });

  test('render component StationsPage operator', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PSP_ADMIN,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: false
    });
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <StationsPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });

  it('should replace the current state of window history', () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PSP_ADMIN,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: false
    });
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
