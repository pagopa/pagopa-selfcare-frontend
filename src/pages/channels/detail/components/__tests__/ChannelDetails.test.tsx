import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, screen, render, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../../redux/store';
import { Provider } from 'react-redux';
import ChannelDetails from '../ChannelDetails';
import { StatusEnum } from '../../../../../api/generated/portal/ChannelDetailsDto';
import { mockedPaymentTypes } from '../../../../../services/__mocks__/configurationService';
import * as useUserRole from '../../../../../hooks/useUserRole';
import { ROLE } from '../../../../../model/RolePermission';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.resetModules();
});
afterEach(cleanup);

const pFieldValue = 'randomValue';

describe('<ChannelDetails />', () => {
  const channelId = 'XPAY_03_ONUS';
  const channelDetail = {
    broker_psp_code: '97735020584',
    broker_description: 'AgID - Agenzia per l’Italia Digitale',
    channel_code: `${channelId}`,
    target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
    target_port: 8081,
    target_host: ' lab.link.it',
    proxy_host: ' proxy.link.it',
    payment_types: mockedPaymentTypes.payment_types!.map((e) => e.payment_type ?? ''),
    status: StatusEnum.TO_CHECK,
    password: pFieldValue,
  };
  const channelDetailToFix = {
    broker_psp_code: '97735020584',
    broker_description: 'AgID - Agenzia per l’Italia Digitale',
    channel_code: `${channelId}`,
    target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
    target_port: 8081,
    target_host: ' lab.link.it',
    proxy_host: ' proxy.link.it',
    payment_types: mockedPaymentTypes.payment_types!.map((e) => e.payment_type ?? ''),
    status: StatusEnum.TO_FIX,
    password: pFieldValue,
    note: 'note',
  };
  test('render component ChannelDetails with channelDetail', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
        userRole: ROLE.PAGOPA_OPERATOR,
        userIsPspAdmin: false,
        userIsEcAdmin: false,
        userIsPspDirectAdmin: false,
        userIsPagopaOperator: true,
        userIsAdmin: true,
    });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
          <Route path="/channels/:channelId">
            <ThemeProvider theme={theme}>
              <ChannelDetails
                channelDetail={channelDetail}
                channelId={channelId}
                PSPAssociatedNumber={0}
                setChannelDetail={jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const passwordField = screen.getByTestId('password-value-test') as HTMLElement;
    expect(passwordField.innerHTML).toBe('XXXXXXXXXXXXXX');

    const showPasswordButton = screen.getByTestId('show-psw-test') as HTMLElement;

    fireEvent.click(showPasswordButton);

    expect(passwordField.innerHTML).toBe(pFieldValue);
  });

  test('render component ChannelDetails with channelDetail TO_FIX', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
        userRole: ROLE.PAGOPA_OPERATOR,
        userIsPspAdmin: false,
        userIsEcAdmin: false,
        userIsPspDirectAdmin: false,
        userIsPagopaOperator: true,
        userIsAdmin: true,
    });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
          <Route path="/channels/:channelId">
            <ThemeProvider theme={theme}>
              <ChannelDetails
                channelDetail={channelDetailToFix}
                channelId={channelId}
                PSPAssociatedNumber={0}
                setChannelDetail={jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const passwordField = screen.getByTestId('password-value-test') as HTMLElement;
    expect(passwordField.innerHTML).toBe('XXXXXXXXXXXXXX');

    const showPasswordButton = screen.getByTestId('show-psw-test') as HTMLElement;

    fireEvent.click(showPasswordButton);

    expect(passwordField.innerHTML).toBe(pFieldValue);
  });

  test('render component ChannelDetails with empty channelDetail', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
        userRole: ROLE.EC_DIRECT_ADMIN,
        userIsPspAdmin: false,
        userIsEcAdmin: true,
        userIsPspDirectAdmin: false,
        userIsPagopaOperator: false,
        userIsAdmin: true,
    });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
          <Route path="/channels/:channelId">
            <ThemeProvider theme={theme}>
              <ChannelDetails
                channelDetail={{
                  broker_psp_code: undefined,
                  broker_description: undefined,
                  channel_code: '',
                  target_path: undefined,
                  target_port: undefined,
                  target_host: undefined,
                  payment_types: undefined,
                }}
                channelId={channelId}
                PSPAssociatedNumber={0}
                setChannelDetail={jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    let noPassword = false;
    try {
      screen.getByTestId('password-value-test');
    } catch (_) {
      noPassword = true;
    }
    expect(noPassword).toBeTruthy();
  });
});
