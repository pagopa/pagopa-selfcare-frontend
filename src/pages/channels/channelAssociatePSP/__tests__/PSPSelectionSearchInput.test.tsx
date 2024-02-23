import React from 'react';
import { render } from '@testing-library/react';
import PSPSelectionSearchInput from '../PSPSelectionSearchInput';

//SNAPSHOT TESTING
it('renders correctly', () => {
  const tree = render(<PSPSelectionSearchInput onChange={() => ''} input={''} />);
  expect(tree).toMatchSnapshot();
});
