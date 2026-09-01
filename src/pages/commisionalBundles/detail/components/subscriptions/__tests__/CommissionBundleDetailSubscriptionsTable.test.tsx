import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import CommissionBundleDetailSubscriptionsTable from '../CommissionBundleDetailSubscriptionsTable';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../../../redux/store';
import {
    mockedCiSubscriptionDetail,
    mockedCiSubscriptionList,
    mockedCommissionBundlePspDetailPrivate,
    mockedCommissionBundlePspDetailPublic,
} from '../../../../../../services/__mocks__/bundleService';
import * as bundleService from '../../../../../../services/bundleService';
import {SubscriptionStateType} from '../../../../../../model/CommissionBundle';

let spyOnGetBundleCISubscriptions: jest.SpyInstance;
let spyOnGetBundleCISubscriptionsDetail: jest.SpyInstance;
let spyOnRejectSubcriptionRequest: jest.SpyInstance;
let spyOnAcceptSubcriptionRequest: jest.SpyInstance;
let spyOnDeleteSubscription: jest.SpyInstance;
let spyOnDeleteOffer: jest.SpyInstance;

// jsdom reports 0-sized layout boxes; @mui/x-data-grid uses real
// measurements to decide how many rows fit, so without this the grid
// renders no rows in tests even though the data is there.
const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;

beforeEach(() => {
    HTMLElement.prototype.getBoundingClientRect = () =>
        ({
            width: 1000,
            height: 1000,
            top: 0,
            left: 0,
            right: 1000,
            bottom: 1000,
            x: 0,
            y: 0,
            toJSON() {
                return this;
            },
        }) as DOMRect;
    spyOnGetBundleCISubscriptions = jest.spyOn(
        bundleService,
        'getBundleCISubscriptions'
    );
    spyOnGetBundleCISubscriptionsDetail = jest.spyOn(
        bundleService,
        'getBundleCISubscriptionsDetail'
    );
    spyOnRejectSubcriptionRequest = jest.spyOn(bundleService, 'rejectPublicBundleSubscription');
    spyOnAcceptSubcriptionRequest = jest.spyOn(bundleService, 'acceptBundleSubscriptionRequest');
    spyOnDeleteSubscription = jest.spyOn(bundleService, 'deleteCIBundleSubscription');
    spyOnDeleteOffer = jest.spyOn(bundleService, "deletePrivateBundleOffer");
});

const generalPath = "commissionBundlesPage.commissionBundleDetail.subscriptionsTable"
const componentPath = `${generalPath}.requestsTable`;

const idBundle = 'idBundle';
describe('<CommissionBundleDetailSubscriptionsTable />', () => {
    beforeEach(() => {
        spyOnGetBundleCISubscriptions = jest.spyOn(
            bundleService,
            'getBundleCISubscriptions'
        );
        spyOnGetBundleCISubscriptionsDetail = jest.spyOn(
            bundleService,
            'getBundleCISubscriptionsDetail'
        );
        spyOnRejectSubcriptionRequest = jest.spyOn(bundleService, 'rejectPublicBundleSubscription');
        spyOnAcceptSubcriptionRequest = jest.spyOn(bundleService, 'acceptBundleSubscriptionRequest');
        spyOnDeleteSubscription = jest.spyOn(bundleService, 'deleteCIBundleSubscription');
        spyOnDeleteOffer = jest.spyOn(bundleService, "deletePrivateBundleOffer");
    });

    afterEach(() => {
        jest.clearAllMocks();
        HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test empty table, change state filter & render datagrid', async () => {
        spyOnGetBundleCISubscriptions.mockReturnValueOnce(Promise.resolve([]));
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

        expect(spyOnGetBundleCISubscriptions).toBeCalledTimes(1);
        expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();

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

        spyOnGetBundleCISubscriptions.mockReturnValueOnce(
            Promise.resolve(mockedCiSubscriptionList)
        );

        const searchButton = screen.getByTestId('button-search');
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(spyOnGetBundleCISubscriptions).toBeCalledTimes(2);
            expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
            expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
        });
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test error retrieving request detail', async () => {
        spyOnGetBundleCISubscriptions.mockReturnValue(Promise.resolve(mockedCiSubscriptionList));
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

        spyOnGetBundleCISubscriptionsDetail.mockRejectedValueOnce('');
        let subscriptionDetailButton: HTMLElement;
        await waitFor(() => {
            subscriptionDetailButton = screen.getByTestId('request-detail-button');
        });
        fireEvent.click(subscriptionDetailButton);

        await waitFor(() => {
            expect(spyOnGetBundleCISubscriptionsDetail).toBeCalledTimes(1);
            expect(screen.queryByTestId('request-accept-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('subscription-delete-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('request-reject-button')).not.toBeInTheDocument();
        });
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test delete accepted subscriptions', async () => {
        spyOnGetBundleCISubscriptions.mockReturnValue(Promise.resolve(mockedCiSubscriptionList));
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

        spyOnGetBundleCISubscriptionsDetail.mockReturnValue(
            Promise.resolve(mockedCiSubscriptionDetail)
        );
        let subscriptionDetailButton: HTMLElement;
        await waitFor(() => {
            subscriptionDetailButton = screen.getByTestId('request-detail-button');
        });
        fireEvent.click(subscriptionDetailButton);

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
            expect(spyOnGetBundleCISubscriptions).toBeCalledTimes(3);
        });

        expect(screen.getByTestId('success-alert')).toBeInTheDocument();
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test reject waiting requests', async () => {
        spyOnGetBundleCISubscriptions.mockReturnValue(Promise.resolve(mockedCiSubscriptionList));
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

        spyOnGetBundleCISubscriptionsDetail.mockReturnValue(
            Promise.resolve(mockedCiSubscriptionDetail)
        );
        let subscriptionDetailButton: HTMLElement;
        await waitFor(() => {
            subscriptionDetailButton = screen.getByTestId('request-detail-button');
        });
        fireEvent.click(subscriptionDetailButton);

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
            expect(spyOnGetBundleCISubscriptions).toBeCalledTimes(2);
        });

        expect(screen.getByTestId('success-alert')).toBeInTheDocument();
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test accept waiting requests', async () => {
        spyOnGetBundleCISubscriptions.mockReturnValue(Promise.resolve(mockedCiSubscriptionList));
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

        spyOnGetBundleCISubscriptionsDetail.mockReturnValue(
            Promise.resolve(mockedCiSubscriptionDetail)
        );
        let subscriptionDetailButton: HTMLElement;
        await waitFor(() => {
            subscriptionDetailButton = screen.getByTestId('request-detail-button');
        });
        fireEvent.click(subscriptionDetailButton);

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
            expect(spyOnGetBundleCISubscriptions).toBeCalledTimes(2);
        });

        expect(screen.getByTestId('success-alert')).toBeInTheDocument();
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test reject offers', async () => {
        spyOnGetBundleCISubscriptions.mockReturnValue(Promise.resolve(mockedCiSubscriptionList));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
                    <Route path="/comm-bundles/:bundleId/">
                        <CommissionBundleDetailSubscriptionsTable
                            bundleDetail={mockedCommissionBundlePspDetailPrivate}
                        />
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        spyOnGetBundleCISubscriptionsDetail.mockReturnValue(
            Promise.resolve(mockedCiSubscriptionDetail)
        );
        let subscriptionDetailButton: HTMLElement;
        await waitFor(() => {
            subscriptionDetailButton = screen.getByTestId('request-detail-button');
        });
        fireEvent.click(subscriptionDetailButton);

        let deleteOfferButton;
        await waitFor(() => {
            deleteOfferButton = screen.getByTestId("offer-delete-button");
            expect(screen.queryByTestId('subscription-delete-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('request-accept-button')).not.toBeInTheDocument();
        });

        fireEvent.click(deleteOfferButton);

        await waitFor(() => {
            expect(screen.getByTestId('fade-test')).toBeInTheDocument();
        });

        const modalConfirmButton = screen.getByTestId('confirm-button-test');
        spyOnDeleteOffer.mockReturnValue(Promise.resolve());
        fireEvent.click(modalConfirmButton);

        await waitFor(() => {
            expect(spyOnDeleteOffer).toBeCalled();
            expect(spyOnGetBundleCISubscriptions).toBeCalledTimes(2);
        });

        expect(screen.getByTestId('success-alert')).toBeInTheDocument();
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test error action on waiting requests', async () => {
        spyOnGetBundleCISubscriptions.mockReturnValue(Promise.resolve(mockedCiSubscriptionList));
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

        spyOnGetBundleCISubscriptionsDetail.mockReturnValue(
            Promise.resolve(mockedCiSubscriptionDetail)
        );
        let subscriptionDetailButton: HTMLElement;
        await waitFor(() => {
            subscriptionDetailButton = screen.getByTestId('request-detail-button');
        });
        fireEvent.click(subscriptionDetailButton);

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
            expect(spyOnGetBundleCISubscriptions).toBeCalledTimes(1);
        });

        expect(screen.queryByTestId('success-alert')).not.toBeInTheDocument();
    });

    test('render component CommissionBundleDetailSubscriptionsTable and test error on retrieve subscription list', async () => {
        spyOnGetBundleCISubscriptions.mockRejectedValue('error');
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
            expect(spyOnGetBundleCISubscriptions).toBeCalledTimes(1);
            expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
        });
    });
});
