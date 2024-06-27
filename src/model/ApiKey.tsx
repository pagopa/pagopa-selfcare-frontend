import { ENV } from '../utils/env';

export type ProductKeys = {
  id: string;
  displayName: string;
  primaryKey: string;
  secondaryKey: string;
};

export type AvailableProductKeys = {
  id: string;
  title: string;
  disabled: boolean;
};

export type ConfiguredProductKeys = {
  id: string;
  key: string;
};

export const API_KEY_PRODUCTS = {
  NODOAUTH: { id: 'NODOAUTH', key: 'nodauth-' },
  GPD: { id: 'GPD', key: 'gdp-' },
  GPD_REP: { id: 'GPD_REP', key: 'gpdrep-' },
  GPD_PAY: { id: 'GPD_PAY', key: 'gpdpay-' },
  BIZ: { id: 'BIZ', key: 'biz-' },
  FDR_ORG: { id: 'FDR_ORG', key: 'fdrorg-' },
  FDR_PSP: { id: 'FDR_PSP', key: 'fdrpsp-' },
  BO_EXT_EC: { id: 'BO_EXT_EC', key: 'selfcareboexternalec-' },
  BO_EXT_PSP: { id: 'BO_EXT_PSP', key: 'selfcareboexternalpsp-' },
  PRINT_NOTICE: { id: 'PRINT_NOTICE', key: 'printnotice-' },
};

export const getApiKeyProducts = (isPsp: boolean): Array<ConfiguredProductKeys> => {
  const list = isPsp
    ? [API_KEY_PRODUCTS.NODOAUTH, API_KEY_PRODUCTS.BO_EXT_PSP]
    : [
        API_KEY_PRODUCTS.NODOAUTH,
        API_KEY_PRODUCTS.GPD,
        API_KEY_PRODUCTS.GPD_PAY,
        API_KEY_PRODUCTS.GPD_REP,
        API_KEY_PRODUCTS.BIZ,
        API_KEY_PRODUCTS.BO_EXT_EC,
        API_KEY_PRODUCTS.PRINT_NOTICE,
      ];

  if (ENV.FEATURES.FDR.ENABLED) {
    // eslint-disable-next-line functional/immutable-data
    list.push(isPsp ? API_KEY_PRODUCTS.FDR_PSP : API_KEY_PRODUCTS.FDR_ORG);
  }
  return list;
};
