import { render } from '@testing-library/react';
import React from 'react';
import AddEditIbanFormSectionTitle from '../components/AddEditIbanFormSectionTitle';

describe('<AddEditIbanFormSectionTitle />', () => {
  test('render component AddEditIbanFormSectionTitle', () => {
    render(<AddEditIbanFormSectionTitle icon={<React.Fragment></React.Fragment>} title={''} />);
  });
});
