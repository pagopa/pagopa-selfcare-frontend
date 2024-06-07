import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {Provider} from 'react-redux';
import React from 'react';
import CommissionBundlesTable from '../CommissionBundlesTable';
import * as BundleService from '../../../../services/bundleService';
import * as useOrganizationType from '../../../../hooks/useOrganizationType';
import {mockedCommissionBundlePspList} from '../../../../services/__mocks__/bundleService';

let getCommissionBundlePspSpy: jest.SpyInstance;

jest.mock('../../../../hooks/useOrganizationType');

beforeEach(() => {
    jest
        .spyOn(require('../../../../hooks/usePermissions'), 'usePermissions')
        .mockReturnValue({isPsp: () => true, isEc: () => true});
    getCommissionBundlePspSpy = jest.spyOn(
        require('../../../../services/__mocks__/bundleService'),
        'getCommissionBundlePsp'
    );
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

const mock = jest.spyOn(BundleService, 'getBundleListByPSP');
const mockEC = jest.spyOn(BundleService, 'getCisBundles');

afterEach(cleanup);

describe('<CommissionBundlesTable />', () => {
    test('render component CommissionBundlesTable with bundle list for PSP', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                isSigned: true,
                types: {
                    isPsp: true,
                    isPspBroker: true,
                    isEc: false,
                    isEcBroker: false,
                },
            },
            orgIsBrokerSigned: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false,
        });

        mock.mockReturnValueOnce(new Promise((resolve) => resolve(mockedCommissionBundlePspList)));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/comm-bundles`]}>
                    <Route path="/comm-bundles">
                        <ThemeProvider theme={theme}>
                            <CommissionBundlesTable
                                bundleNameFilter={''}
                                bundleType={'commissionBundlesPage.privateBundles'}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
            expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
        });
    });

    test('render component CommissionBundlesTable with bundle list for EC', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                isSigned: true,
                types: {
                    isPsp: false,
                    isPspBroker: false,
                    isEc: true,
                    isEcBroker: true,
                },
            },
            orgIsBrokerSigned: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false,
        });

        mockEC.mockReturnValueOnce(new Promise((resolve) => resolve(mockedCommissionBundlePspList)));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/comm-bundles`]}>
                    <Route path="/comm-bundles">
                        <ThemeProvider theme={theme}>
                            <CommissionBundlesTable
                                bundleNameFilter={''}
                                bundleType={'commissionBundlesPage.publicBundles'}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
            expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
        });
    });

    test('render component CommissionBundlesTable without bundle list', async () => {
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                isSigned: true,
                types: {
                    isPsp: true,
                    isPspBroker: true,
                    isEc: false,
                    isEcBroker: false,
                },
            },
            orgIsBrokerSigned: false,
            orgIsEcBrokerSigned: false,
            orgIsEcDirect: false,
            orgIsEcSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsPspDirect: false,
            orgIsPspSigned: false,
        });
        mock.mockRejectedValueOnce("");
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/comm-bundles`]}>
                    <Route path="/comm-bundles">
                        <ThemeProvider theme={theme}>
                            <CommissionBundlesTable
                                bundleNameFilter={''}
                                bundleType={'commissionBundlesPage.globalBundles'}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('data-grid')).not.toBeInTheDocument();
            expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
        });
    });
});
