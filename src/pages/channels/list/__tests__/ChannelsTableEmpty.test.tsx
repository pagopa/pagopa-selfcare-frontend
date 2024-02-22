import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ChannelTableEmpty from '../ChannelTableEmpty';

//SNAPSHOT TESTING
it('renders correctly', () => {
  const history = createMemoryHistory();
  const tree = render(
    <Router history={history}>
      <ChannelTableEmpty />
    </Router>
  );
  expect(tree).toMatchSnapshot();
});
