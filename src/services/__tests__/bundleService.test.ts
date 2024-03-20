import { BackofficeApi } from '../../api/BackofficeClient';
import { TypeEnum } from '../../api/generated/portal/BundleRequest';
import {
  mockedBundleCreateResponse,
  mockedBundleRequest,
  mockedCommissionBundlePspDetailGlobal,
  mockedCommissionBundlePspList,
  mockedTouchpoints,
} from '../__mocks__/bundleService';
import {
  createBundle,
  deletePSPBundle,
  getBundleDetailByPSP,
  getBundleListByPSP,
  getCisBundles,
  getTouchpoints,
  updatePSPBundle,
} from '../bundleService';

describe('BundleService test mocked', () => {
  test('Test getBundlesByPsp', async () => {
    const response = await getBundleListByPSP(TypeEnum.GLOBAL, 0, 'bundleName', 0, 'pspTaxCode');
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
    expect(deletePSPBundle('pspTaxCode', 'bundleId')).resolves.not.toThrow();
  });
  test('Test updatePSPBundle', async () => {
    expect(updatePSPBundle('pspTaxCode', 'bundleId', mockedBundleRequest)).resolves.not.toThrow();
  });
  test('Test getCisBundles', async () => {
    const response = await getCisBundles(TypeEnum.GLOBAL, 0, 'bundleName', 0, 'cisTaxCode');
    expect(response).toMatchObject(mockedCommissionBundlePspList);
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
    const spyOn = jest.spyOn(BackofficeApi, "getBundlesByPsp").mockReturnValue(new Promise((resolve) => resolve({})));
    expect(getBundleListByPSP(TypeEnum.GLOBAL, 0, 'bundleName', 0, 'pspTaxCode')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test createBundle', async () => {
    const spyOn = jest.spyOn(BackofficeApi, "createBundle").mockReturnValue(new Promise((resolve) => resolve({})));
    expect(createBundle('pspTaxCode', mockedBundleRequest)).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getTouchpoints', async () => {
    const spyOn = jest.spyOn(BackofficeApi, "getTouchpoints").mockReturnValue(new Promise((resolve) => resolve({})));
    expect(getTouchpoints(0, 0)).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getBundleDetailByPSP', async () => {
    const spyOn = jest.spyOn(BackofficeApi, "getBundleDetailByPSP").mockReturnValue(new Promise((resolve) => resolve({})));
    expect(getBundleDetailByPSP('pspTaxCode', 'bundleId')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test deletePSPBundle', async () => {
    const spyOn = jest.spyOn(BackofficeApi, "deletePSPBundle").mockReturnValue(new Promise((resolve) => resolve()));
    expect(deletePSPBundle('pspTaxCode', 'bundleId')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test updatePSPBundle', async () => {
    const spyOn = jest.spyOn(BackofficeApi, "updatePSPBundle").mockReturnValue(new Promise((resolve) => resolve()));
    expect(updatePSPBundle('pspTaxCode', 'bundleId', mockedBundleRequest)).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getCisBundles', async () => {
    const spyOn = jest.spyOn(BackofficeApi, "getCisBundles").mockReturnValue(new Promise((resolve) => resolve({})));
    expect(getCisBundles(TypeEnum.GLOBAL, 0, 'bundleName', 0, 'cisTaxCode')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
});
