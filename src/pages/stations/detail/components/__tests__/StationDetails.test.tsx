import React from 'react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../../redux/store';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import StationDetails from '../StationDetails';
import * as useUserRole from '../../../../../hooks/useUserRole';
import {ROLE} from '../../../../../model/RolePermission';
import {mockedFullStation} from '../../../../../services/__mocks__/stationService';

jest.mock('../../../../components/commonFunctions');
jest.mock('../../../../../hooks/useUserRole');

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('<StationDetails.test />', () => {
    createMemoryHistory();

    test('render component StationDetails not as operator', () => {
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PAGOPA_OPERATOR,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: false,
            userIsAdmin: true,
        });
        const mockedStation = {...mockedFullStation, isConnectionSync: true};
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${mockedFullStation.stationCode}`]}>
                    <Route path="/stations/:stationId">
                        <ThemeProvider theme={theme}>
                            <StationDetails
                                stationDetail={mockedStation}
                                setStationDetail={jest.fn()}
                                ecAssociatedNumber={0}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.queryByTestId('connection-sync-section')).toBeInTheDocument();

        expect(screen.queryByTestId('activation-date')).toBeInTheDocument();
        expect(screen.queryByTestId("associated-ec")).toBeInTheDocument();
        expect(screen.queryByTestId("operator-section")).not.toBeInTheDocument();
    });

    test('Test edit Button with StationDetails in role operator and status approved', async () => {
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PAGOPA_OPERATOR,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: true,
            userIsAdmin: true,
        });
        const mockStation = {...mockedFullStation, pofService: "service"};
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${mockStation.stationCode}`]}>
                    <Route path="/stations/:stationId">
                        <ThemeProvider theme={theme}>
                            <StationDetails
                                stationDetail={mockStation}
                                setStationDetail={jest.fn()}
                                ecAssociatedNumber={0}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.queryByTestId('activation-date')).not.toBeInTheDocument();
        expect(screen.queryByTestId("associated-ec")).not.toBeInTheDocument();

        expect(screen.queryByTestId("operator-section")).toBeInTheDocument();

        const showPasswordButton = screen.getByTestId('show-pwd-validation-test') as HTMLInputElement;

        expect(screen.getByText('XXXXXXXXXXXXXX')).toBeInTheDocument();
        expect(screen.queryByText(mockStation.password!)).toBeNull();

        fireEvent.click(showPasswordButton);
        await waitFor(() => {
            expect(screen.getByText(mockStation.password!)).toBeInTheDocument();
        });
    });
});
