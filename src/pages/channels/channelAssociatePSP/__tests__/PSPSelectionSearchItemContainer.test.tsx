import React from 'react';
import { render } from '@testing-library/react';
import PSPSelectionSearchItemContainer from '../PSPSelectionSearchItemContainer';

//SNAPSHOT TESTING
it('renders correctly', () => {
  const tree = render(
    <PSPSelectionSearchItemContainer title={undefined} subTitle={undefined} image={undefined} />
  );
  expect(tree).toMatchSnapshot();
});
