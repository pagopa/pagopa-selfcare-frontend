import React from 'react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../../redux/store';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import {
  RedirectProtocolEnum,
  StationDetailResource,
  WrapperStatusEnum,
} from '../../../../../api/generated/portal/StationDetailResource';
import {Protocol4ModEnum, ProtocolEnum} from '../../../../../api/generated/portal/StationDetailsDto';
import StationDetailsValidation from '../StationDetailsValidation';
import * as useUserRole from "../../../../../hooks/useUserRole";
import {ROLE} from "../../../../../model/RolePermission";

const nodeCrypto = require('crypto');
// @ts-ignore
window.crypto = {
  getRandomValues: function (buffer) {
    return nodeCrypto.randomFillSync(buffer);
  },
};
const genPassword = crypto.getRandomValues(new Uint32Array(1)).toString();

jest.mock('../../../../components/commonFunctions');
jest.mock("../../../../../hooks/useUserRole");

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

export const mockedFullStation: StationDetailResource = {
  associatedCreditorInstitutions: 0,
  enabled: true,
  stationCode: '97735020584_01',
  wrapperStatus: WrapperStatusEnum.APPROVED,
  brokerCode: '97735020584',
  ip: 'Valore',
  ip4Mod: 'Valore',
  password: genPassword,
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
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: true
    });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${mockedFullStation.stationCode}`]}>
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
    const title = screen.getAllByText('97735020584_01');
    expect(title[0]).toBeInTheDocument();
  });

  test('Test edit Button with StationDetails in role operator and status approved', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: true
    });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${mockedFullStation.stationCode}`]}>
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

  test('Test show password button', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: true
    });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${mockedFullStation.stationCode}`]}>
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

    const showPasswordButton = screen.getByTestId('show-pwd-validation-test') as HTMLInputElement;

    expect(screen.getByText('XXXXXXXXXXXXXX')).toBeInTheDocument();
    expect(screen.queryByText(genPassword)).toBeNull();

    fireEvent.click(showPasswordButton);
    await waitFor(() => {
      expect(screen.getByText(genPassword)).toBeInTheDocument();
    });
  });
});
