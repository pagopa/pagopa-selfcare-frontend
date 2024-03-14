import React from 'react';
import { render } from '@testing-library/react';
import ChannelsTableSearchBar from '../ChannelsTableSearchBar';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe('<ChannelsTableSearchBar />', () => {
  test('render component ChannelsTableSearchBar', async () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <ChannelsTableSearchBar channelCodeInput={''} setChannelCodeInput={jest.fn()} />
      </Router>
    );
  });
});
