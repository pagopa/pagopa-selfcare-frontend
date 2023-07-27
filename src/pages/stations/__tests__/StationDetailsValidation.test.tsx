import React from 'react';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
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
import { isOperator } from '../components/commonFunctions';

const nodeCrypto = require('crypto');
window.crypto = {
  getRandomValues: function (buffer) {
    return nodeCrypto.randomFillSync(buffer);
  },
};
const genPassword = crypto.getRandomValues(new Uint32Array(1)).toString();

jest.mock('../components/commonFunctions');

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
    (isOperator as jest.Mock).mockReturnValue(true);

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
    (isOperator as jest.Mock).mockReturnValue(true);

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

    const showPasswordBtn = screen.getByTestId('show-pwd-validation-test') as HTMLInputElement;

    expect(screen.getAllByText('XXXXXXXXXXXXXX')[0]).toBeInTheDocument();
    expect(screen.queryByText(genPassword)).toBeNull();

    fireEvent.click(showPasswordBtn);
    await waitFor(() => {
      expect(screen.getAllByText(genPassword)[0]).toBeInTheDocument();
    });
  });
});
