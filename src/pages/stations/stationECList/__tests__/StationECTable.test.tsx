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

import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import { store } from '../../../../redux/store';
import StationECTable from '../StationECTable';
import * as stationService from '../../../../services/stationService';
import { mockedStationECs } from '../../../../services/__mocks__/stationService';

const mockAddError = jest.fn();

jest.mock('@pagopa/selfcare-common-frontend', () => ({
  useErrorDispatcher: () => mockAddError,
  useLoading: () => jest.fn(),
}));

jest.mock('@pagopa/selfcare-common-frontend/services/errorService', () => ({
  handleErrors: jest.fn(),
}));

let getECListByStationCodeSpy: jest.SpyInstance;
let dissociateEcSpy: jest.SpyInstance;


const originalGetBoundingClientRect =
  HTMLElement.prototype.getBoundingClientRect;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  mockAddError.mockClear();
  (handleErrors as jest.Mock).mockClear();

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

  const renderComponent = (
    props: {
      setAlertMessage?: jest.Mock;
      setNoValidCi?: jest.Mock;
    } = {}
  ) => {
    const setAlertMessage = props.setAlertMessage ?? jest.fn();
    const setNoValidCi = props.setNoValidCi ?? jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}`]}>
          <Route path="/stations/:stationId">
            <ThemeProvider theme={theme}>
              <StationECTable
                setAlertMessage={setAlertMessage}
                ciNameOrFiscalCodeFilter=""
                setNoValidCi={setNoValidCi}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    return { setAlertMessage, setNoValidCi };
  };

  test('Render StationECTable', async () => {
    getECListByStationCodeSpy.mockResolvedValue(mockedStationECs);
    dissociateEcSpy.mockResolvedValue(undefined);

    const { setAlertMessage } = renderComponent();

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
    await waitFor(() => {
      expect(setAlertMessage).toHaveBeenCalledTimes(1);
    });
    expect(mockAddError).not.toHaveBeenCalled();
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
    // the rejection is surfaced through the shared error handler, not swallowed
    await waitFor(() => {
      expect(handleErrors as jest.Mock).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'FETCH_STATIONS_ERROR' }),
        ])
      );
    });
  });

  test('error dissociateECfromStation', async () => {
    getECListByStationCodeSpy.mockResolvedValue(mockedStationECs);

    dissociateEcSpy.mockRejectedValue(
      new Error('Error dissociating EC from station')
    );

    const { setAlertMessage } = renderComponent();

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
    // on failure the error is dispatched and the success alert is never shown
    await waitFor(() => {
      expect(mockAddError).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'STATION_DELETE_RELATIONSHIP' })
      );
    });
    expect(setAlertMessage).not.toHaveBeenCalled();
    expect(getECListByStationCodeSpy).toHaveBeenCalledTimes(1);
  });
});
