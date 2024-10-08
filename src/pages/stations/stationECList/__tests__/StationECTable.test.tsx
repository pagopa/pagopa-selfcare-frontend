import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../../redux/store';
import StationECTable from '../StationECTable';
import * as stationService from '../../../../services/stationService';
import React from 'react';
import { mockedStationECs } from '../../../../services/__mocks__/stationService';

let spyApi: jest.SpyInstance;
const getECListByStationCodeSpy = jest.spyOn(stationService, 'getECListByStationCode');
const dissociateEcSpy = jest.spyOn(stationService, "dissociateECfromStation");

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  spyApi = jest.spyOn(stationService, 'dissociateECfromStation');
});

afterEach(cleanup);

describe('<StationECTable />', () => {
  const stationId = 'XPAY_03_ONUS';
  test('Render StationECTable', async () => {
    getECListByStationCodeSpy.mockReturnValueOnce(Promise.resolve(mockedStationECs));
    dissociateEcSpy.mockReturnValueOnce(Promise.resolve());
 
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}`]}>
          <Route path="/stations/:stationId">
            <ThemeProvider theme={theme}>
              <StationECTable
                setAlertMessage={() => ''}
                ciNameOrFiscalCodeFilter={''}
                setNoValidCi={() => jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const table = screen.getByTestId('data-grid');
      expect(table).toBeInTheDocument();
    });

    const menuButton = screen.getAllByRole('menuitem')[0];
    fireEvent.click(menuButton);

    let dissociateButton;
    await waitFor(() => {
      expect(screen.queryByTestId('editAction')).toBeInTheDocument();
      dissociateButton = screen.getByTestId("dissociate-action");
    });

    fireEvent.click(dissociateButton);

    let confirmButton;
    await waitFor(() => {
      confirmButton = screen.getByTestId("confirm-button-modal-test");
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(dissociateEcSpy).toHaveBeenCalledTimes(1);
    });
  });

  test('error getECListByStationCodeSpy', async () => {
    getECListByStationCodeSpy.mockRejectedValueOnce(new Error(""));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}`]}>
          <Route path="/stations/:stationId">
            <ThemeProvider theme={theme}>
              <StationECTable
                setAlertMessage={() => ''}
                ciNameOrFiscalCodeFilter={''}
                setNoValidCi={() => jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const table = screen.getByTestId('data-grid');
      expect(table).toBeInTheDocument();
    });
  });

  test('error dissociateECfromStation', async () => {
    getECListByStationCodeSpy.mockReturnValueOnce(Promise.resolve(mockedStationECs));
    dissociateEcSpy.mockRejectedValueOnce("");
 
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}`]}>
          <Route path="/stations/:stationId">
            <ThemeProvider theme={theme}>
              <StationECTable
                setAlertMessage={() => ''}
                ciNameOrFiscalCodeFilter={''}
                setNoValidCi={() => jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const table = screen.getByTestId('data-grid');
      expect(table).toBeInTheDocument();
    });

    const menuButton = screen.getAllByRole('menuitem')[0];
    fireEvent.click(menuButton);

    let dissociateButton;
    await waitFor(() => {
      expect(screen.queryByTestId('editAction')).toBeInTheDocument();
      dissociateButton = screen.getByTestId("dissociate-action");
    });

    fireEvent.click(dissociateButton);

    let confirmButton;
    await waitFor(() => {
      confirmButton = screen.getByTestId("confirm-button-modal-test");
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(dissociateEcSpy).toHaveBeenCalledTimes(1);
    });
  });
});
