
import { BackofficeApi } from '../api/BackofficeClient';
import { BundleCreateResponse } from '../api/generated/portal/BundleCreateResponse';
import { BundleRequest } from '../api/generated/portal/BundleRequest';
import { Bundles } from '../api/generated/portal/Bundles';
import { Touchpoints } from '../api/generated/portal/Touchpoints';
import { createCommissionBundle, getCommissionBundlePsp, getTouchpoints as getTouchpointsMock } from './__mocks__/bundleService';

// /bundles endpoint

export const getBundleListByPSP = (
  bundleType: string,
  pageLimit: number,
  bundleName: string,
  page: number,
  pspCode: string
): Promise<Bundles> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getCommissionBundlePsp(bundleName);
  } else {
    return BackofficeApi.getBundlesByPsp(bundleType, pageLimit, bundleName, page, pspCode);
  }
};

export const createBundle = (
  pspTaxCode: string,
  bundle: BundleRequest
): Promise<BundleCreateResponse> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return createCommissionBundle(bundle);
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