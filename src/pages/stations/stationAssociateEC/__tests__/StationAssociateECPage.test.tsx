import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { partiesActions } from '../../../../redux/slices/partiesSlice';
import { store } from '../../../../redux/store';
import { ecAdminSignedDirect } from '../../../../services/__mocks__/partyService';
import { mockedSegregationCodeList } from '../../../../services/__mocks__/stationService';
import StationAssociateECPage from '../StationAssociateECPage';
import { mockedDelegatedPSP } from '../../../../services/__mocks__/institutionsService';

let getStationAvailableECSpy: jest.SpyInstance;
let getCreditorInstitutionSegregationCodesSpy: jest.SpyInstance;
let getBrokerDelegationSpy: jest.SpyInstance;
let associateEcToStationSpy: jest.SpyInstance;

beforeEach(() => {
  getStationAvailableECSpy = jest.spyOn(
    require('../../../../services/stationService'),
    'getStationAvailableEC'
  );
  getCreditorInstitutionSegregationCodesSpy = jest.spyOn(
    require('../../../../services/stationService'),
    'getCreditorInstitutionSegregationCodes'
  );
  getBrokerDelegationSpy = jest.spyOn(
    require('../../../../services/institutionService'),
    'getBrokerDelegation'
  );
  associateEcToStationSpy = jest.spyOn(
    require("../../../../services/stationService"),
    "associateEcToStation"
  )
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationAssociateECPage />', () => {
  const stationId = 'XPAY_03_ONUS';
  test('render component StationAssociateECPage', async () => {
    getStationAvailableECSpy.mockResolvedValue([
      {
        broker_psp_code: '0000001',
        description: 'Intesa San Paolo S.P.A',
        broker_id: "brokerID1",
        enabled: true,
        extended_fault_bean: true,
      },
      {
        broker_psp_code: '0000002',
        broker_id: "brokerID2",
        description: 'Sogei',
        enabled: true,
        extended_fault_bean: true,
      },
    ]);
    getBrokerDelegationSpy.mockResolvedValue(mockedDelegatedPSP);

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

    const ecSelectionSearch = screen.getByText(
      'Digita il nome del nuovo EC da associare alla stazione'
    );
    expect(ecSelectionSearch).toBeInTheDocument();

    const newEc = screen.getByTestId('ec-selection-search') as HTMLInputElement;
    fireEvent.change(newEc, { target: { value: 'Azienda Pubblica di Servizi alla Persona Test 1' } });
    fireEvent.change(newEc, { target: { value: 'Azienda Pubblica di Servizi alla Persona Test 2' } });

    const searchSubmit = screen.getByTestId('search-field-test');
    fireEvent.click(searchSubmit);

    const auxDigit = screen.getByTestId('aux-digit-test');
    fireEvent.change(auxDigit, { target: { value: 3 } });

    const segCode = screen.getByTestId('segregation-code-test');
    fireEvent.change(segCode, { target: { value: segCodeMocked } });

    const confirm = screen.getByTestId('confirm-btn-test');
    fireEvent.click(confirm);

    const broadcast = screen.getByTestId('broadcast-test');
    fireEvent.click(broadcast);

    const back = screen.getByTestId('back-btn-test');
    fireEvent.click(back);
  });

  test('render component StationAssociateECPage getBrokerDelegation error', async () => {
    getStationAvailableECSpy.mockResolvedValue([
      {
        broker_psp_code: '0000001',
        description: 'Intesa San Paolo S.P.A',
        enabled: true,
        extended_fault_bean: true,
      },
      {
        broker_psp_code: '0000002',
        description: 'Sogei',
        enabled: true,
        extended_fault_bean: true,
      },
    ]);
    getBrokerDelegationSpy.mockRejectedValueOnce(new Error('error'));

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
  });

  test('render component StationAssociateECPage getCreditorInstitutionSegregationcodes generic error', async () => {
    getStationAvailableECSpy.mockResolvedValue([
      {
        broker_psp_code: '0000001',
        description: 'Intesa San Paolo S.P.A',
        enabled: true,
        extended_fault_bean: true,
      },
      {
        broker_psp_code: '0000002',
        description: 'Sogei',
        enabled: true,
        extended_fault_bean: true,
      },
    ]);
    getBrokerDelegationSpy.mockRejectedValueOnce(new Error('error'));
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
  });

  test('render component StationAssociateECPage getCreditorInstitutionSegregationcodes generic error 404', async () => {
    getStationAvailableECSpy.mockResolvedValue([
      {
        broker_psp_code: '0000001',
        description: 'Intesa San Paolo S.P.A',
        enabled: true,
        extended_fault_bean: true,
      },
      {
        broker_psp_code: '0000002',
        description: 'Sogei',
        enabled: true,
        extended_fault_bean: true,
      },
    ]);
    getBrokerDelegationSpy.mockRejectedValueOnce(new Error('error'));
    getCreditorInstitutionSegregationCodesSpy.mockRejectedValueOnce(
      new Error(JSON.stringify({ status: 404 }))
    );
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
});
