import React from 'react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route, Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from '../../../../redux/store';
import ChannelPSPListPage from '../ChannelPSPListPage';
import {createMemoryHistory} from 'history';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.resetModules();
});
afterEach(cleanup);

describe('<ChannelPSPTable />', () => {
  const channelId = 'XPAY_03_ONUS';
  test('render component ChannelPSPTable', async () => {
    await waitFor(() => {
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

  test('render component ChannelPSPTable with Alert', async () => {
    const state = { alertSuccessMessage: 'testAlertMessage' };
    const history = createMemoryHistory({
      initialEntries: [{ pathname: `/channels/${channelId}/psp-list`, state: state }],
    });

    await waitFor(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/channels/:channelId/psp-list">
              <ThemeProvider theme={theme}>
                <ChannelPSPListPage />
              </ThemeProvider>
            </Route>
          </Router>
        </Provider>
      );
    });

    const alertSuccessMessage = await screen.getAllByText(/testAlertMessage/i);
    expect(alertSuccessMessage.length).toBe(1);
  });
});
