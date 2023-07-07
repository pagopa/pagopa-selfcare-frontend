import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {Provider} from 'react-redux';
import ECAccountItemSelection from '../ECAccountItemSelection';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<ECAccountItemSelection />', () => {
  const stationId = 'XPAY_03_ONUS';

  const ec = {
    broker_ec_code: 'string',
    description: 'string',
    enabled: true,
    extended_fault_bean: true,
  };

  test('render component ECAccountItemSelection with EC Selected', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
          <Route path="/stations/:stationId/associate-ec">
            <ThemeProvider theme={theme}>
              <ECAccountItemSelection selectedEC={ec} clearField={jest.fn()} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  test('render component ECAccountItemSelection without EC Selected', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
          <Route path="/stations/:stationId/associate-ec">
            <ThemeProvider theme={theme}>
              <ECAccountItemSelection selectedEC={null} clearField={jest.fn()} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
