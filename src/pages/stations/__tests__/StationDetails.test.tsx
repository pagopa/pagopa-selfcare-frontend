import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { store } from '../../../redux/store';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import StationDetails from '../detail/components/StationDetails';
import { StationOnCreation } from '../../../model/Station';
import {
  RedirectProtocolEnum,
  StationStatusEnum,
} from '../../../api/generated/portal/StationDetailResource';
import { Protocol4ModEnum, ProtocolEnum } from '../../../api/generated/portal/StationDetailsDto';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationDetails />', () => {
  const history = createMemoryHistory();

  const mockedFullStation: StationOnCreation = {
    enabled: true,
    stationCode: '97735020584_01',
    stationStatus: StationStatusEnum.ACTIVE,
    brokerCode: '97735020584',
    ip: 'Valore',
    ip4Mod: 'Valore',
    newPassword: 'Valore',
    password: 'Valore',
    pofService: 'Valore',
    port: 100,
    port4Mod: 100,
    primitiveVersion: 1,
    protocol: ProtocolEnum.HTTPS,
    protocol4Mod: Protocol4ModEnum.HTTPS,
    redirectIp: 'Valore',
    redirectPath: 'Valore',
    redirectPort: 8080,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'Valore',
    service: 'Valore',
    service4Mod: 'Valore',
    targetHost: 'Valore',
    targetHostPof: 'Valore',
    targetPath: 'Valore',
    targetPathPof: 'Valore',
    targetPort: 1000,
    targetPortPof: 1001,
    version: 2,
  };

  test('render component StationDetails', () => {
    // store.dispatch(partiesActions.setPartySelected(mockedParties[1]));
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <StationDetails stationDetail={mockedFullStation} formatedDate={jest.fn()} />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const backBtn = screen.getByTestId('exit-btn-test');
    fireEvent.click(backBtn);

    expect(history.location.pathname).toBe('/');

    const showPassword = screen.getByTestId('show-ps2-test');
    fireEvent.click(showPassword);
  });
});
