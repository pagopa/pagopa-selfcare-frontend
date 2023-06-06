import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Router, generatePath } from 'react-router-dom';
import { store } from '../../../redux/store';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import StationDetails from '../detail/components/StationDetails';
import { StationOnCreation } from '../../../model/Station';
import {
  RedirectProtocolEnum,
  StationDetailResource,
  WrapperStatusEnum,
} from '../../../api/generated/portal/StationDetailResource';
import { Protocol4ModEnum, ProtocolEnum } from '../../../api/generated/portal/StationDetailsDto';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { mockedParties } from '../../../services/__mocks__/partyService';
import {
  mockedFullStation,
  mockedWrapperStation,
} from '../../../services/__mocks__/stationService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationDetails />', () => {
  const history = createMemoryHistory();

  // const mockedFullStation: StationOnCreation = {
  //   enabled: true,
  //   stationCode: '97735020584_01',
  //   stationStatus: StationStatusEnum.ACTIVE,
  //   brokerCode: '97735020584',
  //   ip: 'Valore',
  //   ip4Mod: 'Valore',
  //   newPassword: 'Valore',
  //   password: 'Valore',
  //   pofService: 'Valore',
  //   port: 100,
  //   port4Mod: 100,
  //   primitiveVersion: 1,
  //   protocol: ProtocolEnum.HTTPS,
  //   protocol4Mod: Protocol4ModEnum.HTTPS,
  //   redirectIp: 'Valore',
  //   redirectPath: 'Valore',
  //   redirectPort: 8080,
  //   redirectProtocol: RedirectProtocolEnum.HTTPS,
  //   redirectQueryString: 'Valore',
  //   service: 'Valore',
  //   service4Mod: 'Valore',
  //   targetHost: 'Valore',
  //   targetHostPof: 'Valore',
  //   targetPath: 'Valore',
  //   targetPathPof: 'Valore',
  //   targetPort: 1000,
  //   targetPortPof: 1001,
  //   version: 2,
  // };

  const mockedFullStationOnrevision: StationDetailResource = {
    stationCode: '97735020584_01',
    wrapperStatus: WrapperStatusEnum.TO_CHECK,
    activationDate: undefined,
    associatedCreditorInstitutions: 2,
    brokerCode: '97735020584',
    brokerDescription: undefined,
    brokerObjId: 2,
    createdAt: new Date(),
    flagOnline: false,
    ip: undefined,
    ip4Mod: undefined,
    modifiedAt: new Date(),
    newPassword: undefined,
    password: undefined,
    pofService: undefined,
    port: undefined,
    port4Mod: undefined,
    primitiveVersion: 1,
    protocol: undefined,
    protocol4Mod: undefined,
    proxyEnabled: undefined,
    proxyHost: 'Valore',
    proxyPassword: undefined,
    proxyPort: 3000,
    proxyUsername: undefined,
    redirectIp: 'Valore',
    redirectPath: 'Valore',
    redirectPort: 8080,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'Valore',
    rtInstantaneousDispatch: undefined,
    service: undefined,
    service4Mod: undefined,
    targetHost: 'Valore',
    targetHostPof: 'Valore',
    targetPath: 'Valore',
    targetPathPof: 'Valore',
    targetPort: 1000,
    targetPortPof: 1001,
    threadNumber: undefined,
    timeoutA: undefined,
    timeoutB: undefined,
    timeoutC: undefined,
    version: undefined,
    enabled: true,
  };

  test('render component StationDetails and exit button test', () => {
    // store.dispatch(partiesActions.setPartySelected(mockedParties[1]));
    // render(
    //   <Provider store={store}>
    //     <ThemeProvider theme={theme}>
    //       <Router history={history}>
    //         <StationDetails stationDetail={mockedFullStation} formatedDate={jest.fn()} />
    //       </Router>
    //     </ThemeProvider>
    //   </Provider>
    // );
    // const backBtn = screen.getByTestId('exit-btn-test');
    // fireEvent.click(backBtn);
    // expect(history.location.pathname).toBe('/');
    // const showPassword = screen.getByTestId('show-ps2-test');
    // fireEvent.click(showPassword);
  });

  test('Test edit Button with StationDetails in role operator and status approved', () => {
    // store.dispatch(partiesActions.setPartySelected(mockedParties[1]));
    // render(
    //   <Provider store={store}>
    //     <ThemeProvider theme={theme}>
    //       <Router history={history}>
    //         <StationDetails stationDetail={mockedFullStation} formatedDate={jest.fn()} />
    //       </Router>
    //     </ThemeProvider>
    //   </Provider>
    // );
    // const editBtn = screen.getByText('stationDetailPage.stationOptions.editStation');
    // fireEvent.click(editBtn);
  });

  test('render component StationDetails', () => {
    // // store.dispatch(partiesActions.setPartySelected(mockedParties[1]));
    // render(
    //   <Provider store={store}>
    //     <ThemeProvider theme={theme}>
    //       <Router history={history}>
    //         <StationDetails stationDetail={mockedFullStationOnrevision} formatedDate={jest.fn()} />
    //       </Router>
    //     </ThemeProvider>
    //   </Provider>
    // );
    // const editBtn = screen.getByText('stationDetailPage.stationOptions.editStation');
    // fireEvent.click(editBtn);
  });
});
