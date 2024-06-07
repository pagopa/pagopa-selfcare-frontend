import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from '../../../../redux/store';
import StationECTable from '../StationECTable';
import * as stationService from '../../../../services/stationService';
import React from 'react';
import {mockedStationECs} from '../../../../services/__mocks__/stationService';

let spyApi: jest.SpyInstance;
const getECListByStationCodeSpy = jest.spyOn(stationService, 'getECListByStationCode');

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
    spyApi = jest.spyOn(stationService, 'dissociateECfromStation');
});

afterEach(cleanup);

describe('<StationECTable />', () => {
    const stationId = 'XPAY_03_ONUS';
    test('Break up EC Station relationship', async () => {
        getECListByStationCodeSpy.mockReturnValueOnce(Promise.resolve(mockedStationECs));

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${stationId}`]}>
                    <Route path="/stations/:stationId">
                        <ThemeProvider theme={theme}>
                            <StationECTable setAlertMessage={() => ''} ciNameOrFiscalCodeFilter={''}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            const table = screen.getByTestId('table-data-grid');
            expect(table).toBeInTheDocument();
        });
    });
});
