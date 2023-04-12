import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { generatePath, Router } from 'react-router-dom';
import { store } from '../../../redux/store';
import AddEditChannelPage from '../addEditChannel/AddEditChannelPage';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import ROUTES from '../../../routes';
import { PortalApi } from '../../../api/PortalApiClient';
import { FormAction } from '../../../model/Channel';

// let portalApiGetChannelDetail;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  // portalApiGetChannelDetail = jest.spyOn(PortalApi, 'getChannelDetail');
});

afterEach(cleanup);

describe('<AddEditChannelPage />', () => {
  const history = createMemoryHistory();

  test('render component AddEditChannelPage', () => {
    generatePath(ROUTES.CHANNEL_EDIT, { channelId: '123465', actionId: FormAction.Edit });
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditChannelPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );
    // expect(portalApiGetChannelDetail).toHaveBeenCalled();
  });
});
