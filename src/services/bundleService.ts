import { BackofficeApi } from '../api/BackofficeClient';
import { Bundles } from '../api/generated/portal/Bundles';
import { getCommissionPackagePsp } from './__mocks__/commissionPackageService';

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
