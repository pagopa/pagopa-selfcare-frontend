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
import { pspAdminSignedDirect } from '../../../../services/__mocks__/partyService';
import { mockedStations } from '../../../../services/__mocks__/stationService';
import * as StationService from '../../../../services/stationService';
import StationsTable from '../StationsTable';

const mockGetStationsMerged = jest.spyOn(StationService, 'getStationsMerged');

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

const Component = () => {
    const history = createMemoryHistory();
    const dispatch = useAppDispatch();
    dispatch(partiesActions.setPartySelected(pspAdminSignedDirect));

    return (
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <StationsTable stationCode={'1'} statusFilter={ConfigurationStatus.ACTIVE}/>
            </Router>
        </ThemeProvider>
    );
};

describe('<StationTable />', () => {
    test('render component StationTable', async () => {
        mockGetStationsMerged.mockReturnValueOnce(Promise.resolve(mockedStations));
        render(
            <Provider store={store}>
                <Component/>
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
                <Component/>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
        });
    });
});
