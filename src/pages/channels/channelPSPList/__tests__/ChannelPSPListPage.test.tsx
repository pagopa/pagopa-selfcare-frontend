import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../../redux/store';
import ChannelPSPListPage from '../ChannelPSPListPage';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.resetModules();
});
afterEach(cleanup);

describe('<ChannelPSPTable />', () => {
  const channelId = 'XPAY_03_ONUS';
  test('render component ChannelPSPTable', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}/psp-list`]}>
          <Route path="/channels/:channelId/psp-list">
            <ThemeProvider theme={theme}>
              <ChannelPSPListPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
