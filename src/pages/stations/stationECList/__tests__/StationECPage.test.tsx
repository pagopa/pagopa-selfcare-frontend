import React from 'react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route, Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from '../../../../redux/store';
import StationECPage from '../StationECPage';
import {createMemoryHistory, LocationDescriptor} from 'history';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
    jest.resetModules();
});
afterEach(cleanup);

describe('<StationECTable />', () => {
    const stationId = 'XPAY_03_ONUS';
    test('render component StationECTable', async () => {
        await waitFor(() => {
            render(
                <Provider store={store}>
                    <MemoryRouter initialEntries={[`/stations/${stationId}/ec-list`]}>
                        <Route path="/stations/:stationId/ec-list">
                            <ThemeProvider theme={theme}>
                                <StationECPage/>
                            </ThemeProvider>
                        </Route>
                    </MemoryRouter>
                </Provider>
            );
        });
    });

    test('render component StationECTable with Alert', async () => {
        const state = {alertSuccessMessage: 'testAlertMessage'};
        const history = createMemoryHistory({
            initialEntries: [{pathname: `/stations/${stationId}/ec-list`, state: state}],
        });

        await waitFor(() => {
            render(
                <Provider store={store}>
                    <Router history={history}>
                        <Route path="/stations/:stationId/ec-list">
                            <ThemeProvider theme={theme}>
                                <StationECPage/>
                            </ThemeProvider>
                        </Route>
                    </Router>
                </Provider>
            );
        });

        const alertSuccessMessage = await screen.getAllByText(/testAlertMessage/i);
        expect(alertSuccessMessage.length).toBe(1);
    });
});
