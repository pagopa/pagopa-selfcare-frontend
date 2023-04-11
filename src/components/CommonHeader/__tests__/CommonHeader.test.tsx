import { JwtUser } from '@pagopa/mui-italia';
import { render } from '@testing-library/react';
import React from 'react';
import CommonHeader from '../CommonHeader';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<CommonHeader />', () => {
  const mockedUser: JwtUser = {
    id: '0',
    name: 'loggedName',
    surname: 'loggedSurname',
    email: 'loggedEmail@aa.aa',
  };

  test('render CommonHeader component', () => {
    render(<CommonHeader withSecondHeader={true} loggedUser={mockedUser} />);
  });

  test('render CommonHeader component withSecondHeader false', () => {
    render(<CommonHeader withSecondHeader={false} loggedUser={mockedUser} />);
  });
});
