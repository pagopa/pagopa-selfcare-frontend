import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';

import { store } from '../../../../redux/store';
import StationECTable from '../StationECTable';
import * as stationService from '../../../../services/stationService';
import { mockedStationECs } from '../../../../services/__mocks__/stationService';

let getECListByStationCodeSpy: jest.SpyInstance;
let dissociateEcSpy: jest.SpyInstance;


const originalGetBoundingClientRect =
  HTMLElement.prototype.getBoundingClientRect;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  getECListByStationCodeSpy = jest.spyOn(
    stationService,
    'getECListByStationCode'
  );

  dissociateEcSpy = jest.spyOn(
    stationService,
    'dissociateECfromStation'
  );

  HTMLElement.prototype.getBoundingClientRect = () =>
    ({
      x: 0,
      y: 0,
      width: 1000,
      height: 1000,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 1000,
      toJSON: () => '',
    }) as DOMRect;
});

afterEach(() => {
  cleanup();

  HTMLElement.prototype.getBoundingClientRect =
    originalGetBoundingClientRect;

  jest.restoreAllMocks();
});

describe('StationECTable', () => {
  const stationId = 'XPAY_03_ONUS';

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}`]}>
          <Route path="/stations/:stationId">
            <ThemeProvider theme={theme}>
              <StationECTable
                setAlertMessage={jest.fn()}
                ciNameOrFiscalCodeFilter=""
                setNoValidCi={jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

  test('Render StationECTable', async () => {
    getECListByStationCodeSpy.mockResolvedValue(mockedStationECs);
    dissociateEcSpy.mockResolvedValue(undefined);

    renderComponent();

    expect(await screen.findByTestId('data-grid')).toBeInTheDocument();

    const menuButtons = await screen.findAllByRole('menuitem');
    fireEvent.click(menuButtons[0]);

    const dissociateButton = await screen.findByTestId(
      'dissociate-action'
    );

    fireEvent.click(dissociateButton);

    const confirmButton = await screen.findByTestId(
      'confirm-button-modal-test'
    );

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(dissociateEcSpy).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(getECListByStationCodeSpy).toHaveBeenCalledTimes(2);
    });
  });

  test('error getECListByStationCodeSpy', async () => {
    getECListByStationCodeSpy.mockRejectedValue(
      new Error('Error loading EC list')
    );

    renderComponent();

    expect(await screen.findByTestId('data-grid')).toBeInTheDocument();

    await waitFor(() => {
      expect(getECListByStationCodeSpy).toHaveBeenCalledTimes(1);
    });
  });

  test('error dissociateECfromStation', async () => {
    getECListByStationCodeSpy.mockResolvedValue(mockedStationECs);

    dissociateEcSpy.mockRejectedValue(
      new Error('Error dissociating EC from station')
    );

    renderComponent();

    expect(await screen.findByTestId('data-grid')).toBeInTheDocument();

    const menuButtons = await screen.findAllByRole('menuitem');
    fireEvent.click(menuButtons[0]);

    const dissociateButton = await screen.findByTestId(
      'dissociate-action'
    );

    fireEvent.click(dissociateButton);

    const confirmButton = await screen.findByTestId(
      'confirm-button-modal-test'
    );

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(dissociateEcSpy).toHaveBeenCalledTimes(1);
    });

    expect(getECListByStationCodeSpy).toHaveBeenCalledTimes(1);
  });
});