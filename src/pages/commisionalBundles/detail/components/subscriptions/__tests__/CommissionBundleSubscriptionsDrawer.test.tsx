import { waitFor, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { mockedCommissionBundlePspDetailGlobal } from '../../../../../../services/__mocks__/bundleService';
import { CommissionBundleSubscriptionsDrawer } from '../CommissionBundleSubscriptionsDrawer';
import { SubscriptionStateType } from '../CommissionBundleSubscriptionsTable';
import { createBroker_1Decoder } from '../../../../../../api/generated/portal/requestTypes';

const spySetModal = jest.fn();
// TODO USE MOCKED RESPONSE OBJ FROM SUBSCRIPTION API TO MOCK DRAWER VALURE

describe('<CommissionBundleSubscriptionsDrawer />', () => {
  test('render component CommissionBundleSubscriptionsDrawer open for request waiting for acceptance', async () => {
    render(
      <CommissionBundleSubscriptionsDrawer
        t={jest.fn()}
        setSelectedSubscriptionRequest={jest.fn()}
        selectedSubscriptionRequest={{ci_tax_code: "TAX CODE"}}
        setOpenMenageSubscriptionModal={spySetModal}
        stateType={SubscriptionStateType.Waiting}
      />
    );

    expect(screen.queryByTestId("subscription-delete-button")).not.toBeInTheDocument();
    const acceptButton = screen.getByTestId("subscription-accept-button");
    const rejectButton = screen.getByTestId("subscription-reject-button");

    fireEvent.click(acceptButton);
    expect(spySetModal).toBeCalledWith("accept");

    fireEvent.click(rejectButton);
    expect(spySetModal).toBeCalledWith("reject");
  });

  test('render component CommissionBundleSubscriptionsDrawer open for request already accepted', async () => {
    render(
      <CommissionBundleSubscriptionsDrawer
        t={jest.fn()}
        setSelectedSubscriptionRequest={jest.fn()}
        selectedSubscriptionRequest={{ci_tax_code: "TAX CODE"}}
        setOpenMenageSubscriptionModal={spySetModal}
        stateType={SubscriptionStateType.Accepted}
      />
    );

    expect(screen.queryByTestId("subscription-accept-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("subscription-reject-button")).not.toBeInTheDocument();
    const deleteButton = screen.getByTestId("subscription-delete-button");

    fireEvent.click(deleteButton);
    expect(spySetModal).toBeCalledWith("delete");
  });
});
