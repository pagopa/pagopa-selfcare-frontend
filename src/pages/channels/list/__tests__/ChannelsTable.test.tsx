import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ConfigurationStatus } from '../../../../model/Station';
import { useAppDispatch } from '../../../../redux/hooks';
import { partiesActions } from '../../../../redux/slices/partiesSlice';
import { store } from '../../../../redux/store';
import { mockedChannels } from '../../../../services/__mocks__/channelService';
import { pspAdminSignedDirect } from '../../../../services/__mocks__/partyService';
import * as ChannelService from '../../../../services/channelService';
import ChannelsTable from '../ChannelsTable';

const mockGetChannelsMerged = jest.spyOn(ChannelService, 'getChannelsMerged');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const Component = () => {
  const history = createMemoryHistory();
  const dispatch = useAppDispatch();
  dispatch(partiesActions.setPartySelected(pspAdminSignedDirect));

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <ChannelsTable channelCodeFilter={'1'} statusFilter={ConfigurationStatus.ACTIVE} />
      </Router>
    </ThemeProvider>
  );
};

describe('<ChannelsTable />', () => {
  test('render component ChannelsTable', async () => {
    mockGetChannelsMerged.mockReturnValue(Promise.resolve(mockedChannels));
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
    });
  });
  test('render component ChannelsTable error getChannelsMerged', async () => {
    mockGetChannelsMerged.mockRejectedValue('error');
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
    });
  });
});
