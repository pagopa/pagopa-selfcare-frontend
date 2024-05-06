import { BackofficeApi } from '../api/BackofficeClient';
import { BundleResource } from '../api/generated/portal/BundleResource';
import { BundleCreateResponse } from '../api/generated/portal/BundleCreateResponse';
import { BundleRequest } from '../api/generated/portal/BundleRequest';
import { BundlesResource } from '../api/generated/portal/BundlesResource';
import { Touchpoints } from '../api/generated/portal/Touchpoints';
import {
  PublicBundleCiSubscriptionsDetailMethodParams,
  PublicBundleCISubscriptionsMethodParams,
} from '../model/CommissionBundle';
import { PublicBundleRequest } from '../api/generated/portal/PublicBundleRequest';
import {
  createCommissionBundle,
  getCommissionBundleDetails,
  getCommissionBundlePsp,
  getTouchpoints as getTouchpointsMock,
  deletePSPBundle as deletePSPBundleMock,
  updatePSPBundle as updatePSPBundleMock,
  getPublicBundleCISubscriptionsMock,
  getPublicBundleCISubscriptionsDetailMock,
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

export const getBundleDetailByPSP = (
  pspTaxCode: string,
  bundleId: string
): Promise<BundleResource> => {
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

export const updatePSPBundle = (
  pspTaxCode: string,
  bundleId: string,
  bundle: BundleRequest
): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return updatePSPBundleMock();
  } else {
    return BackofficeApi.updatePSPBundle(pspTaxCode, bundleId, bundle);
  }
};

export const getCisBundles = (
  bundleType: string,
  pageLimit: number,
  bundleName: string,
  page: number,
  cisTaxCode: string | undefined
): Promise<BundlesResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getCommissionBundlePsp(bundleName);
  } else {
    return BackofficeApi.getCisBundles(bundleType, pageLimit, bundleName, page, cisTaxCode);
  }
};

export const acceptBundleSubscriptionRequest = (
  pspTaxCode: string,
  idBundleRequest: string
): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve();
  } else {
    return BackofficeApi.acceptBundleSubscriptionRequest(pspTaxCode, idBundleRequest);
  }
};

export const rejectPublicBundleSubscription = (
  pspTaxCode: string,
  bundleRequestId: string
): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve();
  } else {
    return BackofficeApi.rejectPublicBundleSubscription(pspTaxCode, bundleRequestId);
  }
};

export const getPublicBundleCISubscriptions = ({
  idBundle,
  pspTaxCode,
  ciTaxCode,
  limit,
  page,
  status,
}: PublicBundleCISubscriptionsMethodParams) => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getPublicBundleCISubscriptionsMock();
  } else {
    return BackofficeApi.getPublicBundleCISubscriptions({
      idBundle,
      pspTaxCode,
      ciTaxCode,
      limit,
      page,
      status,
    });
  }
};

export const getPublicBundleCISubscriptionsDetail = ({
  idBundle,
  pspTaxCode,
  ciTaxCode,
  status,
}: PublicBundleCiSubscriptionsDetailMethodParams) => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getPublicBundleCISubscriptionsDetailMock();
  } else {
    return BackofficeApi.getPublicBundleCISubscriptionsDetail({
      idBundle,
      pspTaxCode,
      ciTaxCode,
      status,
    });
  }
};

export const deleteCIBundleSubscription = (
  ciBundleId: string,
  ciTaxCode: string,
  bundleName: string
) => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve();
  } else {
    return BackofficeApi.deleteCIBundleSubscription(ciBundleId, ciTaxCode, bundleName);
  }
};

export const deleteCIBundleRequest = ({
  idBundleRequest,
  ciTaxCode,
}: {
  idBundleRequest: string;
  ciTaxCode: string;
}) => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve();
  } else {
    return BackofficeApi.deleteCIBundleRequest({
      idBundleRequest,
      ciTaxCode,
    });
  }
};

export const createCIBundleRequest = ({
  ciTaxCode,
  bundleRequest,
  bundleName,
}: {
  ciTaxCode: string;
  bundleRequest: PublicBundleRequest;
  bundleName: string;
}) => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve();
  } else {
    return BackofficeApi.createCIBundleRequest({
      ciTaxCode,
      bundleRequest,
      bundleName,
    });
  }
};
