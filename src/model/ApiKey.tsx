import { OrgTypes } from '../hooks/useOrganizationType';
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
  ACA: { id: 'ACA', key: 'aca-' },
  QI_FDR_KPI: { id: 'QI_FDR_KPI', key: 'qifdrkpiservice-' },
};

/* eslint-disable functional/immutable-data */
export const getApiKeyProducts = (
  orgType: OrgTypes,
  flagPrintNotice: boolean
): Array<ConfiguredProductKeys> => {
  const isPsp = orgType.isPsp || orgType.isPspBroker;
  const isEc = orgType.isEc || orgType.isEcBroker;

  const list = [API_KEY_PRODUCTS.NODOAUTH];

  if (isPsp) {
    list.push(API_KEY_PRODUCTS.BO_EXT_PSP);
  }

  if (isEc) {
    list.push(
      API_KEY_PRODUCTS.BO_EXT_EC,
      API_KEY_PRODUCTS.GPD,
      API_KEY_PRODUCTS.GPD_PAY,
      API_KEY_PRODUCTS.GPD_REP,
      API_KEY_PRODUCTS.BIZ,
      API_KEY_PRODUCTS.ACA
    );
    if (flagPrintNotice) {
      list.push(API_KEY_PRODUCTS.PRINT_NOTICE);
    }
  }

  if (isPsp) {
    list.push(API_KEY_PRODUCTS.QI_FDR_KPI);
  }

    if (isPsp) {
      list.push(API_KEY_PRODUCTS.FDR_PSP);
    }
    if (isEc) {
      list.push(API_KEY_PRODUCTS.FDR_ORG);
    }

  return list;
};
