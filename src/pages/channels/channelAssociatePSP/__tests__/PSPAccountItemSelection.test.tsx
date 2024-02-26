import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {Provider} from 'react-redux';
import PSPAccountItemSelection from '../PSPAccountItemSelection';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const channelId = 'XPAY_03_ONUS';

const psp = {
  broker_psp_code: 'string',
  description: 'string',
  enabled: true,
  extended_fault_bean: true,
};

describe('<PSPAccountItemSelection />', () => {
  test('render component PSPAccountItemSelection with PSP Selected', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}/associate-psp`]}>
          <Route path="/channels/:channelId/associate-psp">
            <ThemeProvider theme={theme}>
              <PSPAccountItemSelection selectedPSP={psp} clearField={jest.fn()} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  test('render component PSPAccountItemSelection without PSP Selected', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}/associate-psp`]}>
          <Route path="/channels/:channelId/associate-psp">
            <ThemeProvider theme={theme}>
              <PSPAccountItemSelection selectedPSP={null} clearField={jest.fn()} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
