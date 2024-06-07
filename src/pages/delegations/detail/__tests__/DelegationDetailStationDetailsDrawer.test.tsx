import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {mockedInstitutionStation} from '../../../../services/__mocks__/brokerService';
import {DelegationStationDetailsDrawer} from '../DelegationStationDetailsDrawer';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

const mockTFunction = (key: string) => {
    switch (key) {
        case 'delegationDetailPage.stationDetail.title':
            return 'Station Details';
        case 'delegationDetailPage.stationDetail.registry':
            return 'Registry';
        case 'delegationDetailPage.stationDetail.stationCode':
            return 'Station code';
        case 'delegationDetailPage.stationDetail.activationDate':
            return 'Activation date';
        case 'delegationDetailPage.stationDetail.auxDigit':
            return 'AuxDigit';
        case 'delegationDetailPage.stationDetail.segregationCode':
            return 'Segregate code';
        case 'delegationDetailPage.stationDetail.applicationCode':
            return 'Application code';
        case 'delegationDetailPage.stationDetail.goToStationDetails':
            return 'Station detail link';
        case 'delegationDetailPage.stationDetail.references':
            return 'References';
        case 'delegationDetailPage.stationDetail.status.label':
            return 'Status';
        case 'delegationDetailPage.stationDetail.status.active':
            return 'Active';
        case 'delegationDetailPage.stationDetail.status.inactive':
            return 'Inactive';
        default:
            return '';
    }
};
const setDrawerValueSpy = jest.fn();
const setShowDisassociateStationModalSpy = jest.fn();

describe('<DelegationStationDetailsDrawer />', () => {
    test('render component Drawer with station details', async () => {
        setDrawerValueSpy.mockImplementation(() => {
            return mockedInstitutionStation[0];
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/delegations-list/detail`]}>
                    <Route path="/delegations-list/detail">
                        <ThemeProvider theme={theme}>
                            <DelegationStationDetailsDrawer
                                drawerValue={mockedInstitutionStation[0]}
                                t={mockTFunction}
                                setDrawerValue={setDrawerValueSpy}
                                setShowDisassociateStationModal={setShowDisassociateStationModalSpy}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('station-detail-drawer-column')).toBeInTheDocument();
            expect(setShowDisassociateStationModalSpy).not.toBeCalled();
        });
    });

    test('render component Drawer with station details and click on go to station detail button', async () => {
        setDrawerValueSpy.mockImplementation(() => {
            return mockedInstitutionStation[0];
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/delegations-list/detail`]}>
                    <Route path="/delegations-list/detail">
                        <ThemeProvider theme={theme}>
                            <DelegationStationDetailsDrawer
                                drawerValue={mockedInstitutionStation[0]}
                                t={mockTFunction}
                                setDrawerValue={setDrawerValueSpy}
                                setShowDisassociateStationModal={setShowDisassociateStationModalSpy}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const goToStationDetailButton = screen.getByTestId(
            'go-to-station-details-test'
        ) as HTMLInputElement;
        fireEvent.click(goToStationDetailButton);

        await waitFor(() => {
            expect(screen.queryByTestId('station-detail-drawer-column')).not.toBeInTheDocument();
            expect(setShowDisassociateStationModalSpy).not.toBeCalled();
        });
    });

    test('render component Drawer with station details and click on disassociate station', async () => {
        setDrawerValueSpy.mockImplementation(() => {
            return mockedInstitutionStation[0];
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/delegations-list/detail`]}>
                    <Route path="/delegations-list/detail">
                        <ThemeProvider theme={theme}>
                            <DelegationStationDetailsDrawer
                                drawerValue={mockedInstitutionStation[0]}
                                t={mockTFunction}
                                setDrawerValue={setDrawerValueSpy}
                                setShowDisassociateStationModal={setShowDisassociateStationModalSpy}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const disassociateStation = screen.getByTestId(
            'station-detail-disassociate-station-button'
        ) as HTMLInputElement;
        fireEvent.click(disassociateStation);

        await waitFor(() => {
            expect(screen.queryByTestId('station-detail-drawer-column')).toBeInTheDocument();
            expect(setShowDisassociateStationModalSpy).toBeCalled();
        });
    });
});
