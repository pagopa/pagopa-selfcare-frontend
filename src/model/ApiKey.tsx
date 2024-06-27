import { TFunction } from 'react-i18next';
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

export const API_KEY_PRODUCTS = (t: TFunction, isPsp: boolean): Array<ConfiguredProductKeys> => {
  const list = isPsp
    ? ['NODOAUTH', 'BO_EXT_PSP']
    : ['NODOAUTH', 'GPD', 'GPD_PAY', 'GPD_REP', 'BIZ', 'BO_EXT_EC', 'PRINT_NOTICE'];

  if (ENV.FEATURES.FDR.ENABLED) {
    // eslint-disable-next-line functional/immutable-data
    list.push(isPsp ? 'FDR_PSP' : 'FDR_ORG');
  }
  return list.map((el) => ({ id: el, key: t(`addApiKeyPage.products.${el}`) }));
};
