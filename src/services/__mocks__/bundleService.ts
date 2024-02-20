import { BundleCreateResponse } from '../../api/generated/portal/BundleCreateResponse';
import { BundleRequest, TypeEnum } from '../../api/generated/portal/BundleRequest';
import { Bundles } from '../../api/generated/portal/Bundles';
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

export const mockedCommissionBundlePspList: Bundles = {
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

export const mockedCommissionBundlePspDetail: BundleRequest = {
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
  Promise.resolve(mockedChannelsIdList);

export const getCommissionBundlePsp = (_brokerCode: string): Promise<Bundles> =>
  Promise.resolve(mockedCommissionBundlePspList);

export const getCommissionBundleDetails = (_name: string): Promise<BundleRequest> =>
  Promise.resolve(mockedCommissionBundlePspDetail);

export const createCommissionBundle = (_body: BundleRequest): Promise<BundleCreateResponse> =>
  Promise.resolve({idBundle:'mockedCommissionBundleId'});

export const updateCommissionBundle = (
  _name: string,
  _commissionBundle: BundleRequest
): Promise<BundleRequest> => Promise.resolve(mockedCommissionBundlePspDetail);

export const getTouchpoints = (): Promise<Touchpoints> => Promise.resolve(mockedTouchpoints);
