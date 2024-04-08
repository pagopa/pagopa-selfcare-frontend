import { render } from '@testing-library/react';
import React from 'react';
import DelegationsTableEmpty from '../DelegationsTableEmpty';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<DelegationsTableEmpty />', () => {
  test('render component DelegationsTableEmpty', () => {
    render(<DelegationsTableEmpty />);
  });
});
