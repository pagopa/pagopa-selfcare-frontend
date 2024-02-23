import React from 'react';
import { render } from '@testing-library/react';
import PSPSelectionSearchItemContainer from '../PSPSelectionSearchItemContainer';

describe('<PSPSelectionSearchItemContainer />', () => {
  test('render component PSPSelectionSearchItemContainer', async () => {
    render(
      <PSPSelectionSearchItemContainer title={undefined} subTitle={undefined} image={undefined} />
    );
  });
});
