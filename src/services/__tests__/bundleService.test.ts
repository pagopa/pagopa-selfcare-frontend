import { BackofficeApi } from '../../api/BackofficeClient';
import { TypeEnum } from '../../api/generated/portal/BundleRequest';
import { SubscriptionStateType } from '../../model/CommissionBundle';
import {
  mockedBundleCreateResponse,
  mockedBundleRequest,
  mockedCiBundleAttributeResource,
  mockedCIBundleRequest,
  mockedCiSubscriptionDetail,
  mockedCiSubscriptionList,
  mockedCommissionBundleCiList,
  mockedCommissionBundlePspDetailGlobal,
  mockedCommissionBundlePspList,
  mockedPSPTaxonomyList,
  mockedTouchpoints,
} from '../__mocks__/bundleService';
import {
  acceptBundleSubscriptionRequest,
  createBundle,
  createCIBundleRequest,
  deleteCIBundleRequest,
  deleteCIBundleSubscription,
  deletePSPBundle,
  getBundleDetailByPSP,
  getBundleListByPSP,
  getCisBundles,
  getBundleCISubscriptions,
  getBundleCISubscriptionsDetail,
  getSpecificBuiltInData,
  getTouchpoints,
  rejectPublicBundleSubscription,
  updatePSPBundle,
  deletePrivateBundleOffer,
  createCIBundleOffers,
  acceptPrivateBundleOffer,
  rejectPrivateBundleOffer,
  exportPSPBundleList,
} from '../bundleService';

describe('BundleService test mocked', () => {
  test('Test getBundlesByPsp', async () => {
    const response = await getBundleListByPSP({
      bundleType: TypeEnum.GLOBAL,
      pageLimit: 5,
      bundleName: 'bundleName',
      page: 0,
      pspCode: 'pspCode',
    });
    expect(response).toMatchObject(mockedCommissionBundlePspList);
  });
  test('Test createBundle', async () => {
    const response = await createBundle('pspTaxCode', mockedBundleRequest);
    expect(response).toMatchObject(mockedBundleCreateResponse);
  });
  test('Test getTouchpoints', async () => {
    const response = await getTouchpoints(0, 0);
    expect(response).toMatchObject(mockedTouchpoints);
  });
  test('Test getBundleDetailByPSP', async () => {
    const response = await getBundleDetailByPSP('pspTaxCode', 'bundleId');
    expect(response).toMatchObject(mockedCommissionBundlePspDetailGlobal);
  });
  test('Test deletePSPBundle', async () => {
    expect(
      deletePSPBundle('pspTaxCode', 'bundleId', 'bundleName', 'pspName', 'PUBLIC')
    ).resolves.not.toThrow();
  });
  test('Test updatePSPBundle', async () => {
    expect(updatePSPBundle('pspTaxCode', 'bundleId', mockedBundleRequest)).resolves.not.toThrow();
  });
  test('Test getCisBundles', async () => {
    const response = await getCisBundles({
      bundleType: TypeEnum.GLOBAL,
      pageLimit: 5,
      bundleName: 'bundleName',
      page: 0,
      ciTaxCode: 'ciTaxCode',
      bundleStatus: SubscriptionStateType.Accepted,
    });
    expect(response).toMatchObject(mockedCommissionBundleCiList);
  });
  test('Test acceptBundleSubscriptionRequest', async () => {
    expect(
      acceptBundleSubscriptionRequest('pspTaxCode', 'bundleRequestId', 'ciTaxCode', 'bundleName')
    ).resolves.not.toThrow();
  });
  test('Test rejectPublicBundleSubscription', async () => {
    expect(
      rejectPublicBundleSubscription('pspTaxCode', 'bundleRequestId', 'ciTaxCode', 'bundleName')
    ).resolves.not.toThrow();
  });
  test('Test getPublicBundleCISubscriptions', async () => {
    const response = await getBundleCISubscriptions({
      idBundle: 'idBundle',
      pspTaxCode: 'pspTaxCode',
      ciTaxCode: 'ciTaxCode',
      limit: 10,
      page: 0,
      status: SubscriptionStateType.Accepted,
      bundleType: TypeEnum.PRIVATE,
    });
    expect(response).toMatchObject(mockedCiSubscriptionList);
  });
  test('Test getPublicBundleCISubscriptionsDetail', async () => {
    const response = await getBundleCISubscriptionsDetail({
      idBundle: 'idBundle',
      pspTaxCode: 'pspTaxCode',
      ciTaxCode: 'ciTaxCode',
      status: SubscriptionStateType.Accepted,
      bundleType: TypeEnum.PRIVATE,
    });
    expect(response).toMatchObject(mockedCiSubscriptionDetail);
  });
  test('Test deleteCIBundleSubscription', async () => {
    expect(
      deleteCIBundleSubscription('idBundle', 'ciTaxCode', 'bundleName')
    ).resolves.not.toThrow();
  });
  test('Test deleteCIBundleRequest', async () => {
    expect(
      deleteCIBundleRequest({ idBundleRequest: 'idBundleRequest', ciTaxCode: 'ciTaxCode' })
    ).resolves.not.toThrow();
  });
  test('Test createCIBundleRequest', async () => {
    expect(
      createCIBundleRequest({
        ciTaxCode: 'ciTaxCode',
        bundleRequest: mockedCIBundleRequest,
        bundleName: 'bundleName',
      })
    ).resolves.not.toThrow();
  });
  test('Test deletePrivateBundleOffer', async () => {
    expect(
      deletePrivateBundleOffer({
        idBundle: 'idBundle',
        pspTaxCode: 'pspTaxCode',
        bundleOfferId: 'bundleOfferId',
        ciTaxCode: 'ciTaxCode',
        bundleName: 'bundleName',
      })
    ).resolves.not.toThrow();
  });
  test('Test createCIBundleOffers', async () => {
    expect(
      createCIBundleOffers({
        idBundle: 'idBundle',
        pspTaxCode: 'pspTaxCode',
        bundleName: 'bundleName',
        ciTaxCodeList: ['ciTaxCode'],
      })
    ).resolves.not.toThrow();
  });
  test('Test acceptPrivateBundleOffer', async () => {
    expect(
      acceptPrivateBundleOffer({
        ciTaxCode: 'ciTaxCode',
        idBundleOffer: 'idBundleOffer',
        pspTaxCode: 'pspTaxCode',
        bundleName: 'bundleName',
        ciBundleAttributes: mockedCiBundleAttributeResource,
      })
    ).resolves.not.toThrow();
  });
  test('Test rejectPrivateBundleOffer', async () => {
    expect(
      rejectPrivateBundleOffer({
        ciTaxCode: 'ciTaxCode',
        idBundleOffer: 'idBundleOffer',
        pspTaxCode: 'pspTaxCode',
        bundleName: 'bundleName',
      })
    ).resolves.not.toThrow();
  });
  test('Test exportPSPBundleList', async () => {
    expect(
      exportPSPBundleList({
        pspTaxCode: 'pspTaxCode',
        bundleType: [TypeEnum.GLOBAL],
      })
    ).resolves.not.toThrow();
  });
});

describe('BundleService test client', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Test getBundlesByPsp', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'getBundlesByPsp')
      .mockReturnValue(new Promise((resolve) => resolve({})));
    expect(
      getBundleListByPSP({
        bundleType: TypeEnum.GLOBAL,
        pageLimit: 5,
        bundleName: 'bundleName',
        page: 0,
        pspCode: 'pspCode',
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test createBundle', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'createBundle')
      .mockReturnValue(new Promise((resolve) => resolve({})));
    expect(createBundle('pspTaxCode', mockedBundleRequest)).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getTouchpoints', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'getTouchpoints')
      .mockReturnValue(new Promise((resolve) => resolve({})));
    expect(getTouchpoints(0, 0)).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getBundleDetailByPSP', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'getBundleDetailByPSP')
      .mockReturnValue(new Promise((resolve) => resolve(mockedCommissionBundlePspDetailGlobal)));
    expect(getBundleDetailByPSP('pspTaxCode', 'bundleId')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test deletePSPBundle', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'deletePSPBundle')
      .mockReturnValue(new Promise((resolve) => resolve()));
    expect(
      deletePSPBundle('pspTaxCode', 'bundleId', 'bundleName', 'pspName', 'PUBLIC')
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test updatePSPBundle', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'updatePSPBundle')
      .mockReturnValue(new Promise((resolve) => resolve()));
    expect(updatePSPBundle('pspTaxCode', 'bundleId', mockedBundleRequest)).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getCisBundles', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'getCisBundles')
      .mockReturnValue(new Promise((resolve) => resolve({})));
    expect(
      getCisBundles({
        bundleType: TypeEnum.GLOBAL,
        pageLimit: 5,
        bundleName: 'bundleName',
        page: 0,
        ciTaxCode: 'ciTaxCode',
        bundleStatus: SubscriptionStateType.Accepted,
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test acceptBundleSubscriptionRequest', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'acceptBundleSubscriptionRequest')
      .mockReturnValue(new Promise((resolve) => resolve()));
    expect(
      acceptBundleSubscriptionRequest('pspTaxCode', 'bundleRequestId', 'ciTaxCode', 'bundleName')
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test rejectPublicBundleSubscription', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'rejectPublicBundleSubscription')
      .mockReturnValue(new Promise((resolve) => resolve()));
    expect(
      rejectPublicBundleSubscription('pspTaxCode', 'bundleRequestId', 'ciTaxCode', 'bundleName')
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getPublicBundleCISubscriptions', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'getBundleCISubscriptions')
      .mockReturnValue(new Promise((resolve) => resolve({})));
    expect(
      getBundleCISubscriptions({
        idBundle: 'idBundle',
        pspTaxCode: 'pspTaxCode',
        ciTaxCode: 'ciTaxCode',
        limit: 10,
        page: 0,
        status: SubscriptionStateType.Accepted,
        bundleType: TypeEnum.PRIVATE,
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getPublicBundleCISubscriptionsDetail', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'getBundleCISubscriptionsDetail')
      .mockReturnValue(new Promise((resolve) => resolve({})));
    expect(
      getBundleCISubscriptionsDetail({
        idBundle: 'idBundle',
        pspTaxCode: 'pspTaxCode',
        ciTaxCode: 'ciTaxCode',
        status: SubscriptionStateType.Accepted,
        bundleType: TypeEnum.PRIVATE,
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test deleteCIBundleSubscription', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'deleteCIBundleSubscription')
      .mockReturnValue(Promise.resolve());
    expect(
      deleteCIBundleSubscription('idBundle', 'ciTaxCode', 'bundleName')
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test deleteCIBundleRequest', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'deleteCIBundleRequest')
      .mockReturnValue(Promise.resolve());
    expect(
      deleteCIBundleRequest({ idBundleRequest: 'idBundleRequest', ciTaxCode: 'ciTaxCode' })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test createCIBundleRequest', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'createCIBundleRequest')
      .mockReturnValue(Promise.resolve());
    expect(
      createCIBundleRequest({
        ciTaxCode: 'ciTaxCode',
        bundleRequest: mockedCIBundleRequest,
        bundleName: 'bundleName',
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test deletePrivateBundleOffer', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'deletePrivateBundleOffer')
      .mockReturnValue(Promise.resolve());
    expect(
      deletePrivateBundleOffer({
        idBundle: 'idBundle',
        pspTaxCode: 'pspTaxCode',
        bundleOfferId: 'bundleOfferId',
        ciTaxCode: 'ciTaxCode',
        bundleName: 'bundleName',
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test createCIBundleOffers', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'createCIBundleOffers')
      .mockReturnValue(Promise.resolve());
    expect(
      createCIBundleOffers({
        idBundle: 'idBundle',
        pspTaxCode: 'pspTaxCode',
        bundleName: 'bundleName',
        ciTaxCodeList: ['ciTaxCode'],
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });

  test('Test acceptPrivateBundleOffer', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'acceptPrivateBundleOffer')
      .mockReturnValue(Promise.resolve({ idCiBundle: 'idCiBundle' }));
    expect(
      acceptPrivateBundleOffer({
        ciTaxCode: 'ciTaxCode',
        idBundleOffer: 'idBundleOffer',
        pspTaxCode: 'pspTaxCode',
        bundleName: 'bundleName',
        ciBundleAttributes: mockedCiBundleAttributeResource,
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test rejectPrivateBundleOffer', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'rejectPrivateBundleOffer')
      .mockReturnValue(Promise.resolve());
    expect(
      rejectPrivateBundleOffer({
        ciTaxCode: 'ciTaxCode',
        idBundleOffer: 'idBundleOffer',
        pspTaxCode: 'pspTaxCode',
        bundleName: 'bundleName',
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test exportPSPBundleList', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.bundles, 'exportPSPBundleList')
      .mockReturnValue(Promise.resolve(new Buffer('')));
    expect(
      exportPSPBundleList({
        pspTaxCode: 'pspTaxCode',
        bundleType: [TypeEnum.GLOBAL],
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
});

describe('Test BundleService utils', () => {
  const mockTFunc = (path: string) => 'mockTFunc';
  let taxonomy = mockedPSPTaxonomyList[0];
  test('getSpecificBuiltInData taxonomy id present', () => {
    expect(getSpecificBuiltInData(mockTFunc, taxonomy.specificBuiltInData)).toBe(
      taxonomy.specificBuiltInData
    );
  });
  test('getSpecificBuiltInData taxonomy id null', () => {
    taxonomy.specificBuiltInData = undefined;
    expect(getSpecificBuiltInData(mockTFunc, taxonomy.specificBuiltInData)).toBe(mockTFunc(''));
  });
});
