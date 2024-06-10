import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import React from 'react';
import CommissionBundleDetailPage from '../CommissionBundleDetailPage';
import * as BundleService from '../../../../services/bundleService';
import {
    mockedCommissionBundleCiDetailPublic,
    mockedCommissionBundlePspDetailGlobal,
    mockedCommissionBundlePspDetailPrivate,
    mockedCommissionBundlePspDetailPublic,
} from '../../../../services/__mocks__/bundleService';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {Provider} from 'react-redux';
import {useAppDispatch} from '../../../../redux/hooks';
import {bundleDetailsActions} from '../../../../redux/slices/bundleDetailsSlice';
import * as usePermissions from '../../../../hooks/usePermissions';
import * as useUserRole from '../../../../hooks/useUserRole';
import * as useOrganizationType from '../../../../hooks/useOrganizationType';
import {ROLE} from "../../../../model/RolePermission";
import {BundleResource} from '../../../../model/CommissionBundle';
import {CiBundleStatusEnum} from '../../../../api/generated/portal/CIBundleResource';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);
jest.mock('../../../../hooks/usePermissions');
jest.mock('../../../../hooks/useUserRole');
jest.mock('../../../../hooks/useOrganizationType');

const deleteMock = jest.spyOn(BundleService, 'deletePSPBundle');
const deleteCISubscription = jest.spyOn(BundleService, "deleteCIBundleSubscription");
const deleteCIRequest = jest.spyOn(BundleService, "deleteCIBundleRequest");

const idBundle = 'idBundle';

const ComponentToRender = ({bundle}: { bundle: BundleResource }) => {
    const dispatcher = useAppDispatch();
    dispatcher(bundleDetailsActions.setBundleDetailsState(bundle));

    return (
        <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
            <Route path="/comm-bundles/:bundleId/">
                <CommissionBundleDetailPage/>
            </Route>
        </MemoryRouter>
    );
};


describe('<CommissionBundleDetailPage /> for PSP', () => {
    beforeEach(() => {
        jest.spyOn(usePermissions, 'usePermissions').mockReturnValue({
            userHasPermission: (_) => true,
        });
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PAGOPA_OPERATOR,
            userIsPspAdmin: true,
            userIsEcAdmin: true,
            userIsPspDirectAdmin: true,
            userIsPagopaOperator: true,
            userIsAdmin: true,
        });
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                isSigned: true,
                types: {
                    isEc: false,
                    isPsp: true,
                    isEcBroker: false,
                    isPspBroker: false,
                }
            },

            orgIsPspDirect: true,
            orgIsEcDirect: false,
            orgIsBrokerSigned: false,

            orgIsPspSigned: true,
            orgIsPspBrokerSigned: false,
            orgIsEcSigned: false,
            orgIsEcBrokerSigned: false,
        });
    });

    test('render component CommissionBundleDetailPage bundle type GLOBAl', async () => {
        deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));

        render(
            <Provider store={store}>
                <ComponentToRender bundle={mockedCommissionBundlePspDetailGlobal}/>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
            expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
            expect(screen.queryByTestId('subscription-table')).not.toBeInTheDocument();

            expect(screen.queryByTestId('delete-button')).toBeInTheDocument();
            expect(screen.queryByTestId('modify-button')).toBeInTheDocument();
            expect(screen.queryByTestId('reject-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('activate-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('deactivate-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('delete-request-button')).not.toBeInTheDocument();
        });

        const deleteButton = screen.getByTestId('delete-button');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
        });

        const cancelDeleteButton = screen.getByTestId('cancel-button-test');
        fireEvent.click(cancelDeleteButton);

        await waitFor(() => {
            expect(screen.queryByTestId('fade-test')).not.toBeInTheDocument();
        });

        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
        });

        const confirmDeleteButton = screen.getByTestId('confirm-button-test');
        fireEvent.click(confirmDeleteButton);
        expect(deleteMock).toBeCalledTimes(1);
    });

    test('render component CommissionBundleDetailPage bundle type PRIVATE', async () => {
        deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));

        render(
            <Provider store={store}>
                <ComponentToRender bundle={mockedCommissionBundlePspDetailPrivate}/>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
            expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
            expect(screen.queryByTestId('subscription-table')).not.toBeInTheDocument();

            expect(screen.queryByTestId('delete-button')).toBeInTheDocument();
            expect(screen.queryByTestId('modify-button')).toBeInTheDocument();
            expect(screen.queryByTestId('reject-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('activate-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('deactivate-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('delete-request-button')).not.toBeInTheDocument();
        });
    });

    test('render component CommissionBundleDetailPage bundle type PUBLIC', async () => {
        deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));

        render(
            <Provider store={store}>
                <ComponentToRender bundle={mockedCommissionBundlePspDetailPublic}/>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
            expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
            expect(screen.queryByTestId('subscription-table')).toBeInTheDocument();

            expect(screen.queryByTestId('delete-button')).toBeInTheDocument();
            expect(screen.queryByTestId('modify-button')).toBeInTheDocument();
            expect(screen.queryByTestId('reject-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('activate-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('deactivate-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('delete-request-button')).not.toBeInTheDocument();
        });
    });
});

describe('<CommissionBundleDetailPage /> for EC', () => {
    beforeEach(() => {
        jest.spyOn(usePermissions, 'usePermissions').mockReturnValue({
            userHasPermission: (_) => true,
        });
        jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
            orgInfo: {
                isSigned: true,
                types: {
                    isEc: true,
                    isPsp: false,
                    isEcBroker: false,
                    isPspBroker: false,
                }
            },

            orgIsPspDirect: false,
            orgIsEcDirect: true,
            orgIsBrokerSigned: false,

            orgIsPspSigned: false,
            orgIsPspBrokerSigned: false,
            orgIsEcSigned: true,
            orgIsEcBrokerSigned: false,
        });
    });
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
        userRole: ROLE.PAGOPA_OPERATOR,
        userIsPspAdmin: false,
        userIsEcAdmin: false,
        userIsPspDirectAdmin: false,
        userIsPagopaOperator: true,
        userIsAdmin: true,
    });

    describe("Bundle GLOBAL", () => {
        test('render component CommissionBundleDetailPage bundle type GLOBAl', async () => {
            deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));
            jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
                userRole: ROLE.PAGOPA_OPERATOR,
                userIsPspAdmin: false,
                userIsEcAdmin: false,
                userIsPspDirectAdmin: false,
                userIsPagopaOperator: true,
                userIsAdmin: true,
            });

            render(
                <Provider store={store}>
                    <ComponentToRender bundle={mockedCommissionBundlePspDetailPublic}/>
                </Provider>
            );

            await waitFor(() => {
                expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
                expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
                expect(screen.queryByTestId('subscription-table')).not.toBeInTheDocument();
                expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('modify-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('reject-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('activate-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('deactivate-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('delete-request-button')).not.toBeInTheDocument();
            });
        });
    })


    describe("Bundle PUBLIC", () => {
        test('With bundle in state AVAILABLE', async () => {
            let bundle = {...mockedCommissionBundleCiDetailPublic};
            bundle.ciBundleStatus = CiBundleStatusEnum.AVAILABLE;
            jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
                userRole: ROLE.PAGOPA_OPERATOR,
                userIsPspAdmin: false,
                userIsEcAdmin: false,
                userIsPspDirectAdmin: false,
                userIsPagopaOperator: true,
                userIsAdmin: true,
            });
            render(
                <Provider store={store}>
                    <ComponentToRender bundle={bundle}/>
                </Provider>
            );

            await waitFor(() => {
                expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
                expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
                expect(screen.queryByTestId('subscription-table')).not.toBeInTheDocument();
                expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('modify-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('reject-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('activate-button')).toBeInTheDocument();
                expect(screen.queryByTestId('deactivate-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('delete-request-button')).not.toBeInTheDocument();
            });
        });
        test('With bundle in state ENABLED', async () => {
            let bundle = {...mockedCommissionBundleCiDetailPublic};
            bundle.ciBundleStatus = CiBundleStatusEnum.ENABLED;
            deleteCISubscription.mockReturnValueOnce(new Promise((resolve) => resolve()));
            jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
                userRole: ROLE.PAGOPA_OPERATOR,
                userIsPspAdmin: false,
                userIsEcAdmin: false,
                userIsPspDirectAdmin: false,
                userIsPagopaOperator: true,
                userIsAdmin: true,
            });
            render(
                <Provider store={store}>
                    <ComponentToRender bundle={bundle}/>
                </Provider>
            );

            await waitFor(() => {
                expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
                expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
                expect(screen.queryByTestId('subscription-table')).not.toBeInTheDocument();
                expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('modify-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('reject-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('activate-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('deactivate-button')).toBeInTheDocument();
                expect(screen.queryByTestId('delete-request-button')).not.toBeInTheDocument();
            });

            fireEvent.click(screen.getByTestId('deactivate-button'));

            await waitFor(() => {
                expect(screen.queryByTestId("fade-test")).toBeInTheDocument();
            })

            fireEvent.click(screen.getByTestId('confirm-button-test'));

            expect(deleteCISubscription).toBeCalled();
        });
        test('With bundle in state REQUESTED', async () => {
            let bundle = {...mockedCommissionBundleCiDetailPublic};
            bundle.ciBundleStatus = CiBundleStatusEnum.REQUESTED;
            deleteCIRequest.mockReturnValueOnce(new Promise((resolve) => resolve()));
            jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
                userRole: ROLE.PAGOPA_OPERATOR,
                userIsPspAdmin: false,
                userIsEcAdmin: false,
                userIsPspDirectAdmin: false,
                userIsPagopaOperator: true,
                userIsAdmin: true,
            });
            render(
                <Provider store={store}>
                    <ComponentToRender bundle={bundle}/>
                </Provider>
            );

            await waitFor(() => {
                expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
                expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
                expect(screen.queryByTestId('subscription-table')).not.toBeInTheDocument();
                expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('modify-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('reject-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('activate-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('deactivate-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('delete-request-button')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByTestId('delete-request-button'));

            await waitFor(() => {
                expect(screen.queryByTestId("fade-test")).toBeInTheDocument();
            })

            fireEvent.click(screen.getByTestId('confirm-button-test'));

            expect(deleteCIRequest).toBeCalled();
        });
        test('With bundle in state ON_REMOVAL', async () => {
            let bundle = {...mockedCommissionBundleCiDetailPublic};
            bundle.ciBundleStatus = CiBundleStatusEnum.ON_REMOVAL;
            deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));
            jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
                userRole: ROLE.PAGOPA_OPERATOR,
                userIsPspAdmin: false,
                userIsEcAdmin: false,
                userIsPspDirectAdmin: false,
                userIsPagopaOperator: true,
                userIsAdmin: true,
            });
            render(
                <Provider store={store}>
                    <ComponentToRender bundle={bundle}/>
                </Provider>
            );

            await waitFor(() => {
                expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
                expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
                expect(screen.queryByTestId('subscription-table')).not.toBeInTheDocument();
                expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('modify-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('reject-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('activate-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('deactivate-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('delete-request-button')).not.toBeInTheDocument();
            });
        });
    })


    // describe("Bundle PRIVATE", () => {
    //     test('render component CommissionBundleDetailPage bundle type PRIVATE', async () => {
    //         deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));
    //         jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
    //             userRole: ROLE.PAGOPA_OPERATOR,
    //             userIsPspAdmin: false,
    //             userIsEcAdmin: false,
    //             userIsPspDirectAdmin: false,
    //             userIsPagopaOperator: true,
    //             userIsAdmin: true,
    //         });
    //         render(
    //             <Provider store={store}>
    //                 <ComponentToRender bundle={mockedCommissionBundleCiDetailPrivate}/>
    //             </Provider>
    //         );

    //         await waitFor(() => {
    //             expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
    //             expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
    //             expect(screen.queryByTestId('subscription-table')).not.toBeInTheDocument();
    //             expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
    //             expect(screen.queryByTestId('modify-button')).not.toBeInTheDocument();
    //             expect(screen.queryByTestId('reject-button')).not.toBeInTheDocument();
    //             expect(screen.queryByTestId('activate-button')).not.toBeInTheDocument();
    //             expect(screen.queryByTestId('deactivate-button')).not.toBeInTheDocument();
    //             expect(screen.queryByTestId('delete-request-button')).not.toBeInTheDocument();
    //         });
    //     });
    // })
});
