import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import CommissionBundleDetailSubscriptionsTable from '../CommissionBundleDetailSubscriptionsTable';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../../../redux/store';
import {
    mockedCiSubscriptionDetail,
    mockedCiSubscriptionList,
    mockedCommissionBundlePspDetailPublic,
} from '../../../../../../services/__mocks__/bundleService';
import * as bundleService from '../../../../../../services/bundleService';
import {SubscriptionStateType} from '../../../../../../model/CommissionBundle';

const spyOnGetPublicBundleCISubscriptions = jest.spyOn(
    bundleService,
    'getBundleCISubscriptions'
);
const spyOnGetPublicBundleCISubscriptionsDetail = jest.spyOn(
    bundleService,
    'getBundleCISubscriptionsDetail'
);
const spyOnRejectSubcriptionRequest = jest.spyOn(bundleService, 'rejectPublicBundleSubscription');
const spyOnAcceptSubcriptionRequest = jest.spyOn(bundleService, 'acceptBundleSubscriptionRequest');
const spyOnDeleteSubscription = jest.spyOn(bundleService, 'deleteCIBundleSubscription');

const generalPath = "commissionBundlesPage.commissionBundleDetail.subscriptionsTable"
const componentPath = `${generalPath}.requestsTable`;

const idBundle = 'idBundle';
describe('<CommissionBundleDetailSubscriptionsTable />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test empty table, change state filter & render datagrid', async () => {
        spyOnGetPublicBundleCISubscriptions.mockReturnValueOnce(Promise.resolve([]));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
                    <Route path="/comm-bundles/:bundleId/">
                        <CommissionBundleDetailSubscriptionsTable
                            bundleDetail={mockedCommissionBundlePspDetailPublic}
                        />
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const selectSubscriptionStateFilter = screen.getByTestId(
            'subscription-state'
        ) as HTMLInputElement;
        const selectSubscriptionStateFilterBtn = screen.getByLabelText(`${generalPath}.state`);
        expect(selectSubscriptionStateFilter).toHaveTextContent(
            `${componentPath}.stateChip.${SubscriptionStateType.Waiting}`
        );

        expect(spyOnGetPublicBundleCISubscriptions).toBeCalledTimes(1);
        expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
        expect(screen.queryByTestId('data-grid')).not.toBeInTheDocument();

        await waitFor(() => {
            fireEvent.mouseDown(selectSubscriptionStateFilterBtn);
            fireEvent.click(
                screen.getByText(
                    new RegExp(`${componentPath}.stateChip.${SubscriptionStateType.Accepted}`, 'i')
                )
            );
        });
        expect(selectSubscriptionStateFilterBtn.textContent).toBe(
            `${componentPath}.stateChip.${SubscriptionStateType.Accepted}`
        );

        spyOnGetPublicBundleCISubscriptions.mockReturnValueOnce(
            Promise.resolve(mockedCiSubscriptionList)
        );

        const searchButton = screen.getByTestId('button-search');
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(spyOnGetPublicBundleCISubscriptions).toBeCalledTimes(2);
        });

        expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
        expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test error retrieving request detail', async () => {
        spyOnGetPublicBundleCISubscriptions.mockReturnValue(Promise.resolve(mockedCiSubscriptionList));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
                    <Route path="/comm-bundles/:bundleId/">
                        <CommissionBundleDetailSubscriptionsTable
                            bundleDetail={mockedCommissionBundlePspDetailPublic}
                        />
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
            expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
        });

        spyOnGetPublicBundleCISubscriptionsDetail.mockRejectedValueOnce('');
        const subscriptionDetailButton = screen.getByTestId('request-detail-button');
        fireEvent.click(subscriptionDetailButton);

        await act(async () => {
            await waitFor(() => {
                expect(screen.queryByTestId('request-accept-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('subscription-delete-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('request-reject-button')).not.toBeInTheDocument();
            });
        });
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test delete accepted subscriptions', async () => {
        spyOnGetPublicBundleCISubscriptions.mockReturnValue(Promise.resolve(mockedCiSubscriptionList));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
                    <Route path="/comm-bundles/:bundleId/">
                        <CommissionBundleDetailSubscriptionsTable
                            bundleDetail={mockedCommissionBundlePspDetailPublic}
                        />
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const selectSubscriptionStateFilterBtn = screen.getByLabelText(`${generalPath}.state`);
        await waitFor(() => {
            fireEvent.mouseDown(selectSubscriptionStateFilterBtn);
            fireEvent.click(
                screen.getByText(
                    new RegExp(`${componentPath}.stateChip.${SubscriptionStateType.Accepted}`, 'i')
                )
            );
        });
        expect(selectSubscriptionStateFilterBtn.textContent).toBe(
            `${componentPath}.stateChip.${SubscriptionStateType.Accepted}`
        );

        const searchButton = screen.getByTestId('button-search');
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(spyOnGetPublicBundleCISubscriptions).toBeCalledTimes(2);
        });

        expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
        expect(screen.queryByTestId('data-grid')).toBeInTheDocument();

        spyOnGetPublicBundleCISubscriptionsDetail.mockReturnValue(
            Promise.resolve(mockedCiSubscriptionDetail)
        );
        const subscriptionDetailButton = screen.getByTestId('request-detail-button');
        fireEvent.click(subscriptionDetailButton);

        await act(async () => {
            let deleteButton;
            await waitFor(() => {
                deleteButton = screen.getByTestId('subscription-delete-button');
                expect(screen.queryByTestId('request-reject-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('request-accept-button')).not.toBeInTheDocument();
            });

            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(screen.getByTestId('fade-test')).toBeInTheDocument();
            });

            const modalConfirmButton = screen.getByTestId('confirm-button-test');
            spyOnDeleteSubscription.mockReturnValue(Promise.resolve());
            fireEvent.click(modalConfirmButton);

            await waitFor(() => {
                expect(spyOnDeleteSubscription).toBeCalled();
                expect(spyOnGetPublicBundleCISubscriptions).toBeCalledTimes(3);
            });

            expect(screen.getByTestId('success-alert')).toBeInTheDocument();
        });
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test reject waiting requests', async () => {
        spyOnGetPublicBundleCISubscriptions.mockReturnValue(Promise.resolve(mockedCiSubscriptionList));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
                    <Route path="/comm-bundles/:bundleId/">
                        <CommissionBundleDetailSubscriptionsTable
                            bundleDetail={mockedCommissionBundlePspDetailPublic}
                        />
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
            expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
        });

        spyOnGetPublicBundleCISubscriptionsDetail.mockReturnValue(
            Promise.resolve(mockedCiSubscriptionDetail)
        );
        const subscriptionDetailButton = screen.getByTestId('request-detail-button');
        fireEvent.click(subscriptionDetailButton);

        await act(async () => {
            let rejectButton;
            await waitFor(() => {
                rejectButton = screen.getByTestId('request-reject-button');
                expect(screen.queryByTestId('subscription-delete-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('request-accept-button')).toBeInTheDocument();
            });

            fireEvent.click(rejectButton);

            await waitFor(() => {
                expect(screen.getByTestId('fade-test')).toBeInTheDocument();
            });

            const modalConfirmButton = screen.getByTestId('confirm-button-test');
            spyOnRejectSubcriptionRequest.mockReturnValue(Promise.resolve());
            fireEvent.click(modalConfirmButton);

            await waitFor(() => {
                expect(spyOnRejectSubcriptionRequest).toBeCalled();
                expect(spyOnGetPublicBundleCISubscriptions).toBeCalledTimes(2);
            });

            expect(screen.getByTestId('success-alert')).toBeInTheDocument();
        });
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test accept waiting requests', async () => {
        spyOnGetPublicBundleCISubscriptions.mockReturnValue(Promise.resolve(mockedCiSubscriptionList));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
                    <Route path="/comm-bundles/:bundleId/">
                        <CommissionBundleDetailSubscriptionsTable
                            bundleDetail={mockedCommissionBundlePspDetailPublic}
                        />
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
            expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
        });

        spyOnGetPublicBundleCISubscriptionsDetail.mockReturnValue(
            Promise.resolve(mockedCiSubscriptionDetail)
        );
        const subscriptionDetailButton = screen.getByTestId('request-detail-button');
        fireEvent.click(subscriptionDetailButton);

        await act(async () => {
            let acceptButton;
            await waitFor(() => {
                acceptButton = screen.getByTestId('request-accept-button');
                expect(screen.queryByTestId('subscription-delete-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('request-reject-button')).toBeInTheDocument();
            });

            fireEvent.click(acceptButton);

            await waitFor(() => {
                expect(screen.getByTestId('fade-test')).toBeInTheDocument();
            });

            const modalConfirmButton = screen.getByTestId('confirm-button-test');
            spyOnAcceptSubcriptionRequest.mockReturnValue(Promise.resolve());
            fireEvent.click(modalConfirmButton);

            await waitFor(() => {
                expect(spyOnAcceptSubcriptionRequest).toBeCalled();
                expect(spyOnGetPublicBundleCISubscriptions).toBeCalledTimes(2);
            });

            expect(screen.getByTestId('success-alert')).toBeInTheDocument();
        });
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test error action on waiting requests', async () => {
        spyOnGetPublicBundleCISubscriptions.mockReturnValue(Promise.resolve(mockedCiSubscriptionList));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
                    <Route path="/comm-bundles/:bundleId/">
                        <CommissionBundleDetailSubscriptionsTable
                            bundleDetail={mockedCommissionBundlePspDetailPublic}
                        />
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
            expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
        });

        spyOnGetPublicBundleCISubscriptionsDetail.mockReturnValue(
            Promise.resolve(mockedCiSubscriptionDetail)
        );
        const subscriptionDetailButton = screen.getByTestId('request-detail-button');
        fireEvent.click(subscriptionDetailButton);

        await act(async () => {
            let acceptButton;
            await waitFor(() => {
                acceptButton = screen.getByTestId('request-accept-button');
                expect(screen.queryByTestId('subscription-delete-button')).not.toBeInTheDocument();
                expect(screen.queryByTestId('request-reject-button')).toBeInTheDocument();
            });

            fireEvent.click(acceptButton);

            await waitFor(() => {
                expect(screen.getByTestId('fade-test')).toBeInTheDocument();
            });

            const modalConfirmButton = screen.getByTestId('confirm-button-test');
            spyOnAcceptSubcriptionRequest.mockRejectedValue('error');
            fireEvent.click(modalConfirmButton);

            await waitFor(() => {
                expect(spyOnAcceptSubcriptionRequest).toBeCalled();
                expect(spyOnGetPublicBundleCISubscriptions).toBeCalledTimes(1);
            });

            expect(screen.queryByTestId('success-alert')).not.toBeInTheDocument();
        });
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test error on retrieve subscription list', async () => {
        spyOnGetPublicBundleCISubscriptions.mockRejectedValue('error');
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
                    <Route path="/comm-bundles/:bundleId/">
                        <CommissionBundleDetailSubscriptionsTable
                            bundleDetail={mockedCommissionBundlePspDetailPublic}
                        />
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        expect(spyOnGetPublicBundleCISubscriptions).toBeCalledTimes(1);
        expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
        expect(screen.queryByTestId('data-grid')).not.toBeInTheDocument();
    });
});
