import { BackofficeApi } from '../api/BackofficeClient';
import { BundleResource } from '../api/generated/portal/BundleResource';
import { BundleCreateResponse } from '../api/generated/portal/BundleCreateResponse';
import { BundleRequest } from '../api/generated/portal/BundleRequest';
import { BundlesResource } from '../api/generated/portal/BundlesResource';
import { Touchpoints } from '../api/generated/portal/Touchpoints';
import {
  createCommissionBundle,
  getCommissionBundleDetails,
  getCommissionBundlePsp,
  getTouchpoints as getTouchpointsMock,
  deletePSPBundle as deletePSPBundleMock
} from './__mocks__/bundleService';

// /bundles endpoint

export const getBundleListByPSP = (
  bundleType: string,
  pageLimit: number,
  bundleName: string,
  page: number,
  pspCode: string
): Promise<BundlesResource> => {
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

export const getBundleDetailByPSP = (pspTaxCode: string, bundleId: string): Promise<BundleResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getCommissionBundleDetails();
  } else {
    return BackofficeApi.getBundleDetailByPSP(pspTaxCode, bundleId);
  }
};

export const deletePSPBundle = (pspTaxCode: string, bundleId: string): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return deletePSPBundleMock();
  } else {
    return BackofficeApi.deletePSPBundle(pspTaxCode, bundleId);
  }
};
