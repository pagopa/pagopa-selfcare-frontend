import { PaymentTypeResource } from '../../api/generated/portal/PaymentTypeResource';
import { mockedPaymentTypes } from '../__mocks__/channelService';

export type CommissionPackageResource = {
  packageName: string;
  startDate: Date;
  endDate: Date;
  touchpoint: string;
  paymentType: PaymentTypeResource;
  rangeAmountFrom: number;
  rangeAmountTo: number;
};

export type CommissionPackageListResource = {
  commPackagesList: Array<CommissionPackageResource>;
  pageInfo: {
    items_found: number;
    limit: number;
    page: number;
    total_pages: number;
  };
};

export const mockedCommissionPackagePspList: CommissionPackageListResource = {
  commPackagesList: [
    {
      packageName: 'Lorem ipsum',
      startDate: new Date(),
      endDate: new Date(),
      touchpoint: 'Checkout',
      paymentType: mockedPaymentTypes.payment_types[0],
      rangeAmountFrom: 0,
      rangeAmountTo: 150,
    },
  ],
  pageInfo: {
    items_found: 1,
    limit: 10,
    page: 0,
    total_pages: 1,
  },
};

export const getCommissionPackagePsp = (
  _brokerCode: string
): Promise<CommissionPackageListResource> =>
  new Promise((resolve) => resolve(mockedCommissionPackagePspList));
