import { render } from '@testing-library/react';
import React from 'react';
import TableEmptyState from '../TableEmptyState';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<TableEmptyState />', () => {
  test('render component TableEmptyState', () => {
    render(<TableEmptyState componentName="componentName" />);
  });
});