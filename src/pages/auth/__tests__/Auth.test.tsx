import React from 'react';
import { render } from '@testing-library/react';
import Auth from '../Auth';
import { ENV } from '../../../utils/env';
import { User } from '../../../models/User';
import { storageTokenOps, storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import ROUTES from '../../../routes';
import { testToken } from '../../../utils/constants';

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
  expect(user.uid).toBe('b9b89ef9-4dcb-4e27-8192-d972efef614e');
  expect(user.taxCode).toBe('LNGMLE85P19C826J');
  expect(user.name).toBe('Emilia');
  expect(user.surname).toBe('Longo');
  expect(user.email).toBe('dmartino@live.com');

  expect(global.window.location.assign).toBeCalledWith(ROUTES.HOME);
});

test('test login success no token', () => {
  mockedLocation.hash = undefined;
  const requestedPath = 'prova?';

  render(<Auth />);

  expect(global.window.location.assign).toBeCalledWith(ENV.URL_FE.LOGIN);
});
