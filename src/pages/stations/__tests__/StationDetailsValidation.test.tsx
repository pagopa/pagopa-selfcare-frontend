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
  // StationStatusEnum,
  WrapperStatusEnum,
} from '../../../api/generated/portal/StationDetailResource';
import {
  Protocol4ModEnum,
  ProtocolEnum,
  StatusEnum,
} from '../../../api/generated/portal/StationDetailsDto';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { mockedParties } from '../../../services/__mocks__/partyService';
import {
  mockedFullStation,
  mockedWrapperStation,
} from '../../../services/__mocks__/stationService';
import StationDetailsValidation from '../detail/components/StationDetailsValidation';
import { TypeEnum } from '../../../api/generated/portal/WrapperEntityOperationsOfobject';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationDetailsValidation.test />', () => {
  const history = createMemoryHistory();

  // const mockedFullStation: StationOnCreation = {
  //   // enabled: true,
  //   stationCode: '97735020584_01',
  //   wrapperStatus: WrapperStatusEnum.APPROVED,
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

  const mockedStationWrapperEntity = {
    createdAt: new Date(),
    entity: {
      stationCode: '97735020584_01',
      brokerCode: '97735020584',
      wrapperStatus: WrapperStatusEnum.TO_CHECK,
      enabled: true,
      primitiveVersion: 1,
      redirectProtocol: RedirectProtocolEnum.HTTPS,
      redirectPort: 3000,
      redirectIp: 'Esempio Ip',
      redirectPath: 'Esempio Pat',
      redirectQueryString: 'Esempio parametri',
      targetHost: 'Esempio indirizzo',
      targetPath: 'Esempio Pat',
      targetPort: 3001,
      targetHostPof: 'Valore',
      targetPathPof: 'Valore',
      targetPortPof: 1001,
    },
    id: 'string',
    modifiedAt: new Date(),
    modifiedBy: 'string',
    modifiedByOpt: 'Operatore EC',
    note: 'string',
    status: StatusEnum.APPROVED,
    type: TypeEnum.STATION,
  };

  test('render component StationDetails and exit button test', () => {
    // store.dispatch(partiesActions.setPartySelected(mockedParties[1]));
    // render(
    //   <Provider store={store}>
    //     <ThemeProvider theme={theme}>
    //       <Router history={history}>
    //         <StationDetailsValidation
    //           stationDetail={mockedFullStation}
    //           formatedDate={jest.fn()}
    //           StationDetailsValidation={mockedFullStation}
    //           goBack={jest.fn()}
    //         />
    //       </Router>
    //     </ThemeProvider>
    //   </Provider>
    // );
    // const backBtn = screen.getByTestId('back-btn-test');
    // fireEvent.click(backBtn);
    // expect(history.location.pathname).toBe('/');
  });

  test('Test edit Button with StationDetails in role operator and status approved', async () => {
    // store.dispatch(partiesActions.setPartySelected(mockedParties[1]));
    // render(
    //   <Provider store={store}>
    //     <ThemeProvider theme={theme}>
    //       <Router history={history}>
    //         <StationDetailsValidation
    //           stationDetail={mockedFullStation}
    //           formatedDate={jest.fn()}
    //           StationDetailsValidation={mockedFullStation}
    //           goBack={jest.fn()}
    //         />
    //       </Router>
    //     </ThemeProvider>
    //   </Provider>
    // );
  });
});
