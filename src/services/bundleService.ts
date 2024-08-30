import { TFunction } from 'react-i18next';
import { BackofficeApi } from '../api/BackofficeClient';
import { BundleCreateResponse } from '../api/generated/portal/BundleCreateResponse';
import { BundleRequest, TypeEnum } from '../api/generated/portal/BundleRequest';
import { CIBundleAttributeResource } from '../api/generated/portal/CIBundleAttributeResource';
import { CIBundleId } from '../api/generated/portal/CIBundleId';
import { CIBundlesResource } from '../api/generated/portal/CIBundlesResource';
import { PSPBundleResource } from '../api/generated/portal/PSPBundleResource';
import { PSPBundlesResource } from '../api/generated/portal/PSPBundlesResource';
import { PublicBundleRequest } from '../api/generated/portal/PublicBundleRequest';
import { Touchpoints } from '../api/generated/portal/Touchpoints';
import {
  BundleCiSubscriptionsDetailMethodParams,
  BundleCISubscriptionsMethodParams,
  SubscriptionStateType,
} from '../model/CommissionBundle';
import {
  createCommissionBundle,
  deletePSPBundle as deletePSPBundleMock,
  getBundleCISubscriptionsDetailMock,
  getBundleCISubscriptionsMock,
  getCommissionBundleCi,
  getCommissionBundleDetails,
  getCommissionBundlePsp,
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
  maxPaymentAmountOrder,
  paymentAmountMinRange,
  paymentAmountMaxRange,
  validBefore,
  validAfter,
  expireBefore,
  expireAfter,
}: {
  bundleType: string;
  pageLimit: number;
  page: number;
  pspCode: string;
  bundleName?: string;
  maxPaymentAmountOrder?: string;
  paymentAmountMinRange?: number;
  paymentAmountMaxRange?: number;
  validBefore?: string;
  validAfter?: string;
  expireBefore?: string;
  expireAfter?: string;
}): Promise<PSPBundlesResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getCommissionBundlePsp();
  } else {
    return BackofficeApi.bundles.getBundlesByPsp({
      bundleType,
      pageLimit,
      page,
      pspCode,
      bundleName,
      maxPaymentAmountOrder,
      paymentAmountMinRange,
      paymentAmountMaxRange,
      validBefore,
      validAfter,
      expireBefore,
      expireAfter,
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
    return BackofficeApi.bundles.createBundle(pspTaxCode, bundle);
  }
};

export const getTouchpoints = (page: number, pageLimit: number): Promise<Touchpoints> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getTouchpointsMock();
  } else {
    return BackofficeApi.bundles.getTouchpoints(page, pageLimit);
  }
};

export const getBundleDetailByPSP = (
  pspTaxCode: string,
  bundleId: string
): Promise<PSPBundleResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getCommissionBundleDetails();
  } else {
    return BackofficeApi.bundles.getBundleDetailByPSP(pspTaxCode, bundleId);
  }
};

export const deletePSPBundle = (
  pspTaxCode: string,
  bundleId: string,
  bundleName: string,
  pspName: string,
  bundleType: string
): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return deletePSPBundleMock();
  } else {
    return BackofficeApi.bundles.deletePSPBundle(
      pspTaxCode,
      bundleId,
      bundleName,
      pspName,
      bundleType
    );
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
    return BackofficeApi.bundles.updatePSPBundle(pspTaxCode, bundleId, bundle);
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
    return BackofficeApi.bundles.getCisBundles({
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
    return BackofficeApi.bundles.acceptBundleSubscriptionRequest(
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
    return BackofficeApi.bundles.rejectPublicBundleSubscription(
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
    return BackofficeApi.bundles.getBundleCISubscriptions({
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
    return BackofficeApi.bundles.getBundleCISubscriptionsDetail({
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
    return BackofficeApi.bundles.deleteCIBundleSubscription(ciBundleId, ciTaxCode, bundleName);
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
    return BackofficeApi.bundles.deleteCIBundleRequest({
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
    return BackofficeApi.bundles.createCIBundleRequest({
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
    return BackofficeApi.bundles.deletePrivateBundleOffer({
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
    return BackofficeApi.bundles.createCIBundleOffers({
      idBundle,
      pspTaxCode,
      bundleName,
      ciTaxCodeList,
    });
  }
};

export const acceptPrivateBundleOffer = ({
  ciTaxCode,
  idBundleOffer,
  pspTaxCode,
  bundleName,
  ciBundleAttributes,
}: {
  ciTaxCode: string;
  idBundleOffer: string;
  pspTaxCode: string;
  bundleName: string;
  ciBundleAttributes: CIBundleAttributeResource;
}): Promise<CIBundleId> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve({ idCiBundle: 'idCiBundle' });
  } else {
    return BackofficeApi.bundles.acceptPrivateBundleOffer({
      ciTaxCode,
      idBundleOffer,
      pspTaxCode,
      bundleName,
      ciBundleAttributes,
    });
  }
};

export const rejectPrivateBundleOffer = ({
  ciTaxCode,
  idBundleOffer,
  pspTaxCode,
  bundleName,
}: {
  ciTaxCode: string;
  idBundleOffer: string;
  pspTaxCode: string;
  bundleName: string;
}): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve();
  } else {
    return BackofficeApi.bundles.rejectPrivateBundleOffer({
      ciTaxCode,
      idBundleOffer,
      pspTaxCode,
      bundleName,
    });
  }
};

export const exportPSPBundleList = ({
  pspTaxCode,
  bundleType,
}: {
  pspTaxCode: string;
  bundleType: Array<TypeEnum>;
}): Promise<Buffer> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve(new Buffer(''));
  } else {
    return BackofficeApi.bundles.exportPSPBundleList({
      pspTaxCode,
      bundleType,
    });
  }
};

export const getSpecificBuiltInData = (t: TFunction, specificBuiltInData?: string) =>
  specificBuiltInData ? specificBuiltInData : t('commissionBundlesPage.allTaxonomies');
