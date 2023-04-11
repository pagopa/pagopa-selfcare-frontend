import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import ChannelPSPListPage from '../channelPSPList/ChannelPSPListPage';
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
        <MemoryRouter initialEntries={[`/channels/${channelId}/psp-list`]}>
          <Route path="/channels/:channelId/psp-list">
            <ThemeProvider theme={theme}>
              <ChannelPSPListPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
