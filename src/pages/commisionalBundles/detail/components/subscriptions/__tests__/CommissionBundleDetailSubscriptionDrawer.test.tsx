import React from 'react';
import {render, screen} from '@testing-library/react';
import {SubscriptionStateType} from '../../../../../../model/CommissionBundle';
import {getSubscriptionStatusChip} from '../CommissionBundleDetailSubscriptionDrawer';

const mockTFunction = (key: string) => {
    switch (key) {
        case 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable.name':
            return 'Business Name';
        case 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable.taxCode':
            return 'Tax Code';
        case 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable.state':
            return 'State';
        default:
            return '';
    }
};

describe('Test getSubscriptionStatusChip', () => {
    test('Test status chip cell with waiting request', () => {
        render(<>{getSubscriptionStatusChip(mockTFunction, SubscriptionStateType.Waiting, "")}</>);

        expect(screen.queryByTestId('WAITING-state-chip')).toBeInTheDocument();
        expect(screen.queryByTestId('ACCEPTED-state-chip')).not.toBeInTheDocument();
        expect(screen.queryByTestId('WARNING-state-chip')).not.toBeInTheDocument();
    });

    test('Test status chip cell with accepted request', () => {
        render(<>{getSubscriptionStatusChip(mockTFunction, SubscriptionStateType.Accepted, "")}</>);

        expect(screen.queryByTestId('WAITING-state-chip')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ACCEPTED-state-chip')).toBeInTheDocument();
        expect(screen.queryByTestId('WARNING-state-chip')).not.toBeInTheDocument();
    });

    test('Test status chip cell with on removal request', () => {
        render(<>{getSubscriptionStatusChip(mockTFunction, SubscriptionStateType.Accepted, "", true)}</>);

        expect(screen.queryByTestId('WAITING-state-chip')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ACCEPTED-state-chip')).not.toBeInTheDocument();
        expect(screen.queryByTestId('DELETING-state-chip')).toBeInTheDocument();
    });
});
