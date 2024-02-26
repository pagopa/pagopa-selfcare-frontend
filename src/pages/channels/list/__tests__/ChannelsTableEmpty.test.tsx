import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ChannelTableEmpty from '../ChannelTableEmpty';

describe('<ChannelTableEmpty />', () => {
  test('render component ChannelTableEmpty', async () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <ChannelTableEmpty />
      </Router>
    );
  });
});
