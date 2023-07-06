import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import ChannelDetails from '../components/ChannelDetails';
import {
  Redirect_protocolEnum,
  StatusEnum,
} from '../../../../api/generated/portal/ChannelDetailsDto';
import {
  mockedPaymentTypes,
  mockedChannelDetail,
} from '../../../../services/__mocks__/channelService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.resetModules();
});
afterEach(cleanup);

describe('<ChannelDetails />', () => {
  const channelId = 'XPAY_03_ONUS';
  const channelDetailWrapper = {
    broker_psp_code: '97735020584',
    broker_description: 'AgID - Agenzia per l’Italia Digitale',
    channel_code: `${channelId}`,
    redirect_protocol: Redirect_protocolEnum.HTTPS,
    redirect_path: 'reirect_parameters',
    redirect_ip: 'esempiolink.redirect.it',
    redirect_port: 8080,
    redirect_query_string: 'redirect_service',
    target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
    target_port: 8081,
    target_host: ' lab.link.it',
    payment_types: mockedPaymentTypes.payment_types.map((e) => e.payment_type),
    status: StatusEnum.TO_CHECK,
  };
  test('render component ChannelDetails with channelDetail and channelDetailWrapper', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
          <Route path="/channels/:channelId">
            <ThemeProvider theme={theme}>
              <ChannelDetails
                channelDetail={channelDetailWrapper}
                channelDetailWrapper={mockedChannelDetail(`${channelId}`)}
                channelId={channelId}
                goBack={jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  test('render component ChannelDetails with only channelDetailWrapper', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
          <Route path="/channels/:channelId">
            <ThemeProvider theme={theme}>
              <ChannelDetails
                channelDetail={channelDetailWrapper}
                channelId={channelId}
                goBack={jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
