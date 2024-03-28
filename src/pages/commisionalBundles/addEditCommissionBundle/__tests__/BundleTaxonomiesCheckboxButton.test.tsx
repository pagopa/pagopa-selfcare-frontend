import { cleanup, render } from '@testing-library/react';
import React from 'react';
import BundleTaxonomiesCheckboxButton from '../../addEditCommissionBundle/components/drawer/BundleTaxonomiesCheckboxButton';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<BundleTaxonomiesCheckboxButton />', () => {
  test('render component BundleTaxonomiesCheckboxButton', () => {
    render(<BundleTaxonomiesCheckboxButton title="title" subtitle="subtitle" />);
  });
});
