import React from 'react';
import { render, screen } from '@testing-library/react';
import { RequestStateType } from '../../../../../../model/CommissionBundle';
import { getSubscriptionStatusChip } from '../CommissionBundleDetailSubscriptionDrawer';

const mockTFunction = (key: string) => {
  switch (key) {
    case 'commissionBundlesPage.commissionBundleDetail.requestsTable.name':
      return 'Business Name';
    case 'commissionBundlesPage.commissionBundleDetail.requestsTable.taxCode':
      return 'Tax Code';
    case 'commissionBundlesPage.commissionBundleDetail.requestsTable.state':
      return 'State';
    default:
      return '';
  }
};

describe('Test getSubscriptionStatusChip', () => {
  test('Test status chip cell with waiting request', () => {
    render(<>{getSubscriptionStatusChip(mockTFunction, RequestStateType.Waiting, "")}</>);

    expect(screen.queryByTestId('WAITING-state-chip')).toBeInTheDocument();
    expect(screen.queryByTestId('ACCEPTED-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('WARNING-state-chip')).not.toBeInTheDocument();
  });

  test('Test status chip cell with accepted request', () => {
    render(<>{getSubscriptionStatusChip(mockTFunction, RequestStateType.Accepted, "")}</>);

    expect(screen.queryByTestId('WAITING-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ACCEPTED-state-chip')).toBeInTheDocument();
    expect(screen.queryByTestId('WARNING-state-chip')).not.toBeInTheDocument();
  });

  test('Test status chip cell with on removal request', () => {
    render(<>{getSubscriptionStatusChip(mockTFunction, RequestStateType.Accepted, "", true)}</>);

    expect(screen.queryByTestId('WAITING-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ACCEPTED-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('DELETING-state-chip')).toBeInTheDocument();
  });
});
