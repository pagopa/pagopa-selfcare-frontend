import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import ChannelDetailPage from '../detail/ChannelDetailPage';
import { Provider } from 'react-redux';
// import { PortalApi } from '../../../api/PortalApiClient';

// let portalApiGetChannelDetails;
beforeEach(() => {
  // portalApiGetChannelDetails = jest.spyOn(PortalApi, 'getChannelDetail');
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.resetModules();
});
afterEach(cleanup);

describe('<ChannelDetailPage />', () => {
  const channelId = 'XPAY_03_ONUS';
  test('render component ChannelDetailPage', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
          <Route path="/channels/:channelId">
            <ThemeProvider theme={theme}>
              <ChannelDetailPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    // expect(portalApiGetChannelDetails).toHaveBeenCalled();
  });
});
