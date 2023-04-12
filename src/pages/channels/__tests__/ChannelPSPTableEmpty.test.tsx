import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { store } from '../../../redux/store';
import ChannelPSPTableEmpty from '../channelPSPList/ChannelPSPTableEmpty';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<ChannelPSPTableEmpty />', () => {
  const history = createMemoryHistory();
  test('render component ChannelPSPTableEmpty', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <ChannelPSPTableEmpty channelId={'XPAY_03_ONUS'} />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    const associatePsp = screen.getByText('channelPSPList.associatePspButtonLabel');
    fireEvent.click(associatePsp);
  });
});
