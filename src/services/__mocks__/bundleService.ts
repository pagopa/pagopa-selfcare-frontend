import { BundleRequest, TypeEnum } from '../../api/generated/portal/BundleRequest';
import { Bundles } from '../../api/generated/portal/Bundles';
import { Taxonomies } from '../../api/generated/portal/Taxonomies';
import { Touchpoints } from '../../api/generated/portal/Touchpoints';
import { mockedStationsMerged } from './channelService';
import { mockedPaymentTypes } from './configurationService';

export const mockedTouchpoints: Touchpoints = {
  touchpoints: [
    { created_date: new Date(), id: 'tutti', name: 'Tutti' },
    { created_date: new Date(), id: 'appio', name: 'App IO' },
    { created_date: new Date(), id: 'checkout', name: 'Checkout' },
  ],
};

export const mockedCommissionPackagePspList: Bundles = {
  bundles: [
    {
      name: 'Lorem ipsum',
      validityDateFrom: new Date(),
      validityDateTo: new Date(),
      touchpoint: 'Checkout',
      paymentType: mockedPaymentTypes?.payment_types?.[0]?.payment_type,
      minPaymentAmount: 0,
      maxPaymentAmount: 150,
    },
  ],
  pageInfo: {
    items_found: 1,
    limit: 10,
    page: 0,
    total_pages: 1,
  },
};

export const mockedCommissionPackagePspDetail: BundleRequest = {
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
  paymentType: mockedPaymentTypes?.payment_types?.[0]?.payment_type,
  touchpoint: mockedTouchpoints?.touchpoints?.[0]?.name,
  transferCategoryList: ['100 - Rendite catastali (ICI, IMU, TUC, ecc.) '],
  type: TypeEnum.GLOBAL,
  validityDateFrom: new Date(),
  validityDateTo: new Date(),
};

export const mockedChannelsIdList: Array<string> = mockedStationsMerged!.channels!.map((e) =>
  typeof e.channel_code !== 'undefined' ? e.channel_code : ''
);

export const getChannelsId = (_page: number, _brokerCode: string): Promise<Array<string>> =>
  new Promise((resolve) => resolve(mockedChannelsIdList));

export const getCommissionPackagePsp = (_brokerCode: string): Promise<Bundles> =>
  new Promise((resolve) => resolve(mockedCommissionPackagePspList));

export const getCommissionPackageDetails = (_name: string): Promise<BundleRequest> =>
  new Promise((resolve) => resolve(mockedCommissionPackagePspDetail));

export const createCommissionPackage = (_body: BundleRequest): Promise<BundleRequest> =>
  new Promise((resolve) => resolve(mockedCommissionPackagePspDetail));

export const updateCommissionPackage = (
  _name: string,
  _commissionPackage: BundleRequest
): Promise<BundleRequest> => new Promise((resolve) => resolve(mockedCommissionPackagePspDetail));

export const getTouchpoints = (): Promise<Touchpoints> =>
  new Promise((resolve) => resolve(mockedTouchpoints));
