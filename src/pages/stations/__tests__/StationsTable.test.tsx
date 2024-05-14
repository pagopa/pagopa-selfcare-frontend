import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { store } from '../../../redux/store';
import StationTable from '../list/StationsTable';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { useAppDispatch } from '../../../redux/hooks';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { pspAdminSignedDirect } from '../../../services/__mocks__/partyService';
import * as StationService from '../../../services/stationService';
import { mockedStationsMerged2 } from '../../../services/__mocks__/stationService';

const mockGetStationsMerged = jest.spyOn(StationService, 'getStationsMerged');

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
        <StationTable stationCode={'1'} />
      </Router>
    </ThemeProvider>
  );
};

describe('<StationTable />', () => {
  test('render component StationTable', async () => {
    mockGetStationsMerged.mockReturnValueOnce(Promise.resolve(mockedStationsMerged2));
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
    });
  });
  test('render component StationTable error getStationMerged', async () => {
    mockGetStationsMerged.mockRejectedValueOnce('error');
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
