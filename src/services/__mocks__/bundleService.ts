import { Bundle } from '../../api/generated/portal/Bundle';
import { BundleCreateResponse } from '../../api/generated/portal/BundleCreateResponse';
import { BundleRequest, TypeEnum } from '../../api/generated/portal/BundleRequest';
import { Bundles } from '../../api/generated/portal/Bundles';
import { Touchpoints } from '../../api/generated/portal/Touchpoints';
import { mockedChannelsMerged } from './channelService';
import { mockedPaymentTypes } from './configurationService';

export const mockedTouchpoints: Touchpoints = {
  touchpoints: [
    { created_date: new Date(), id: 'tutti', name: 'Tutti' },
    { created_date: new Date(), id: 'appio', name: 'App IO' },
    { created_date: new Date(), id: 'checkout', name: 'Checkout' },
  ],
};

const baseCommissionBundlePspDetail: Bundle = {
  idBundle: 'idBundle',
  digitalStamp: false,
  digitalStampRestriction: true,
  idChannel: 'idChannel',
  idBrokerPsp: 'idBrokerPsp',
  name: 'Commission Bundle Name',
  description: 'Commission bundle description',
  paymentAmount: 55.56,
  minPaymentAmount: 40,
  maxPaymentAmount: 150.1,
  paymentType: 'MYBK',
  touchpoint: 'PSP',
  transferCategoryList: ["9/0705103TS/","9/0705102TS/", "9/0712103SP/", "9/1001100TS/", "9/1201106IM/", "9/0702155TS/" ],
  validityDateFrom: new Date('2024-02-17'),
  validityDateTo: new Date('2024-02-22'),
  insertedDate: new Date('2024-02-15T09:36:04.792731104'),
  lastUpdatedDate: new Date('2024-02-17T09:36:04.792731104'),
};

export const mockedBundleRequest: BundleRequest = {};

export const mockedCommissionBundlePspDetailGlobal: Bundle = {
  ...baseCommissionBundlePspDetail,
  type: TypeEnum.GLOBAL,
};

export const mockedCommissionBundlePspDetailPrivate: Bundle = {
  ...baseCommissionBundlePspDetail,
  type: TypeEnum.PRIVATE,
};

export const mockedCommissionBundlePspDetailPublic: Bundle = {
  ...baseCommissionBundlePspDetail,
  type: TypeEnum.PUBLIC,
};

export const mockedCommissionBundlePspList: Bundles = {
  bundles: [mockedCommissionBundlePspDetailGlobal],
  pageInfo: {
    items_found: 1,
    limit: 10,
    page: 0,
    total_pages: 1,
  },
};

export const mockedChannelsIdList: Array<string> = mockedChannelsMerged!.channels!.map((e) =>
  typeof e.channel_code !== 'undefined' ? e.channel_code : ''
);

export const getChannelsId = (_page: number, _brokerCode: string): Promise<Array<string>> =>
  Promise.resolve(mockedChannelsIdList);

export const getCommissionBundlePsp = (_brokerCode: string): Promise<Bundles> =>
  Promise.resolve(mockedCommissionBundlePspList);

export const getCommissionBundleDetails = (type?: string): Promise<Bundle> =>
  Promise.resolve(
    !type || type === TypeEnum.GLOBAL
      ? mockedCommissionBundlePspDetailGlobal
      : type === TypeEnum.PRIVATE
      ? mockedCommissionBundlePspDetailPrivate
      : mockedCommissionBundlePspDetailPublic
  );

export const mockedBundleCreateResponse = { idBundle: 'mockedCommissionBundleId' };
export const createCommissionBundle = (_body: BundleRequest): Promise<BundleCreateResponse> =>
  Promise.resolve(mockedBundleCreateResponse);

export const updateCommissionBundle = (
  _name: string,
  _commissionBundle: BundleRequest
): Promise<Bundle> => Promise.resolve(mockedCommissionBundlePspDetailGlobal);

export const getTouchpoints = (): Promise<Touchpoints> => Promise.resolve(mockedTouchpoints);

export const deletePSPBundle = (): Promise<void> =>
  new Promise((resolve) => resolve());
