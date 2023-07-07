import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from '../../../../redux/store';
import StationECTable from '../StationECTable';
import * as stationService from '../../../../services/stationService';

let spyApi: jest.SpyInstance;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  spyApi = jest.spyOn(stationService, 'dissociateECfromStation');
  jest.resetModules();
});

afterEach(cleanup);

describe('<StationECTable />', () => {
  const stationId = 'XPAY_03_ONUS';
  test('render component StationECTable', async () => {
    await waitFor(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/stations/${stationId}`]}>
            <Route path="/stations/:stationId">
              <ThemeProvider theme={theme}>
                <StationECTable setAlertMessage={() => ''} />
              </ThemeProvider>
            </Route>
          </MemoryRouter>
        </Provider>
      );
    });
  });

  test('Break up EC Station relationship', async () => {
    await waitFor(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/stations/${stationId}`]}>
            <Route path="/stations/:stationId">
              <ThemeProvider theme={theme}>
                <StationECTable setAlertMessage={() => ''} />
              </ThemeProvider>
            </Route>
          </MemoryRouter>
        </Provider>
      );
    });

    const dissociateEcBtn = screen.getByTestId('dissociate-12345678906');
    await waitFor(() => {
      fireEvent.click(dissociateEcBtn);
    });

    const confirmBtn = screen.getByRole('button', {
      name: /stationECList.dissociateModal.confirmButton/i,
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(spyApi).toBeCalledTimes(1);
    });
  });
});
