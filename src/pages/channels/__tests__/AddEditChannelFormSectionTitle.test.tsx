import { render } from '@testing-library/react';
import React from 'react';
import AddEditChannelFormSectionTitle from '../addEditChannel/AddEditChannelFormSectionTitle';

describe('<AddEditChannelFormSectionTitle />', () => {
  test('render component AddEditChannelFormSectionTitle', () => {
    render(<AddEditChannelFormSectionTitle icon={<React.Fragment></React.Fragment>} title={''} />);
  });
});
