import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import ChannelDetails from '../components/ChannelDetails';
import { StatusEnum } from '../../../../api/generated/portal/ChannelDetailsDto';
import { mockedPaymentTypes } from '../../../../services/__mocks__/configurationService';

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
    target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
    target_port: 8081,
    target_host: ' lab.link.it',
    payment_types: mockedPaymentTypes.payment_types!.map((e) => e.payment_type ?? ''),
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
                channelId={channelId}
                goBack={jest.fn()}
                PSPAssociatedNumber={0}
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
                PSPAssociatedNumber={0}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});

//SNAPSHOT TESTING
it('renders correctly', () => {
  const channelId = 'XPAY_03_ONUS';
  const channelDetailWrapper = {
    broker_psp_code: '97735020584',
    broker_description: 'AgID - Agenzia per l’Italia Digitale',
    channel_code: `${channelId}`,
    target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
    target_port: 8081,
    target_host: ' lab.link.it',
    payment_types: mockedPaymentTypes.payment_types!.map((e) => e.payment_type ?? ''),
    status: StatusEnum.TO_CHECK,
  };
  const tree = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
        <Route path="/channels/:channelId">
          <ThemeProvider theme={theme}>
            <ChannelDetails
              channelDetail={channelDetailWrapper}
              channelId={channelId}
              goBack={jest.fn()}
              PSPAssociatedNumber={0}
            />
          </ThemeProvider>
        </Route>
      </MemoryRouter>
    </Provider>
  );
  expect(tree).toMatchSnapshot();
});
