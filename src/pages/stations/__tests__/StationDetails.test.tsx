import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { store } from '../../../redux/store';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import StationDetails from '../detail/components/StationDetails';
import {
  RedirectProtocolEnum,
  StationDetailResource,
  WrapperStatusEnum,
} from '../../../api/generated/portal/StationDetailResource';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { isOperator } from '../components/commonFunctions';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

export const mockedFullStationApproved: StationDetailResource = {
  stationCode: '81001870922_06',
  enabled: true,
  brokerDescription: '',
  version: 1,
  associatedCreditorInstitutions: 0,
  activationDate: new Date('2023-06-07T16:30:26.384Z'),
  createdAt: new Date('2023-06-07T16:30:26.384Z'),
  modifiedAt: new Date('2023-06-07T16:30:26.384Z'),
  redirectIp: '11.22.44',
  redirectPath: 'Stazione/path/redirect/prova',
  redirectPort: 3333,
  redirectQueryString: 'nessuno',
  redirectProtocol: RedirectProtocolEnum.HTTPS,
  brokerCode: '81001870922',
  threadNumber: 1,
  timeoutA: 15,
  timeoutB: 30,
  timeoutC: 120,
  targetHost: '33.55.66',
  targetPort: 4443,
  targetPath: 'Stazione/path/target/prova',
  primitiveVersion: 1,
  wrapperStatus: WrapperStatusEnum.APPROVED,
  password: 'password',
};

export const mockedFullStationToCheck: StationDetailResource = {
  stationCode: '81001870922_06',
  enabled: true,
  brokerDescription: '',
  version: 1,
  associatedCreditorInstitutions: 0,
  activationDate: new Date('2023-06-07T16:30:26.384Z'),
  createdAt: new Date('2023-06-07T16:30:26.384Z'),
  modifiedAt: new Date('2023-06-07T16:30:26.384Z'),
  redirectIp: '11.22.44',
  redirectPath: 'Stazione/path/redirect/prova',
  redirectPort: 3333,
  redirectQueryString: 'nessuno',
  redirectProtocol: RedirectProtocolEnum.HTTPS,
  brokerCode: '81001870922',
  threadNumber: 1,
  timeoutA: 15,
  timeoutB: 30,
  timeoutC: 120,
  targetHost: '33.55.66',
  targetPort: 4443,
  targetPath: 'Stazione/path/target/prova',
  primitiveVersion: 1,
  wrapperStatus: WrapperStatusEnum.TO_CHECK,
};

describe('<StationDetails />', () => {
  const history = createMemoryHistory();

  test('render component StationDetails and exit button test', () => {
    store.dispatch(partiesActions.setPartySelected(mockedParties[1]));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station/${mockedFullStationToCheck.stationCode}`]}>
          <Route path="/stations/:stationId">
            <ThemeProvider theme={theme}>
              <StationDetails
                stationDetail={mockedFullStationApproved}
                formatedDate={jest.fn()}
                goBack={() => jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
    if (!isOperator()) {
      const backBtn = screen.getByTestId('exit-btn-test');
      fireEvent.click(backBtn);
      expect(history.location.pathname).toBe('/');

      const showPassword = screen.getByTestId('show-psw-test');
      fireEvent.click(showPassword);
    }
  });

  test('Test edit Button with StationDetails in role operator and status approved', async () => {
    store.dispatch(partiesActions.setPartySelected(mockedParties[1]));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station/${mockedFullStationApproved.stationCode}`]}>
          <Route path="/stations/:stationId">
            <ThemeProvider theme={theme}>
              <StationDetails
                stationDetail={mockedFullStationApproved}
                formatedDate={jest.fn()}
                goBack={() => jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
    if (!isOperator()) {
      const editBtn = await screen.findByTestId('edit-btn-sts-approved');
      fireEvent.click(editBtn);
    }
  });

  test('render component StationDetails', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station/${mockedFullStationToCheck.stationCode}`]}>
          <Route path="/stations/:stationId">
            <ThemeProvider theme={theme}>
              <StationDetails
                stationDetail={mockedFullStationToCheck}
                formatedDate={jest.fn()}
                goBack={() => jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
    if (!isOperator()) {
      const editBtn = await screen.findByTestId('edit-ope-sts-chk');
      fireEvent.click(editBtn);
    }
  });
});
