import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import {
  RedirectProtocolEnum,
  StationDetailResource,
  WrapperStatusEnum,
} from '../../../api/generated/portal/StationDetailResource';
import { Protocol4ModEnum, ProtocolEnum } from '../../../api/generated/portal/StationDetailsDto';
import StationDetailsValidation from '../detail/components/StationDetailsValidation';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

export const mockedFullStation: StationDetailResource = {
  enabled: true,
  stationCode: '97735020584_01',
  wrapperStatus: WrapperStatusEnum.APPROVED,
  brokerCode: '97735020584',
  ip: 'Valore',
  ip4Mod: 'Valore',
  newPassword: 'Valore',
  password: 'Valore',
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
  targetPath: 'Valore',
  targetPort: 1000,
  version: 2,
};

describe('<StationDetailsValidation.test />', () => {
  createMemoryHistory();

  test('render component StationDetailsValidation', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station/${mockedFullStation.stationCode}`]}>
          <Route path="/stations/:stationId">
            <ThemeProvider theme={theme}>
              <StationDetailsValidation
                stationDetail={mockedFullStation}
                // @ts-ignore TODO
                formatedDate={jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  test('Test edit Button with StationDetails in role operator and status approved', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/station/${mockedFullStation.stationCode}`]}>
          <Route path="/stations/:stationId">
            <ThemeProvider theme={theme}>
              <StationDetailsValidation
                stationDetail={mockedFullStation}
                // @ts-ignore TODO
                formatedDate={jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
