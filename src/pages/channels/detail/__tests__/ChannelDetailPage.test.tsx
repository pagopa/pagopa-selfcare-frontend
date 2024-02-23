import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import ChannelDetailPage from '../ChannelDetailPage';
import { Provider } from 'react-redux';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.resetModules();
});
afterEach(cleanup);

//SNAPSHOT TESTING
it('renders correctly', () => {
  const channelId = 'XPAY_03_ONUS';
  const tree = render(
    <Provider store={store}>
    <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
      <Route path="/channels/:channelId">
        <ThemeProvider theme={theme}>
          <ChannelDetailPage />
        </ThemeProvider>
      </Route>
    </MemoryRouter>
  </Provider>
  );
  expect(tree).toMatchSnapshot();
});


describe('<ChannelDetailPage />', () => {
  const channelId = 'XPAY_03_ONUS';
  test('render component ChannelDetailPage', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
          <Route path="/channels/:channelId">
            <ThemeProvider theme={theme}>
              <ChannelDetailPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});


