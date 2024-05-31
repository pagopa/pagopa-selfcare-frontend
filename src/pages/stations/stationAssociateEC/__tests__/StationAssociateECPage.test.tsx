import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { partiesActions } from '../../../../redux/slices/partiesSlice';
import { store } from '../../../../redux/store';
import { mockedCreditorInstitutionInfoArray } from '../../../../services/__mocks__/creditorInstitutionService';
import { ecAdminSignedDirect } from '../../../../services/__mocks__/partyService';
import { mockedSegregationCodeList } from '../../../../services/__mocks__/stationService';
import * as creditorInsitutionService from '../../../../services/creditorInstitutionService';
import StationAssociateECPage from '../StationAssociateECPage';

let getStationAvailableECSpy: jest.SpyInstance;
let getCreditorInstitutionSegregationCodesSpy: jest.SpyInstance;
let getAvailableCreditorInstitutionsForStationSpy: jest.SpyInstance;
let associateEcToStationSpy: jest.SpyInstance;

beforeEach(() => {
  getCreditorInstitutionSegregationCodesSpy = jest.spyOn(
    require('../../../../services/stationService'),
    'getCreditorInstitutionSegregationCodes'
  );
  getAvailableCreditorInstitutionsForStationSpy = jest.spyOn(
    creditorInsitutionService,
    'getAvailableCreditorInstitutionsForStation'
  );
  associateEcToStationSpy = jest.spyOn(
    require('../../../../services/stationService'),
    'associateEcToStation'
  );
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationAssociateECPage />', () => {
  const stationId = 'XPAY_03_ONUS';
  test('render component StationAssociateECPage', async () => {
    getAvailableCreditorInstitutionsForStationSpy.mockResolvedValue(
      mockedCreditorInstitutionInfoArray
    );

    getCreditorInstitutionSegregationCodesSpy.mockResolvedValue(mockedSegregationCodeList);
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
          <Route path="/stations/:stationId/associate-ec">
            <ThemeProvider theme={theme}>
              <StationAssociateECPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const segCodeMocked = mockedSegregationCodeList.availableCodes
      ? mockedSegregationCodeList.availableCodes[0]
      : '';

    const ecSelectionSearch = screen
      .getByTestId('ec-selection-id-test')
      .querySelector('input') as HTMLInputElement;

    fireEvent.mouseDown(ecSelectionSearch);
    fireEvent.select(ecSelectionSearch, {
      target: { value: mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].business_name },
    });
    expect(ecSelectionSearch.value).toBe(mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].business_name);

    const auxDigit = screen.getByTestId('aux-digit-test') as HTMLInputElement;
    expect(auxDigit.value).toBe('3');

    const segCode = screen.getByTestId('segregation-code-test');
    fireEvent.change(segCode, { target: { value: segCodeMocked } });

    const confirm = screen.getByTestId('confirm-btn-test');
    fireEvent.click(confirm);

    const broadcast = screen.getByTestId('broadcast-test');
    fireEvent.click(broadcast);

    const back = screen.getByTestId('back-btn-test');
    fireEvent.click(back);
  });

  test('render component StationAssociateECPage getAvailableCreditorInstitutionsForStation error', async () => {
    getAvailableCreditorInstitutionsForStationSpy.mockRejectedValueOnce(new Error('error'));

    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
          <Route path="/stations/:stationId/associate-ec">
            <ThemeProvider theme={theme}>
              <StationAssociateECPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  test('render component StationAssociateECPage getCreditorInstitutionSegregationcodes generic error', async () => {
    getAvailableCreditorInstitutionsForStationSpy.mockResolvedValue(
      mockedCreditorInstitutionInfoArray
    );
    getCreditorInstitutionSegregationCodesSpy.mockRejectedValueOnce(new Error('error'));
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
          <Route path="/stations/:stationId/associate-ec">
            <ThemeProvider theme={theme}>
              <StationAssociateECPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const ecSelectionSearch = screen
      .getByTestId('ec-selection-id-test')
      .querySelector('input') as HTMLInputElement;

    fireEvent.mouseDown(ecSelectionSearch);
    fireEvent.select(ecSelectionSearch, {
      target: { value: mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].business_name },
    });
    expect(ecSelectionSearch.value).toBe(mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].business_name);
  });

  test('render component StationAssociateECPage getCreditorInstitutionSegregationcodes empty response', async () => {
    getAvailableCreditorInstitutionsForStationSpy.mockResolvedValue([]);

    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
          <Route path="/stations/:stationId/associate-ec">
            <ThemeProvider theme={theme}>
              <StationAssociateECPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const alertMessage = screen.getByTestId('alert-warning-test');
    expect(alertMessage).toBeInTheDocument();
  });
});
