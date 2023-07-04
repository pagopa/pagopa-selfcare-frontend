import React from 'react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from '../../../../redux/store';
import ChannelPSPTable from '../ChannelPSPTable';
import * as channelService from '../../../../services/channelService';

let spyApi: jest.SpyInstance;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  spyApi = jest.spyOn(channelService, 'dissociatePSPfromChannel');
  jest.resetModules();
});

afterEach(cleanup);

describe('<ChannelPSPTable />', () => {
  const channelId = 'XPAY_03_ONUS';
  test('render component ChannelPSPTable', async () => {
    await waitFor(() => {
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

  test('Break up PSP Channel relationship', async () => {
    await waitFor(() => {
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

    const dissociatePspBtn = screen.getByTestId('dissociate-14847241001');
    await waitFor(() => {
      fireEvent.click(dissociatePspBtn);
    });

    const confirmBtn = screen.getByRole('button', {
      name: /channelPSPList.dissociateModal.confirmButton/i,
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(spyApi).toBeCalledTimes(1);
    });
  });
});
