
import { BackofficeApi } from '../api/BackofficeClient';
import { BundleRequest } from '../api/generated/portal/BundleRequest';
import { Bundles } from '../api/generated/portal/Bundles';
import { Touchpoints } from '../api/generated/portal/Touchpoints';
import { createCommissionPackage, getCommissionPackagePsp, getTouchpoints as getTouchpointsMock } from './__mocks__/bundleService';

// /bundles endpoint

export const getBundleListByPSP = (
  bundleType: string,
  pageLimit: number,
  bundleName: string,
  page: number,
  pspCode: string
): Promise<Bundles> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getCommissionPackagePsp(bundleName);
  } else {
    return BackofficeApi.getBundlesByPsp(bundleType, pageLimit, bundleName, page, pspCode);
  }
};

export const createBundle = (
  pspTaxCode: string,
  bundle: BundleRequest
): Promise<Bundles> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return createCommissionPackage(bundle);
  } else {
    return BackofficeApi.createBundle(pspTaxCode, bundle);
  }
};

export const getTouchpoints = (page: number, pageLimit: number): Promise<Touchpoints> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getTouchpointsMock();
  } else {
    return BackofficeApi.getTouchpoints(page, pageLimit);
  }
};