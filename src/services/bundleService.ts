import { TFunction } from 'react-i18next';
import { BackofficeApi } from '../api/BackofficeClient';
import { BundleCreateResponse } from '../api/generated/portal/BundleCreateResponse';
import { BundleRequest } from '../api/generated/portal/BundleRequest';
import { Touchpoints } from '../api/generated/portal/Touchpoints';
import {
  BundleCiSubscriptionsDetailMethodParams,
  BundleCISubscriptionsMethodParams,
  SubscriptionStateType,
} from '../model/CommissionBundle';
import { PublicBundleRequest } from '../api/generated/portal/PublicBundleRequest';
import { PSPBundleResource } from '../api/generated/portal/PSPBundleResource';
import { CIBundlesResource } from '../api/generated/portal/CIBundlesResource';
import { PSPBundlesResource } from '../api/generated/portal/PSPBundlesResource';
import {
  createCommissionBundle,
  deletePSPBundle as deletePSPBundleMock,
  getCommissionBundleCi,
  getCommissionBundleDetails,
  getCommissionBundlePsp,
  getBundleCISubscriptionsDetailMock,
  getBundleCISubscriptionsMock,
  getTouchpoints as getTouchpointsMock,
  updatePSPBundle as updatePSPBundleMock,
} from './__mocks__/bundleService';

// /bundles endpoint

export const getBundleListByPSP = ({
  bundleType,
  pageLimit,
  page,
  pspCode,
  bundleName,
}: {
  bundleType: string;
  pageLimit: number;
  page: number;
  pspCode: string;
  bundleName?: string;
}): Promise<PSPBundlesResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getCommissionBundlePsp();
  } else {
    return BackofficeApi.getBundlesByPsp({
      bundleType,
      pageLimit,
      page,
      pspCode,
      bundleName,
    });
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
): Promise<PSPBundleResource> => {
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

export const getCisBundles = ({
  bundleType,
  pageLimit,
  bundleName,
  page,
  ciTaxCode,
  bundleStatus,
}: {
  bundleType: string;
  pageLimit: number;
  bundleName?: string;
  page: number;
  ciTaxCode?: string;
  bundleStatus?: SubscriptionStateType;
}): Promise<CIBundlesResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getCommissionBundleCi();
  } else {
    return BackofficeApi.getCisBundles({
      bundleType,
      pageLimit,
      bundleName,
      page,
      ciTaxCode,
      bundleStatus,
    });
  }
};

export const acceptBundleSubscriptionRequest = (
  pspTaxCode: string,
  idBundleRequest: string,
  ciTaxCode: string,
  bundleName: string
): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve();
  } else {
    return BackofficeApi.acceptBundleSubscriptionRequest(
      pspTaxCode,
      idBundleRequest,
      ciTaxCode,
      bundleName
    );
  }
};

export const rejectPublicBundleSubscription = (
  pspTaxCode: string,
  bundleRequestId: string,
  ciTaxCode: string,
  bundleName: string
): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve();
  } else {
    return BackofficeApi.rejectPublicBundleSubscription(
      pspTaxCode,
      bundleRequestId,
      ciTaxCode,
      bundleName
    );
  }
};

export const getBundleCISubscriptions = ({
  idBundle,
  pspTaxCode,
  ciTaxCode,
  limit,
  page,
  status,
  bundleType,
}: BundleCISubscriptionsMethodParams) => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getBundleCISubscriptionsMock();
  } else {
    return BackofficeApi.getBundleCISubscriptions({
      idBundle,
      pspTaxCode,
      ciTaxCode,
      limit,
      page,
      status,
      bundleType,
    });
  }
};

export const getBundleCISubscriptionsDetail = ({
  idBundle,
  pspTaxCode,
  ciTaxCode,
  status,
  bundleType,
}: BundleCiSubscriptionsDetailMethodParams) => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getBundleCISubscriptionsDetailMock();
  } else {
    return BackofficeApi.getBundleCISubscriptionsDetail({
      idBundle,
      pspTaxCode,
      ciTaxCode,
      status,
      bundleType,
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
  bundleRequest: Partial<PublicBundleRequest>;
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

export const deletePrivateBundleOffer = ({
  idBundle,
  pspTaxCode,
  bundleOfferId,
  ciTaxCode,
  bundleName,
}: {
  idBundle: string;
  pspTaxCode: string;
  bundleOfferId: string;
  ciTaxCode: string;
  bundleName: string;
}) => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve();
  } else {
    return BackofficeApi.deletePrivateBundleOffer({
      idBundle,
      pspTaxCode,
      bundleOfferId,
      ciTaxCode,
      bundleName,
    });
  }
};

export const createCIBundleOffers = ({
  idBundle,
  pspTaxCode,
  bundleName,
  ciTaxCodeList,
}: {
  idBundle: string;
  pspTaxCode: string;
  bundleName: string;
  ciTaxCodeList: Array<string>;
}): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve();
  } else {
    return BackofficeApi.createCIBundleOffers({
      idBundle,
      pspTaxCode,
      bundleName,
      ciTaxCodeList,
    });
  }
};

export const getSpecificBuiltInData = (t: TFunction, specificBuiltInData?: string) =>
  specificBuiltInData ? specificBuiltInData : t('commissionBundlesPage.allTaxonomies');
