import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {Router} from 'react-router-dom';
import {store} from '../../../../redux/store';
import ChannelsTable from '../ChannelsTable';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<ChannelsTable />', () => {
  const history = createMemoryHistory();

  test('render component ChannelsTable', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <ChannelsTable  channelCodeFilter={"1"}/>
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });
});
