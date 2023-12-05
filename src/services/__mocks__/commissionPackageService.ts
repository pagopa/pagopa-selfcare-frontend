import { PaymentTypes } from '../../api/generated/portal/PaymentTypes';
import {
  CommissionPackageListResource,
  CommissionPackageOnCreation,
  TaxonomyServicesResource,
  TouchpointsResource,
} from '../../model/CommissionPackage';
import { mockedPaymentTypes, mockedStationsMerged } from '../__mocks__/channelService';

export const mockedCommissionPackagePspList: CommissionPackageListResource = {
  commPackagesList: [
    {
      packageName: 'Lorem ipsum',
      startDate: new Date(),
      endDate: new Date(),
      touchpoint: 'Checkout',
      paymentType: mockedPaymentTypes!.payment_types![0],
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

export const mockedTouchpoints: TouchpointsResource = {
  touchpointList: [{ touchpoint: 'Tutti' }, { touchpoint: 'App Io' }, { touchpoint: 'Checkout' }],
};

export const mockedTaxonomy: TaxonomyServicesResource = {
  taxonomyServiceList: [{ taxonomyService: '100 - Rendite catastali (ICI, IMU, TUC, ecc.)' }],
};

export const mockedCommissionPackagePspDetail: CommissionPackageOnCreation = {
  abi: '12345',
  description: 'Pacchetti commissione',
  digitalStamp: true,
  digitalStampRestriction: false,
  idBrokerPsp: '12345UK6789',
  idCdi: '12345UK6789',
  idChannel: '97735020584_01',
  maxPaymentAmount: 1500,
  minPaymentAmount: 150,
  name: 'Pacchetto 1',
  paymentAmount: 10,
  paymentType: mockedPaymentTypes!.payment_types![0],
  touchpoint: mockedTouchpoints,
  transferCategoryList: ['100 - Rendite catastali (ICI, IMU, TUC, ecc.) '],
  type: 'GLOBAL',
  validityDateFrom: new Date(),
  validityDateTo: new Date(),
};

export const mockedChannelsIdList: Array<string> = mockedStationsMerged!.channels!.map((e) =>
  typeof e.channel_code !== 'undefined' ? e.channel_code : ''
);

export const getChannelsId = (_page: number, _brokerCode: string): Promise<Array<string>> =>
  new Promise((resolve) => resolve(mockedChannelsIdList));

export const getCommissionPackagePsp = (
  _brokerCode: string
): Promise<CommissionPackageListResource> =>
  new Promise((resolve) => resolve(mockedCommissionPackagePspList));

export const getPaymentTypes = (): Promise<PaymentTypes> =>
  new Promise((resolve) => resolve(mockedPaymentTypes));

export const getCommissionPackageDetails = (_name: string): Promise<CommissionPackageOnCreation> =>
  new Promise((resolve) => resolve(mockedCommissionPackagePspDetail));

export const createCommissionPackage = (
  _body: CommissionPackageOnCreation
): Promise<CommissionPackageOnCreation> =>
  new Promise((resolve) => resolve(mockedCommissionPackagePspDetail));

export const updateCommissionPackage = (
  _name: string,
  _commissionPackage: CommissionPackageOnCreation
): Promise<CommissionPackageOnCreation> =>
  new Promise((resolve) => resolve(mockedCommissionPackagePspDetail));

export const getTouchpoint = (): Promise<TouchpointsResource> =>
  new Promise((resolve) => resolve(mockedTouchpoints));

export const getTaxonomyService = (): Promise<TaxonomyServicesResource> =>
  new Promise((resolve) => resolve(mockedTaxonomy));
