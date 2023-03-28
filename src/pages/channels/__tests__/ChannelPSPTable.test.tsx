import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import ChannelPSPTable from '../channelPSPList/ChannelPSPTable';
import { Provider } from 'react-redux';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.resetModules();
});
afterEach(cleanup);

describe('<ChannelPSPTable />', () => {
  const channelId = 'XPAY_03_ONUS';
  test('render component ChannelPSPTable', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
          <Route path="/channels/:channelId">
            <ThemeProvider theme={theme}>
              <ChannelPSPTable setAlertMessage={() => ''} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
