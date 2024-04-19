import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { mockedCiSubscriptionIntersectDetail } from '../../../../../../services/__mocks__/bundleService';
import { CommissionBundleSubscriptionsDrawer } from '../CommissionBundleSubscriptionsDrawer';
import { SubscriptionStateType } from '../../../../../../model/CommissionBundle';

const spySetModal = jest.fn();
// TODO USE MOCKED RESPONSE OBJ FROM SUBSCRIPTION API TO MOCK DRAWER VALURE

describe('<CommissionBundleSubscriptionsDrawer />', () => {
  test('render component CommissionBundleSubscriptionsDrawer open for request waiting for acceptance, with bundle fee list', async () => {
    render(
      <CommissionBundleSubscriptionsDrawer
        t={jest.fn()}
        setSelectedSubscriptionRequest={jest.fn()}
        selectedSubscriptionRequest={mockedCiSubscriptionIntersectDetail}
        setOpenMenageSubscriptionModal={spySetModal}
        stateType={SubscriptionStateType.Waiting}
      />
    );

    expect(screen.queryByTestId('skeleton-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bundle-fee-list')).toBeInTheDocument();

    expect(screen.queryByTestId('subscription-delete-button')).not.toBeInTheDocument();
    const acceptButton = screen.getByTestId('subscription-accept-button');
    const rejectButton = screen.getByTestId('subscription-reject-button');

    fireEvent.click(acceptButton);
    expect(spySetModal).toBeCalledWith('accept');

    fireEvent.click(rejectButton);
    expect(spySetModal).toBeCalledWith('reject');
  });

  test('render component CommissionBundleSubscriptionsDrawer open for request already accepted, with skeleton', async () => {
    render(
      <CommissionBundleSubscriptionsDrawer
        t={jest.fn()}
        setSelectedSubscriptionRequest={jest.fn()}
        selectedSubscriptionRequest={{
          ...mockedCiSubscriptionIntersectDetail,
          bundle_request_id: undefined,
        }}
        setOpenMenageSubscriptionModal={spySetModal}
        stateType={SubscriptionStateType.Accepted}
      />
    );

    expect(screen.queryByTestId('skeleton-component')).toBeInTheDocument();
    expect(screen.queryByTestId('bundle-fee-list')).not.toBeInTheDocument();

    expect(screen.queryByTestId('subscription-accept-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('subscription-reject-button')).not.toBeInTheDocument();
    const deleteButton = screen.getByTestId('subscription-delete-button');

    fireEvent.click(deleteButton);
    expect(spySetModal).toBeCalledWith('delete');
  });

  test('render component CommissionBundleSubscriptionsDrawer without bundle fee list & skeleton', async () => {
    render(
      <CommissionBundleSubscriptionsDrawer
        t={jest.fn()}
        setSelectedSubscriptionRequest={jest.fn()}
        selectedSubscriptionRequest={{
          ...mockedCiSubscriptionIntersectDetail,
          ci_bundle_fee_list: [],
        }}
        setOpenMenageSubscriptionModal={spySetModal}
        stateType={SubscriptionStateType.Accepted}
      />
    );

    expect(screen.queryByTestId('skeleton-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bundle-fee-list')).not.toBeInTheDocument();

    expect(screen.queryByTestId('subscription-accept-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('subscription-reject-button')).not.toBeInTheDocument();
    const deleteButton = screen.getByTestId('subscription-delete-button');

    fireEvent.click(deleteButton);
    expect(spySetModal).toBeCalledWith('delete');
  });
});
