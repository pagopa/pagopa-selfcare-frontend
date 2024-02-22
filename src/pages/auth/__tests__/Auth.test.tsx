import React from 'react';
import {render} from '@testing-library/react';
import Auth from '../Auth';
import {ENV} from '../../../utils/env';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import {storageTokenOps, storageUserOps} from '@pagopa/selfcare-common-frontend/utils/storage';
import ROUTES from '../../../routes';
import {testToken} from '../../../utils/constants';
import routes from '../../../routes';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { theme } from '@pagopa/mui-italia';
import { ThemeProvider } from '@mui/system';

const token = testToken;

const oldWindowLocation = global.window.location;
const mockedLocation = { assign: jest.fn(), hash: '#token=' + token, origin: 'MOCKEDORIGIN' };

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

test('test login success', () => {
  render(<Auth />);

  expect(storageTokenOps.read()).toBe(token);

  const user: User = storageUserOps.read();
  expect(user).not.toBeNull();
  expect(user.uid).toBe('5096e4c6-25a1-45d5-9bdf-2fb974a7c1c8');
  expect(user.name).toBe('Anselmo');
  expect(user.surname).toBe('Sartori');
  expect(user.email).toBe('furiovitale@martino.it');

  expect(global.window.location.assign).toBeCalledWith(ROUTES.HOME);
});

test('test login success no token', () => {
  // @ts-ignore
  mockedLocation.hash = undefined;
  const requestedPath = 'prova?';

  render(<Auth />);

  expect(global.window.location.assign).toBeCalledWith(ENV.URL_FE.LOGIN);
});

//SNAPSHOT TESTING
it('renders correctly', () => {
  const tree = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[routes.AUTH]}>
        <Route path={routes.AUTH}>
          <ThemeProvider theme={theme}>
            <Auth />
          </ThemeProvider>
        </Route>
      </MemoryRouter>
    </Provider>
  );
  expect(tree).toMatchSnapshot();
});

