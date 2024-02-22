import React from 'react';
import { render } from '@testing-library/react';
import ChannelsTableSearchBar from '../ChannelsTableSearchBar';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

//SNAPSHOT TESTING
it('renders correctly', () => {
  const [channelCodeInput, setChannelCodeInput] = ['', () => ''];
  const history = createMemoryHistory();
  const tree = render(
    <Router history={history}>
      <ChannelsTableSearchBar
        channelCodeInput={channelCodeInput}
        setChannelCodeInput={setChannelCodeInput}
      />
    </Router>
  );
  expect(tree).toMatchSnapshot();
});
