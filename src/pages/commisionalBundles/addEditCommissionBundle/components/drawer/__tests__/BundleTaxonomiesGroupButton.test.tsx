import {cleanup, render} from '@testing-library/react';
import React from 'react';
import BundleTaxonomiesGroupButton from '../BundleTaxonomiesGroupButton';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('<BundleTaxonomiesGroupButton />', () => {
    test('render component BundleTaxonomiesGroupButton', () => {
        render(<BundleTaxonomiesGroupButton title="title"/>);
    });
});
